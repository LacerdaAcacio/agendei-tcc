import { z } from 'zod';

// Create Service Schema
export const createServiceSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be positive'),
    location: z.string().min(3, 'Location is required'),
    addressComplement: z.string().optional(),
    addressZipCode: z.string().optional(),
    addressStreet: z.string().optional(),
    addressNumber: z.string().optional(),
    addressNeighborhood: z.string().optional(),
    addressCity: z.string().optional(),
    addressState: z.string().optional(),

    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    categoryId: z.string().min(1, 'Category is required'),
    type: z.enum(['PRESENTIAL', 'DIGITAL']).default('PRESENTIAL'),
    hostYears: z.number().int().min(0).default(1),
    hostLanguages: z.array(z.string()).default(['Português']),
    hostJob: z.string().default('Profissional'),
    highlights: z.array(z.string()).default([]),
  }),
});

// Update Service Schema
export const updateServiceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Invalid service ID'),
  }),
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    price: z.number().positive('Price must be positive').optional(),
    location: z.string().min(3, 'Location is required').optional(),
    addressComplement: z.string().optional(),
    addressZipCode: z.string().optional(),
    addressStreet: z.string().optional(),
    addressNumber: z.string().optional(),
    addressNeighborhood: z.string().optional(),
    addressCity: z.string().optional(),
    addressState: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    images: z.array(z.string().url()).min(1, 'At least one image is required').optional(),
    categoryId: z.string().min(1, 'Category is required').optional(),
    type: z.enum(['PRESENTIAL', 'DIGITAL']).optional(),
    hostYears: z.number().int().min(0).optional(),
    hostLanguages: z.array(z.string()).optional(),
    hostJob: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  }),
});

// Search Services Schema
export const searchServicesSchema = z.object({
  query: z.object({
    location: z.string().optional(),
    categoryId: z.string().optional(),
    category: z.string().optional(), // Slug
    search: z.string().optional(), // Keyword
    type: z.enum(['PRESENTIAL', 'DIGITAL']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minPrice: z.string().transform(Number).optional(),
    maxPrice: z.string().transform(Number).optional(),
  }),
});

// Get Service Schema
export const getServiceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Invalid service ID'),
  }),
});

// Delete Service Schema
export const deleteServiceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Invalid service ID'),
  }),
});

// Type exports
export type CreateServiceInput = z.infer<typeof createServiceSchema>['body'];
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>['body'];
export type SearchServicesInput = z.infer<typeof searchServicesSchema>['query'];
