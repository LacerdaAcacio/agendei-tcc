import { z } from 'zod';

export const createReportSchema = z.object({
  body: z.object({
    serviceId: z.string(),
    reason: z.string().min(3, 'Reason must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
  }),
});

export type CreateReportInput = z.infer<typeof createReportSchema>['body'];
