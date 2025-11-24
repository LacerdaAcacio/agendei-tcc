import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Appointment } from '@/types';

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const response = await api.get(`/appointments/${id}`);
      const data = response as any;
      return (data?.appointment || data) as Appointment;
    },
    enabled: !!id,
  });
};
