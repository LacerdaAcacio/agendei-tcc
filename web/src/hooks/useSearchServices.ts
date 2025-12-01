import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Service } from '@/types';

interface SearchFilters {
  location?: string;
  type?: 'PRESENTIAL' | 'DIGITAL';
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  category?: string;
  search?: string;
}

export function useSearchServices(filters: SearchFilters) {
  return useQuery({
    queryKey: ['search-services', filters],
    queryFn: async () => {
      // Remove undefined/empty keys
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v != null && v !== ''),
      );

      const response = await api.get('/services/search', { params });

      // Handle various possible structures safely
      const data = response as unknown as
        | { services?: Service[]; data?: { services?: Service[] } }
        | Service[];
      const servicesData = Array.isArray(data)
        ? data
        : data && typeof data === 'object' && 'services' in data
          ? (data as { services: Service[] }).services
          : data &&
              typeof data === 'object' &&
              'data' in data &&
              Array.isArray((data as { data: unknown }).data)
            ? (data as { data: Service[] }).data
            : [];

      return servicesData as Service[];
    },
    enabled: Object.values(filters).some((v) => v !== undefined && v !== ''),
  });
}
