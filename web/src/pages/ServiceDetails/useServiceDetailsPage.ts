import { isAxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '@/contexts';
import { useServiceDetails } from '@/hooks/useServiceDetails';
import { useUserWishlist } from '@/hooks/useWishlist';
import { api } from '@/lib/axios';
import type { User } from '@/types';

export function useServiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: service, isLoading } = useServiceDetails(id);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Booking state
  const [isBooking, setIsBooking] = useState(false);

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Report modal state
  const [isReportOpen, setIsReportOpen] = useState(false);

  // User profile modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Wishlist
  const { wishlistIds, toggleWishlist } = useUserWishlist();
  const isFavorited = service ? wishlistIds.includes(service.id) : false;

  const handleToggleFavorite = () => {
    if (service) {
      toggleWishlist(service.id);
    }
  };

  const handleBookingSubmit = async (startDate: Date, endDate: Date) => {
    if (!user) {
      toast.error('Faça login para reservar');
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }

    setIsBooking(true);
    try {
      await api.post('/bookings', {
        serviceId: service?.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      toast.success('Reserva realizada com sucesso!');

      // Invalidate slots to refresh availability
      queryClient.invalidateQueries({ queryKey: ['slots'] });

      navigate('/my-bookings');
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error('Este horário já foi reservado. Tente outro.');
        // Also invalidate slots here to show the taken slot
        queryClient.invalidateQueries({ queryKey: ['slots'] });
      } else {
        toast.error('Erro ao realizar reserva. Tente novamente.');
      }
    } finally {
      setIsBooking(false);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    id,
    service,
    isLoading,
    user,
    t,
    isFavorited,
    isBooking,
    isLightboxOpen,
    lightboxIndex,
    isReportOpen,
    selectedUser,
    setIsLightboxOpen,
    setLightboxIndex,
    setIsReportOpen,
    setSelectedUser,
    handleToggleFavorite,
    handleBookingSubmit,
    openLightbox,
    scrollToSection,
    navigate,
  };
}
