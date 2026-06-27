import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';
import { stripe } from '../config/stripe';
import { Decimal } from '@prisma/client/runtime/library';

export const createCheckoutSession = async (userId: string, shippingAddressId: string, billingAddressId?: string) => {
  // 1. Fetch user's cart
  const cart = await prisma.cart.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: {
      items: {
        include: {
          product: { include: { inventory: true } },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // 2. Validate Inventory
  for (const item of cart.items) {
    const stock = item.product?.inventory?.quantity || 0;
    if (item.quantity > stock) {
      throw new AppError(`Not enough stock for ${item.product?.title}`, 400);
    }
  }

  // 3. Calculate Totals (MVP: flat shipping, 0 tax for now to simplify, or fixed)
  const subtotal = cart.items.reduce((acc, item) => acc + Number(item.totalPrice), 0);
  const shippingAmount = subtotal > 100 ? 0 : 10; // Free shipping over 100
  const taxAmount = subtotal * 0.08; // 8% flat tax
  const total = subtotal + shippingAmount + taxAmount;

  // 4. Atomic Transaction: Create Order, reserve inventory
  const { order } = await prisma.$transaction(async (tx) => {
    // Create Order
    const newOrder = await tx.order.create({
      data: {
        userId,
        shippingAddressId,
        billingAddressId: billingAddressId || shippingAddressId,
        subtotal,
        shippingAmount,
        taxAmount,
        total,
        status: 'PENDING',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            title: item.product?.title || 'Unknown Product',
            sku: item.product?.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    // Reserve Inventory
    for (const item of cart.items) {
      if (item.product?.inventory) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            quantity: { decrement: item.quantity },
            reserved: { increment: item.quantity },
          },
        });
      }
    }

    return { order: newOrder };
  });

  // 5. Create Stripe Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100), // Stripe expects cents
    currency: 'usd',
    metadata: {
      orderId: order.id,
      userId,
    },
  });

  // 6. Create Payment Record
  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: 'stripe',
      providerPaymentId: paymentIntent.id,
      amount: total,
      currency: 'usd',
      status: 'PENDING',
    },
  });

  return {
    orderId: order.id,
    clientSecret: paymentIntent.client_secret,
    total,
  };
};
