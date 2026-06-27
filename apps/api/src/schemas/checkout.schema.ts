import { z } from 'zod';

export const createCheckoutSessionSchema = z.object({
  body: z.object({
    shippingAddressId: z.string().uuid('Invalid shipping address ID'),
    billingAddressId: z.string().uuid('Invalid billing address ID').optional(),
    couponCode: z.string().optional(),
  }),
});
