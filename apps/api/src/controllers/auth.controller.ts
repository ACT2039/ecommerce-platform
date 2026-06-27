import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';

const cookieOptions: any = {
  expires: new Date(
    Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '90') * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await authService.register(req.body);

  res.cookie('jwt', token, cookieOptions);

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await authService.login(req.body);

  res.cookie('jwt', token, cookieOptions);

  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({ status: 'success' });
});
