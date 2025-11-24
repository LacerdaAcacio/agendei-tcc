import type { UseFormSetValue, FieldErrors } from 'react-hook-form';

import type { CreateServiceForm } from '../../types';

export interface ImageUploadSectionProps {
  setValue: UseFormSetValue<CreateServiceForm>;
  errors: FieldErrors<CreateServiceForm>;
}
