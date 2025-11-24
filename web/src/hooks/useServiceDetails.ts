import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Service } from '@/types';

export function useServiceDetails(id: string | undefined) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      if (!id) return null;
      // The interceptor unwraps the response, so 'response' is the actual data object
      // e.g. { service: { ... } }
      const response = await api.get<any>(`/services/${id}`);
      
      const data = response as any;
      
      if (data.service) return data.service as Service;
      if (data.data?.service) return data.data.service as Service;
      
      return data as unknown as Service;
    },
    enabled: !!id
  });
}
