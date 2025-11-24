import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Appointment } from '@/types';

export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await api.get('/appointments');
      // API returns { appointments: [] } after unwrapping by interceptor
      const data = response as any;
      return (data?.appointments || []) as Appointment[];
    },
  });
};
