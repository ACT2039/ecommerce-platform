import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';

export const createAddress = async (userId: string, data: any) => {
  // If this is set as default, we should unset others
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return await prisma.address.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getAddresses = async (userId: string) => {
  return await prisma.address.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateAddress = async (addressId: string, userId: string, data: any) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId, deletedAt: null },
  });

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  // If this is set as default, we should unset others
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, id: { not: addressId } },
      data: { isDefault: false },
    });
  }

  return await prisma.address.update({
    where: { id: addressId },
    data,
  });
};

export const deleteAddress = async (addressId: string, userId: string) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId, deletedAt: null },
  });

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  // Soft delete
  return await prisma.address.update({
    where: { id: addressId },
    data: { deletedAt: new Date() },
  });
};
