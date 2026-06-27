import { Request, Response } from 'express';
import * as analyticsService from '../services/analytics.service';
import { catchAsync } from '../utils/catchAsync';

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await analyticsService.getDashboardKPIs();
  res.status(200).json({ status: 'success', data: stats });
});
