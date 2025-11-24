import type { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { z } from 'zod';

import { createServiceSchema } from './constants';

export type CreateServiceForm = z.infer<typeof createServiceSchema>;

export type ServiceType = 'PRESENTIAL' | 'DIGITAL';

// Common form props for sections
export interface FormSectionProps {
  register: UseFormRegister<CreateServiceForm>;
  setValue: UseFormSetValue<CreateServiceForm>;
  watch: UseFormWatch<CreateServiceForm>;
  errors: FieldErrors<CreateServiceForm>;
}
