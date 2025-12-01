import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createAppointmentSchema = (t: TFunction) =>
  z.object({
    serviceName: z.string().min(3, t('validation.service.minLength', { min: 3 })),
    date: z.string().refine((val) => new Date(val) > new Date(), {
      message: t('validation.date.future'),
    }),
    duration: z.coerce.number().min(15, t('validation.duration.min', { min: 15 })),
    description: z.string().optional(),
  });
