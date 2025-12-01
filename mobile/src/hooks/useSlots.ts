import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useSlots(serviceId: string, date: string | undefined) {
  return useQuery({
    queryKey: ['slots', serviceId, date],
    queryFn: async () => {
      if (!serviceId || !date) return [];
      
      try {
        console.log(`Fetching slots for serviceId: ${serviceId}, date: ${date}`);
        const response = await api.get(`/services/${serviceId}/slots`, {
          params: {
            date // API expects YYYY-MM-DD
          }
        });

        console.log('Slots API Response:', JSON.stringify(response, null, 2));

        // Backend returns { availableSlots: string[] }
        if (response && Array.isArray(response.availableSlots)) {
          return response.availableSlots as string[];
        }
        
        console.warn('Unexpected slots response structure:', response);
        return [];
      } catch (error) {
        console.error('Error fetching slots:', error);
        return [];
      }
    },
    enabled: !!serviceId && !!date,
    staleTime: 0, // Always fetch fresh slots
  });
}
