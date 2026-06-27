import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';
import { CouponType } from '@prisma/client';

export interface CreateCouponInput {
  code: string;
  type: CouponType;
  value: number;
  maxUses?: number;
  expiresAt?: Date;
  minOrderAmount?: number;
}

export const createCoupon = async (data: CreateCouponInput) => {
  const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
  if (existing) throw new AppError('Coupon code already exists', 400);

  return await prisma.coupon.create({ data });
};

export const getAllCoupons = async () => {
  return await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
};

export const deleteCoupon = async (id: string) => {
  await prisma.coupon.delete({ where: { id } });
  return true;
};
