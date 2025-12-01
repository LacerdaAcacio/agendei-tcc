import { toast } from 'sonner';

import { DAYS } from './constants';
import type { Availability, DaySchedule } from './types';

export function useAvailabilityScheduler(
  value: Availability,
  onChange: (value: Availability) => void,
) {
  const handleDayChange = (day: string, field: keyof DaySchedule, newValue: boolean | string) => {
    const updated = {
      ...value,
      [day]: {
        ...value[day],
        [field]: newValue,
      },
    };
    onChange(updated);
  };

  const copyToAll = (sourceDay: string) => {
    const sourceSchedule = value[sourceDay];
    const updated = { ...value };

    DAYS.forEach(({ key }) => {
      if (key !== sourceDay) {
        updated[key] = { ...sourceSchedule };
      }
    });

    onChange(updated);
    toast.success('Horários copiados para todos os dias!');
  };

  return {
    handleDayChange,
    copyToAll,
  };
}
