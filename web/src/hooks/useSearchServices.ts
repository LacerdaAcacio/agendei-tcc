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
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
      );
      
      // The API returns { status: 'success', data: { services: [...] } }
      // Axios interceptor might unwrap the first 'data', so we get { status: 'success', data: { services: [...] } } or just { services: [...] } depending on interceptor
      // Let's assume the interceptor returns the response.data
      
      const response = await api.get<any>('/services/search', { params });
      
      // Handle various possible structures safely
      const data = response as any;
      
      if (data.services) return data.services as Service[];
      if (data.data?.services) return data.data.services as Service[];
      if (Array.isArray(data)) return data as Service[];
      
      return [] as Service[];
    },
    enabled: Object.values(filters).some(v => v !== undefined && v !== '')
  });
}
