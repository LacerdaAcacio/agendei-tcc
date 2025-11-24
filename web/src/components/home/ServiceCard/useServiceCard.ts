import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/axios';
import type { Service } from '@/types';

export function useServiceCard(service: Service) {
  const [isFavorited, setFavorited] = useState(service.isFavorited);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const newVal = !isFavorited;
    setFavorited(newVal);

    try {
      await api.post(`/services/${service.id}/favorite`);
    } catch (error) {
      // Rollback on error
      setFavorited(!newVal);
      toast.error('Erro ao atualizar favorito');
    }
  };

  return {
    isFavorited,
    handleFavoriteClick,
  };
}
