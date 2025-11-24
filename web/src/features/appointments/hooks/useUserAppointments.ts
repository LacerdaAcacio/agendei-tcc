import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Appointment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useUserAppointments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
      
      // Use the user-specific endpoint for security
      const response = await api.get(`/appointments/user/${user.id}`);
      const data = response as any;
      return (data?.appointments || []) as Appointment[];
    },
    enabled: !!user?.id, // Only run query if user is logged in
  });
};
