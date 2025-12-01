import { z } from 'zod';
import type { TFunction } from 'i18next';
import { validateCPF, validateCNPJ } from '@/lib/validators';

export const createRegisterSchema = (t: TFunction) =>
  z
    .object({
      name: z
        .string()
        .min(2, t('validation.name.minLength', { min: 2 }))
        .regex(/^[a-zA-Z\s]*$/, t('validation.name.invalid')),
      email: z.string().email(t('validation.email.invalid')),
      password: z.string().min(6, t('validation.password.minLength', { min: 6 })),
      confirmPassword: z.string(),
      phone: z.string().optional(),
      document: z
        .string()
        .min(1, t('validation.document.required'))
        .refine((doc) => {
          const cleanDoc = doc.replace(/[^\d]+/g, '');
          if (cleanDoc.length === 11) return validateCPF(cleanDoc);
          if (cleanDoc.length === 14) return validateCNPJ(cleanDoc);
          return false;
        }, t('validation.document.invalid')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.password.mismatch'),
      path: ['confirmPassword'],
    });
