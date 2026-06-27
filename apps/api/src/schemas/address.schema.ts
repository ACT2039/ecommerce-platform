import { z } from 'zod';

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).optional(),
    line1: z.string().min(1).optional(),
    line2: z.string().optional(),
    city: z.string().min(1).optional(),
    state: z.string().optional(),
    postalCode: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    phone: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid address ID'),
  }),
});

export const deleteAddressSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid address ID'),
  }),
});
