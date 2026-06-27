import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    sku: z.string().optional(),
    price: z.number().positive('Price must be greater than 0'),
    compareAtPrice: z.number().positive().optional().nullable(),
    brand: z.string().optional().nullable(),
    categoryIds: z.array(z.string().uuid()).optional(),
    inventoryQuantity: z.number().int().nonnegative('Inventory cannot be negative').default(0),
    images: z.array(z.string().url('Invalid image URL')).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    sku: z.string().optional(),
    price: z.number().positive().optional(),
    compareAtPrice: z.number().positive().optional().nullable(),
    brand: z.string().optional().nullable(),
    categoryIds: z.array(z.string().uuid()).optional(),
    inventoryQuantity: z.number().int().nonnegative().optional(),
    images: z.array(z.string().url()).optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
});

export const productQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(Number),
    limit: z.string().regex(/^\d+$/).optional().transform(Number),
    search: z.string().optional(),
    minPrice: z.string().regex(/^\d+(\.\d+)?$/).optional().transform(Number),
    maxPrice: z.string().regex(/^\d+(\.\d+)?$/).optional().transform(Number),
    category: z.string().optional(), // category slug
    brand: z.string().optional(),
    inStock: z.string().transform((val) => val === 'true').optional(),
    sort: z.enum(['newest', 'price_asc', 'price_desc', 'rating']).optional(),
  }),
});
