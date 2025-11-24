import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { User } from '@/types';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      // API returns { users: [] } after unwrapping by interceptor
      const data = response as any;
      return (data?.users || []) as User[];
    },
  });
};
