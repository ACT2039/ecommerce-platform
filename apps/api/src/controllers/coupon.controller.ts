import { Request, Response } from 'express';
import * as couponService from '../services/coupon.service';
import { catchAsync } from '../utils/catchAsync';

export const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const coupon = await couponService.createCoupon(req.body);
  res.status(201).json({ status: 'success', data: coupon });
});

export const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const coupons = await couponService.getAllCoupons();
  res.status(200).json({ status: 'success', data: coupons });
});

export const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  await couponService.deleteCoupon(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});
