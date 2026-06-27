import { prisma } from '../prisma/client';
import { stripe } from '../config/stripe';
import Stripe from 'stripe';

export const handleStripeWebhook = async (payload: Buffer, signature: string) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy';
  
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await handleSuccessfulPayment(orderId, paymentIntent.id);
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await handleFailedPayment(orderId, paymentIntent.id);
    }
  }

  return { received: true };
};

const handleSuccessfulPayment = async (orderId: string, paymentIntentId: string) => {
  await prisma.$transaction(async (tx) => {
    // 1. Update Payment Status
    await tx.payment.updateMany({
      where: { providerPaymentId: paymentIntentId },
      data: { status: 'COMPLETED' },
    });

    // 2. Update Order Status
    const order = await tx.order.update({
      where: { id: orderId },
      data: { status: 'PROCESSING' },
      include: { items: true },
    });

    // 3. Deduct reserved inventory
    for (const item of order.items) {
      if (item.productId) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            reserved: { decrement: item.quantity },
          },
        });
      }
    }

    // 4. Clear user's cart (Assuming 1 active cart per user)
    if (order.userId) {
      const cart = await tx.cart.findFirst({ where: { userId: order.userId, status: 'ACTIVE' } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }
  });
};

const handleFailedPayment = async (orderId: string, paymentIntentId: string) => {
  await prisma.$transaction(async (tx) => {
    // 1. Update Payment Status
    await tx.payment.updateMany({
      where: { providerPaymentId: paymentIntentId },
      data: { status: 'FAILED' },
    });

    // 2. Update Order Status
    const order = await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: { items: true },
    });

    // 3. Revert reserved inventory back to available
    for (const item of order.items) {
      if (item.productId) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            reserved: { decrement: item.quantity },
            quantity: { increment: item.quantity },
          },
        });
      }
    }
  });
};
