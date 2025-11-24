import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/axios';
import type { Service } from '@/types';

export function useServices() {
  const [searchParams] = useSearchParams();

  return useQuery({
    queryKey: ['services', searchParams.toString()],
    queryFn: async () => {
      const params: any = {};
      
      const lat = searchParams.get('lat');
      const lng = searchParams.get('lng');
      const date = searchParams.get('date');
      const category = searchParams.get('category');
      // const type = searchParams.get('type'); 

      if (category) params.categoryId = category;
      if (date) params.startDate = date;
      
      let endpoint = '/services';
      
      // If we have location, use search endpoint
      if (lat && lng) {
        endpoint = '/services/search';
        params.latitude = lat;
        params.longitude = lng;
      }

      try {
        const response = await api.get(endpoint, { params });
        const data = response as any;
        
        // Prioritize the structure { data: { services: [...] } } or { services: [...] }
        if (data.services) return data.services as Service[];
        if (data.data?.services) return data.data.services as Service[];
        if (Array.isArray(data)) return data as Service[];
        if (data.data && Array.isArray(data.data)) return data.data as Service[];
        
        return [] as Service[];
      } catch (error) {
        console.error("Failed to fetch services", error);
        return [];
      }
    }
  });
}
