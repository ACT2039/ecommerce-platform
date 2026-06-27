import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';
import { Decimal } from '@prisma/client/runtime/library';

export const getCart = async (userId: string) => {
  let cart = await prisma.cart.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              images: { take: 1, orderBy: { sortOrder: 'asc' } },
              inventory: { select: { quantity: true } },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
        status: 'ACTIVE',
      },
      include: { items: { include: { product: { select: { id: true, title: true, slug: true, price: true, images: { take: 1, orderBy: { sortOrder: 'asc' } }, inventory: { select: { quantity: true } } } } } } }
    });
  }

  return cart;
};

export const addToCart = async (userId: string, productId: string, quantity: number) => {
  const cart = await getCart(userId);

  const product = await prisma.product.findFirst({
    where: { id: productId, isPublished: true, deletedAt: null },
    include: { inventory: true },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const stock = product.inventory?.quantity || 0;
  
  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  const desiredQuantity = existingItem ? existingItem.quantity + quantity : quantity;

  if (desiredQuantity > stock) {
    throw new AppError(`Cannot add more than ${stock} items to cart (stock limit reached).`, 400);
  }

  const unitPrice = product.price;
  const totalPrice = new Decimal(unitPrice.toNumber() * desiredQuantity);

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: desiredQuantity,
        totalPrice,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: desiredQuantity,
        unitPrice,
        totalPrice,
      },
    });
  }

  return getCart(userId);
};

export const updateCartItemQuantity = async (userId: string, itemId: string, quantity: number) => {
  const cart = await getCart(userId);

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
    include: { product: { include: { inventory: true } } },
  });

  if (!item || !item.product) {
    throw new AppError('Cart item not found', 404);
  }

  const stock = item.product.inventory?.quantity || 0;

  if (quantity > stock) {
    throw new AppError(`Cannot set quantity to ${quantity}. Only ${stock} left in stock.`, 400);
  }

  const totalPrice = new Decimal(item.unitPrice.toNumber() * quantity);

  await prisma.cartItem.update({
    where: { id: itemId },
    data: {
      quantity,
      totalPrice,
    },
  });

  return getCart(userId);
};

export const removeCartItem = async (userId: string, itemId: string) => {
  const cart = await getCart(userId);

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
  });

  if (!item) {
    throw new AppError('Cart item not found', 404);
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return getCart(userId);
};

export const clearCart = async (userId: string) => {
  const cart = await getCart(userId);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return getCart(userId);
};
