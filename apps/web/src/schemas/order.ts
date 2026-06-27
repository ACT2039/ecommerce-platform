import { z } from 'zod';

export const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    addressLine1: z.string().min(1, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().optional(),
  }),
  paymentMethod: z.enum(['CREDIT_CARD', 'PAYPAL', 'CASH_ON_DELIVERY']),
  billingAddress: z.any().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
