import { api } from '@/lib/api';
import type { Service } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useServiceDetails(id: string | undefined) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      if (!id) return null;
      
      const response = await api.get(`/services/${id}`);
      
      const data = response as unknown as { service?: Service, data?: { service?: Service } } | Service;
      
      // Check if data is the Service object itself
      if ('id' in data && 'title' in data) {
        return data as Service;
      }
      
      if ('service' in data && data.service) {
        return data.service;
      }
      
      if ('data' in data && data.data?.service) {
        return data.data.service;
      }
      
      return data as unknown as Service;
    },
    enabled: !!id,
  });
}
