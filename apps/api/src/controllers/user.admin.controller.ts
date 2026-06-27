import { Request, Response } from 'express';
import * as userAdminService from '../services/user.admin.service';
import { catchAsync } from '../utils/catchAsync';
import { Role } from '@prisma/client';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '10', 10);
  const search = req.query.search as string;

  const result = await userAdminService.getAllUsers(page, limit, search);
  res.status(200).json({ status: 'success', data: result });
});

export const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { role } = req.body;
  const user = await userAdminService.updateUserRole(req.params.id, role as Role);
  res.status(200).json({ status: 'success', data: user });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userAdminService.deleteUser(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});
