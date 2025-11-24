import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/axios';
import type { Service } from '@/types';

export function useMyServices() {
  const { user } = useAuth();

  const { data: services, isLoading } = useQuery({
    queryKey: ['my-services', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await api.get(`/services?providerId=${user.id}`);
      return response.data as Service[];
    },
    enabled: !!user?.id,
  });

  return {
    services,
    isLoading,
  };
}
