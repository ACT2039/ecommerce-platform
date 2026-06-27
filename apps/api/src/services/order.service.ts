import { OrderStatus } from '@prisma/client';
import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';
import { stripe } from '../config/stripe';

interface OrderQuery {
  page?: string;
  limit?: string;
  status?: OrderStatus;
}

export const getUserOrders = async (userId: string, query: OrderQuery) => {
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '10', 10);
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(query.status && { status: query.status }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getOrderById = async (userId: string, orderId: string, isAdmin = false) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      shippingAddress: true,
      billingAddress: true,
      payments: true,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Ensure users can only see their own orders unless they are an admin
  if (!isAdmin && order.userId !== userId) {
    throw new AppError('Not authorized to view this order', 403);
  }

  return order;
};

export const cancelOrder = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== userId) {
    throw new AppError('Order not found', 404);
  }

  if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
    throw new AppError('Cannot cancel an order that has already been shipped or processed', 400);
  }

  return await prisma.$transaction(async (tx) => {
    const cancelledOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    // Revert inventory
    for (const item of order.items) {
      if (item.productId) {
        // Since it might have been in "reserved" if PENDING or deducted if PROCESSING.
        // We'll safely increment quantity if PROCESSING, or decrement reserved if PENDING.
        // For simplicity, assuming if it's PENDING, it's reserved. If PROCESSING, it was deducted.
        if (order.status === 'PENDING') {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              reserved: { decrement: item.quantity },
              quantity: { increment: item.quantity },
            },
          });
        } else if (order.status === 'PROCESSING') {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              quantity: { increment: item.quantity },
            },
          });
        }
      }
    }

    // Attempt Stripe Refund if it was already paid (PROCESSING usually means paid)
    if (order.status === 'PROCESSING') {
      const payment = await tx.payment.findFirst({
        where: { orderId: orderId, status: 'COMPLETED' },
      });

      if (payment && payment.providerPaymentId) {
        try {
          await stripe.refunds.create({
            payment_intent: payment.providerPaymentId,
          });
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: 'REFUNDED' },
          });
        } catch (error) {
          console.error('Stripe refund failed:', error);
          // Don't fail the cancellation, but in a real app might need manual review
        }
      }
    }

    return cancelledOrder;
  });
};

export const getAllOrders = async (query: OrderQuery) => {
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '10', 10);
  const skip = (page - 1) * limit;

  const where = {
    ...(query.status && { status: query.status }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const updateData: any = { status };

  switch (status) {
    case 'PROCESSING':
      updateData.processedAt = new Date();
      break;
    case 'SHIPPED':
      updateData.shippedAt = new Date();
      break;
    case 'DELIVERED':
      updateData.deliveredAt = new Date();
      break;
    case 'CANCELLED':
      updateData.cancelledAt = new Date();
      break;
    case 'REFUNDED':
      updateData.refundedAt = new Date();
      break;
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
  });

  // Handle auto-refund logic if admin changes status to REFUNDED
  if (status === 'REFUNDED') {
    const payment = order.payments.find(p => p.status === 'COMPLETED');
    if (payment && payment.providerPaymentId) {
      try {
        await stripe.refunds.create({
          payment_intent: payment.providerPaymentId,
        });
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'REFUNDED' },
        });
      } catch (error: any) {
        throw new AppError(`Stripe Refund Failed: ${error.message}`, 500);
      }
    }
  }

  return updatedOrder;
};

export const createOrder = async (userId: string, data: any) => {
  const { shippingAddress, billingAddress, paymentMethod } = data;

  const cart = await prisma.cart.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  let subtotal = 0;
  for (const item of cart.items) {
    subtotal += Number(item.unitPrice) * item.quantity;
  }
  const shippingCost = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + shippingCost + tax;

  return await prisma.$transaction(async (tx) => {
    // 1. Create Addresses
    const shipping = await tx.address.create({
      data: {
        userId,
        fullName: shippingAddress.fullName,
        line1: shippingAddress.addressLine1,
        line2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
        isDefault: false,
      },
    });

    let billingId = shipping.id;
    if (billingAddress) {
      const billing = await tx.address.create({
        data: {
          userId,
          fullName: billingAddress.fullName,
          line1: billingAddress.addressLine1,
          line2: billingAddress.addressLine2,
          city: billingAddress.city,
          state: billingAddress.state,
          postalCode: billingAddress.postalCode,
          country: billingAddress.country,
          phone: billingAddress.phone,
          isDefault: false,
        },
      });
      billingId = billing.id;
    }

    // 2. Create Order
    const order = await tx.order.create({
      data: {
        userId,
        status: 'PENDING',
        subtotal,
        shippingAmount: shippingCost,
        taxAmount: tax,
        total: totalAmount,
        shippingAddressId: shipping.id,
        billingAddressId: billingId,
      },
    });

    // 3. Create Order Items
    await tx.orderItem.createMany({
      data: cart.items.map(item => ({
        orderId: order.id,
        productId: item.productId,
        title: item.product?.title || 'Unknown Product',
        sku: item.product?.sku || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    });

    // 4. Update Inventory
    for (const item of cart.items) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: { decrement: item.quantity },
          reserved: { increment: item.quantity },
        },
      });
    }

    // 5. Create Payment Record (Mock)
    await tx.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        provider: 'MOCK',
        status: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'COMPLETED',
      },
    });

    if (paymentMethod !== 'CASH_ON_DELIVERY') {
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'PROCESSING', processedAt: new Date() },
      });
    }

    return order;
  });
};
