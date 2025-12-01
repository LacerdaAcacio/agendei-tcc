import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t('validation.email.required') })
      .email({ message: t('validation.email.invalid') }),
    password: z
      .string()
      .min(1, { message: t('validation.password.required') })
      .min(6, t('validation.password.minLength', { min: 6 })),
  });
