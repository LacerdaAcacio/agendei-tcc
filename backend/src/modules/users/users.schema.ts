import { z } from 'zod';

// Create User Schema
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
    document: z.string().min(11, 'Document must be valid'),
    documentType: z.enum(['CPF', 'CNPJ']),
  }),
});

// Update User Schema
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    phone: z.string().optional(),
    role: z.enum(['client', 'provider', 'admin']).optional(),
    avatarUrl: z.string().optional(),
    currentPassword: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

// Login Schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Get User Schema
export const getUserSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

// Delete User Schema
export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
