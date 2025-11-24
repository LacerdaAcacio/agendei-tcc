import type { Service } from '@/types';

export interface BookingWidgetProps {
  service: Service;
  onSubmit: (startDate: Date, endDate: Date) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
}
