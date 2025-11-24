import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';

import { api } from '@/lib/axios';
import type { Service } from '@/types';

export function useBookingWidget(
  service: Service,
  onSubmit: (startDate: Date, endDate: Date) => Promise<void>,
) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const availabilityMap = useMemo(() => {
    if (!service?.availability) return null;
    if (typeof service.availability === 'string') {
      try {
        return JSON.parse(service.availability);
      } catch (e) {
        console.error('Erro ao parsear availability:', e);
        return null;
      }
    }
    return service.availability;
  }, [service]);

  const isDateDisabled = (date: Date) => {
    // Block past dates
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;

    // Block inactive days based on service availability
    if (availabilityMap) {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = days[date.getDay()];
      const dayConfig = availabilityMap[dayName];

      if (!dayConfig || !dayConfig.active) return true;
    }

    return false;
  };

  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  const { data: availableSlots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: ['slots', service.id, formattedDate],
    queryFn: async () => {
      if (!formattedDate) return [];
      const response = await api.get(`/services/${service.id}/slots?date=${formattedDate}`);
      return response.data.availableSlots || [];
    },
    enabled: !!formattedDate,
    staleTime: 0, // Always fetch fresh slots
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setIsCalendarOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(hours, minutes, 0, 0);

    const durationMinutes = service.duration || 60;
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    await onSubmit(startDate, endDate);

    // Clear selection after successful submit (if parent doesn't unmount/redirect)
    setSelectedTime(null);
  };

  return {
    selectedDate,
    selectedTime,
    isCalendarOpen,
    setIsCalendarOpen,
    availableSlots,
    isLoadingSlots,
    isDateDisabled,
    handleDateSelect,
    handleSubmit,
    setSelectedTime,
  };
}
