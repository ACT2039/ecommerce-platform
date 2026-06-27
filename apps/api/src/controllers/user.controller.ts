import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { catchAsync } from '../utils/catchAsync';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id; // Available because of protect middleware
  const user = await userService.getProfile(userId);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await userService.updateProfile(userId, req.body);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});
