import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuth } from '@/contexts';
import { toast } from 'sonner';
import type { Service } from '@/types';
import { useMemo } from 'react';

export function useUserWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!user) return [];
      try {
        const response = await api.get('/users/wishlist');

        // The API might return data directly in response.data or in response.data.data
        // First try response.data.data (envelope pattern)
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data as Service[];
        }
        // Then try response.data directly
        if (response.data && Array.isArray(response.data)) {
          return response.data as Service[];
        }
        // Fallback: try response directly (in case axios interceptor changed structure)
        if (Array.isArray(response)) {
          return response as Service[];
        }
        return [];
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
  });

  const wishlistIds = useMemo(() => {
    return services.map((service) => service.id);
  }, [services]);

  const toggleMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      await api.post(`/services/${serviceId}/favorite`);
    },
    onMutate: async (serviceId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });

      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData<Service[]>(['wishlist']);

      // Optimistic update: We can only easily remove from the list optimistically.
      // Adding requires the full object, which we don't have here.
      // So we will filter out if removing, but just wait for invalidation if adding.
      queryClient.setQueryData<Service[]>(['wishlist'], (old = []) => {
        if (old.find((s) => s.id === serviceId)) {
          return old.filter((s) => s.id !== serviceId);
        }
        // If adding, we can't add without the object, so we return old and wait for invalidation.
        return old;
      });

      return { previousWishlist };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist);
      }
      toast.error('Erro ao atualizar favoritos');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const toggleWishlist = (id: string) => {
    if (!user) {
      toast.error('Faça login para favoritar');
      return;
    }
    toggleMutation.mutate(id);
  };

  return { wishlistServices: services, wishlistIds, toggleWishlist, isLoading };
}

// Deprecated: keeping for backward compatibility if needed
export const useWishlist = useUserWishlist;
