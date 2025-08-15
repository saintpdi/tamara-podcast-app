import { z } from 'zod';

// Auth form validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email is too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name is too long')
    .regex(/^[a-zA-Z0-9\s]+$/, 'Display name can only contain letters, numbers, and spaces'),
});

// Contact form validation
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email is too long'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject is too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),
});

// Profile validation
export const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username is too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name is too long'),
  bio: z
    .string()
    .max(500, 'Bio is too long')
    .optional(),
});

// Video/Podcast content validation
export const contentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title is too long'),
  description: z
    .string()
    .max(1000, 'Description is too long')
    .optional(),
  tags: z
    .array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type ContactData = z.infer<typeof contactSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
export type ContentData = z.infer<typeof contentSchema>;
