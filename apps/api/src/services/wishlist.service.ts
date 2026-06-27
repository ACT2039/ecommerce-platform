import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';

export const getWishlist = async (userId: string) => {
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
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
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
      include: { items: { include: { product: { select: { id: true, title: true, slug: true, price: true, images: { take: 1, orderBy: { sortOrder: 'asc' } }, inventory: { select: { quantity: true } } } } } } }
    });
  }

  return wishlist;
};

export const addToWishlist = async (userId: string, productId: string) => {
  const wishlist = await getWishlist(userId);

  const product = await prisma.product.findFirst({
    where: { id: productId, isPublished: true, deletedAt: null },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const existingItem = await prisma.wishlistItem.findFirst({
    where: { wishlistId: wishlist.id, productId },
  });

  if (!existingItem) {
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
    });
  }

  return getWishlist(userId);
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  const wishlist = await getWishlist(userId);

  const existingItem = await prisma.wishlistItem.findFirst({
    where: { wishlistId: wishlist.id, productId },
  });

  if (existingItem) {
    await prisma.wishlistItem.delete({
      where: { id: existingItem.id },
    });
  }

  return getWishlist(userId);
};
