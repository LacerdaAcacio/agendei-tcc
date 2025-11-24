import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import type { CreateServiceForm } from '../../types';

export interface AvailabilitySectionProps {
  setValue: UseFormSetValue<CreateServiceForm>;
  watch: UseFormWatch<CreateServiceForm>;
}
