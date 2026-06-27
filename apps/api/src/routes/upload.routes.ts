import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

const router = Router();

// Endpoint for single image upload
router.post(
  '/',
  protect,
  restrictTo('ADMIN'),
  upload.single('image'),
  catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError('Please provide an image file', 400);
    }

    // Cloudinary attaches the URL to req.file.path
    const imageUrl = req.file.path;

    res.status(200).json({
      status: 'success',
      data: {
        url: imageUrl,
      },
    });
  })
);

export default router;
