import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Service } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Alert } from 'react-native';

export function useWishlist() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!user) return [];
      try {
        const response = await api.get('/users/wishlist');

        // Handle different response structures
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data as Service[];
        }
        if (response.data && Array.isArray(response.data)) {
          return response.data as Service[];
        }
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
  });

  const wishlistIds = useMemo(() => {
    return services.map((service) => service.id);
  }, [services]);

  const toggleMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      await api.post(`/services/${serviceId}/favorite`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Error toggling favorite:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos. Tente novamente.');
    },
  });

  const toggleWishlist = (serviceId: string) => {
    if (!user) {
      Alert.alert('Login Necessário', 'Você precisa estar logado para favoritar serviços.');
      return;
    }
    toggleMutation.mutate(serviceId);
  };

  return {
    wishlistServices: services,
    wishlistIds,
    isLoading,
    toggleWishlist,
    isFavorited: (serviceId: string) => wishlistIds.includes(serviceId),
  };
}
