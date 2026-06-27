import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';
import { catchAsync } from '../utils/catchAsync';

export const getCart = catchAsync(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!.id);
  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user!.id, productId, quantity);
  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

export const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  const { quantity } = req.body;
  const cart = await cartService.updateCartItemQuantity(req.user!.id, req.params.id, quantity);
  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

export const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  const cart = await cartService.removeCartItem(req.user!.id, req.params.id);
  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

export const clearCart = catchAsync(async (req: Request, res: Response) => {
  const cart = await cartService.clearCart(req.user!.id);
  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});
