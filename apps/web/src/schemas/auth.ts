import { z } from 'zod';

// Login schema
export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'Email or phone is required')
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      { message: 'Must be a valid email or phone number' }
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  phone: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^\+?[\d\s\-()]{10,}$/.test(value),
      'Invalid phone number format'
    ),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Update profile schema
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z
    .string()
    .refine(
      (value) => /^\+?[\d\s\-()]{10,}$/.test(value),
      'Invalid phone number format'
    )
    .optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
