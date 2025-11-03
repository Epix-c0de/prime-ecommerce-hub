import { z } from 'zod';

// Authentication validation schemas
export const signUpSchema = z.object({
  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  phone: z.string()
    .trim()
    .regex(/^(\+254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)'),
  firstName: z.string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  lastName: z.string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(255),
  password: z.string()
    .min(1, 'Password is required'),
});

export const resetPasswordSchema = z.object({
  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(255),
});

// Checkout validation schema
export const shippingSchema = z.object({
  firstName: z.string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  lastName: z.string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(255),
  phone: z.string()
    .trim()
    .regex(/^(\+254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number'),
  address: z.string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must be less than 500 characters'),
  city: z.string()
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  postalCode: z.string()
    .trim()
    .max(20, 'Postal code must be less than 20 characters')
    .optional()
    .or(z.literal('')),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type ShippingData = z.infer<typeof shippingSchema>;
