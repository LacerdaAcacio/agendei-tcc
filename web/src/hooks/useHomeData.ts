import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { HomeData } from '@/types';

export function useHomeData() {
  return useQuery({
    queryKey: ['home-data'],
    queryFn: async () => {
      const data = (await api.get<HomeData>('/home')) as unknown as HomeData;
      return data || { categories: [], featuredServices: [] };
    },
  });
}
