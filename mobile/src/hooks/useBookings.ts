import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Booking } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

export function useBookings() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const response = await api.get('/bookings');

        // Handle different response structures
        if (Array.isArray(response)) return response as Booking[];
        if ('bookings' in response && Array.isArray(response.bookings)) {
          return response.bookings as Booking[];
        }
        if ('data' in response && Array.isArray(response.data)) {
          return response.data as Booking[];
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const createBooking = useMutation({
    mutationFn: async (payload: { serviceId: string; startDate: string; endDate: string }) => {
      await api.post('/bookings', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error creating booking:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível realizar o agendamento.'
      );
    },
  });

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      await api.patch(`/bookings/${bookingId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      Alert.alert('Sucesso', 'Agendamento cancelado com sucesso.');
    },
    onError: (error: any) => {
      console.error('Error canceling booking:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível cancelar o agendamento.'
      );
    },
  });

  const rescheduleBooking = useMutation({
    mutationFn: async ({ bookingId, startDate, endDate }: { bookingId: string; startDate: string; endDate: string }) => {
      await api.put(`/bookings/${bookingId}`, { startDate, endDate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      Alert.alert('Sucesso', 'Agendamento reagendado com sucesso.');
    },
    onError: (error: any) => {
      console.error('Error rescheduling booking:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível reagendar o agendamento.'
      );
    },
  });

  return {
    bookings,
    isLoading,
    createBooking: createBooking.mutateAsync,
    cancelBooking: cancelBooking.mutate,
    rescheduleBooking: rescheduleBooking.mutate,
    isRescheduling: rescheduleBooking.isPending,
    isCreating: createBooking.isPending,
  };
}
