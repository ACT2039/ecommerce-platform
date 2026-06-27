import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { catchAsync } from '../utils/catchAsync';

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getCategories();
  res.status(200).json({
    status: 'success',
    data: { categories },
  });
});

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({
    status: 'success',
    data: { category },
  });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
