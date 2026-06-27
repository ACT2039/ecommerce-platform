import { Request, Response } from 'express';
import * as wishlistService from '../services/wishlist.service';
import { catchAsync } from '../utils/catchAsync';

export const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const wishlist = await wishlistService.getWishlist(req.user!.id);
  res.status(200).json({
    status: 'success',
    data: { wishlist },
  });
});

export const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const wishlist = await wishlistService.addToWishlist(req.user!.id, req.params.productId);
  res.status(200).json({
    status: 'success',
    data: { wishlist },
  });
});

export const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const wishlist = await wishlistService.removeFromWishlist(req.user!.id, req.params.productId);
  res.status(200).json({
    status: 'success',
    data: { wishlist },
  });
});
