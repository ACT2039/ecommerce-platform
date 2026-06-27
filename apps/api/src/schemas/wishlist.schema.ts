import { z } from 'zod';

export const wishlistSchema = z.object({
  params: z.object({
    productId: z.string().uuid('Invalid product ID'),
  }),
});
