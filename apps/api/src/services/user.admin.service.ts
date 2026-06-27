import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';
import { Role } from '@prisma/client';

export const getAllUsers = async (page: number = 1, limit: number = 10, search?: string) => {
  const skip = (page - 1) * limit;

  const where = search ? {
    OR: [
      { email: { contains: search, mode: 'insensitive' as const } },
      { name: { contains: search, mode: 'insensitive' as const } },
    ]
  } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        isEmailVerified: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const updateUserRole = async (userId: string, role: Role) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, email: true, name: true, role: true },
  });
  return user;
};

export const deleteUser = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } });
  return true;
};
