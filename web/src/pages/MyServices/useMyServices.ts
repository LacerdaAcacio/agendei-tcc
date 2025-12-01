import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAuth } from '@/contexts';
import { api } from '@/lib/axios';
import type { Service } from '@/types';

export function useMyServices() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ['my-services', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await api.get(`/services?providerId=${user.id}`) as unknown as { services: Service[] };
      return response.services;
    },
    enabled: !!user?.id,
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/services/${id}`);
    },
    onSuccess: () => {
      toast.success('Serviço excluído com sucesso');
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao excluir serviço. Tente novamente.');
    },
  });

  return {
    services,
    isLoading,
    deleteService,
  };
}
