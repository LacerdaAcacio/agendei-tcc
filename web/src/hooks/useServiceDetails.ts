import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Service } from '@/types';

export function useServiceDetails(id: string | undefined) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      if (!id) return null;
      // The interceptor unwraps the response, so 'response' is the actual data object
      const response = await api.get(`/services/${id}`);

      const data = response as unknown as
        | { service?: Service; data?: { service?: Service } }
        | Service;

      // Check if data is the Service object itself (has id, name, etc.)
      if ('id' in data && 'name' in data) {
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
