import { z } from 'zod';

export const createLoginSchema = (t: any) =>
  z.object({
    email: z.string().email(t('validation.email.invalid')),
    password: z.string().min(6, t('validation.password.minLength', { min: 6 })),
  });
