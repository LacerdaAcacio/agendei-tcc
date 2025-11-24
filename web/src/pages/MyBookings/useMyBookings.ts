import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/axios';
import type { Booking } from '@/types';

export function useMyBookings() {
  const queryClient = useQueryClient();
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const response = await api.get('/bookings');
      return (response as any).bookings as Booking[];
    },
  });

  const handleReschedule = async (startDate: Date, endDate: Date) => {
    if (!editingBooking) return;

    setIsRescheduling(true);
    try {
      await api.put(`/bookings/${editingBooking.id}`, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      toast.success('Reserva reagendada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      setEditingBooking(null);
    } catch (error) {
      console.error('Error rescheduling:', error);
      toast.error('Erro ao reagendar. Tente novamente.');
    } finally {
      setIsRescheduling(false);
    }
  };

  return {
    bookings,
    isLoading,
    editingBooking,
    setEditingBooking,
    isRescheduling,
    handleReschedule,
  };
}
