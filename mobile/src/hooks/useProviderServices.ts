import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Service } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

export function useProviderServices() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['provider-services', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        const response = await api.get(`/services?providerId=${user.id}`);

        // Handle different response structures
        if (Array.isArray(response)) return response as Service[];
        if ('services' in response && Array.isArray(response.services)) {
          return response.services as Service[];
        }
        if ('data' in response && Array.isArray(response.data)) {
          return response.data as Service[];
        }

        return [];
      } catch (error) {
        console.error('Error fetching provider services:', error);
        return [];
      }
    },
    enabled: !!user && user.role === 'provider',
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const deleteService = useMutation({
    mutationFn: async (serviceId: string) => {
      await api.delete(`/services/${serviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-services'] });
      Alert.alert('Sucesso', 'Serviço excluído com sucesso.');
    },
    onError: (error: any) => {
      console.error('Error deleting service:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível excluir o serviço.'
      );
    },
  });

  const confirmDelete = (serviceId: string) => {
    Alert.alert(
      'Excluir Serviço',
      'Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteService.mutate(serviceId),
        },
      ]
    );
  };

  return {
    services,
    isLoading,
    deleteService: confirmDelete,
  };
}
