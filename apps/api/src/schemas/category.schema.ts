import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
    parentId: z.string().uuid('Invalid parent ID').optional().nullable(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    parentId: z.string().uuid().optional().nullable(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
});
