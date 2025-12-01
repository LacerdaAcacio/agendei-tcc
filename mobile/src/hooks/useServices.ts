import { api } from '@/lib/api';
import type { Service } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface UseServicesParams {
  categoryId?: string; // UUID
  category?: string; // Slug (ex: 'faxina')
  search?: string;
  location?: string;
  date?: string;
  type?: 'ALL' | 'IN_PERSON' | 'ONLINE';
  providerId?: string; // Adicionado para suporte a "Meus Serviços"
}

export function useServices(params?: UseServicesParams) {
  const { data: services = [], isLoading, refetch } = useQuery({
    queryKey: ['services', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      // Mapeamento correto de parâmetros
      if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params?.category) queryParams.append('category', params.category); // CORREÇÃO: Usa 'category' para slug
      if (params?.search) queryParams.append('search', params.search);
      if (params?.location) queryParams.append('location', params.location);
      if (params?.date) queryParams.append('date', params.date);
      if (params?.providerId) queryParams.append('providerId', params.providerId);

      // Tratamento do Tipo (Enum do Backend pode ser PRESENTIAL/DIGITAL)
      if (params?.type && params.type !== 'ALL') {
        const backendType = params.type === 'IN_PERSON' ? 'PRESENTIAL' : 'DIGITAL';
        queryParams.append('type', backendType);
      }

      // Lógica de Endpoint: Se tem qualquer filtro, usa o search.
      const hasFilters =
        params?.search ||
        params?.location ||
        params?.date ||
        params?.type ||
        params?.category ||  // <--- CORREÇÃO: Categoria ativa o modo busca
        params?.categoryId;

      const endpoint = hasFilters ? '/services/search' : '/services';

      // Exceção: Se for filtro por providerId (Meus Serviços), usa a listagem padrão filtrada
      const finalEndpoint = params?.providerId ? '/services' : endpoint;

      const url = `${finalEndpoint}?${queryParams.toString()}`;
      console.log('Fetching URL:', url);

      const response = await api.get(url);

      // Tratamento robusto de resposta (Envelope vs Array direto)
      // Nota: O interceptor do api.ts já desembrulha a resposta (retorna response.data ou response.data.data)
      // Portanto, 'response' aqui já é o payload.
      
      if (Array.isArray(response)) {
        return response as Service[];
      }
      
      // Suporte a { services: [...] }
      if (response && 'services' in response && Array.isArray((response as any).services)) {
        return (response as any).services as Service[];
      }

      // Suporte a { data: [...] } caso o interceptor tenha retornado algo diferente ou o backend mudou
      if (response && 'data' in response && Array.isArray((response as any).data)) {
        return (response as any).data as Service[];
      }
      
      // Fallback para o código original solicitado caso o interceptor seja removido futuramente
      if ((response as any)?.data?.data && Array.isArray((response as any).data.data)) {
        return (response as any).data.data as Service[];
      }

      return [] as Service[];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });

  return {
    services,
    isLoading,
    refetch
  };
}
