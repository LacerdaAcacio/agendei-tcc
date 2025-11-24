import { z } from 'zod';

// Create Booking Schema
export const createBookingSchema = z.object({
  body: z.object({
    serviceId: z.string({
      required_error: 'Service ID is required',
    }),
    startDate: z.string().datetime('Invalid start date format'),
    endDate: z.string().datetime('Invalid end date format'),
  }),
});

// Get Booking Schema
export const getBookingSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Booking ID is required',
    }),
  }),
});

// Update Booking Schema
export const updateBookingSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Booking ID is required',
    }),
  }),
  body: z.object({
    startDate: z.string().datetime('Invalid start date format'),
    endDate: z.string().datetime('Invalid end date format'),
  }),
});

// Type exports
export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>['body'];
