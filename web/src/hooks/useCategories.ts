import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Category } from '@/types';

export function useCategories() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Define expected response structure to avoid 'any'
      type CategoriesApiResponse = { categories: Category[] } | { data: Category[] } | Category[];

      const response = (await api.get('/categories')) as unknown as CategoriesApiResponse;

      // Handle different response structures safely
      if (Array.isArray(response)) return response;
      if ('categories' in response && Array.isArray(response.categories))
        return response.categories;
      if ('data' in response && Array.isArray(response.data)) return response.data;

      return [] as Category[];
    },
    staleTime: Infinity, // Categories rarely change
  });

  return {
    categories,
    isLoading,
  };
}
