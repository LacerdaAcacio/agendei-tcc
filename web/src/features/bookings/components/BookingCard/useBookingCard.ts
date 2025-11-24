import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/axios';
import type { Booking } from '@/types';

export function useBookingCard(booking: Booking) {
  const { id, service, startDate, endDate, status, totalPrice } = booking;
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const queryClient = useQueryClient();

  const start = new Date(startDate);
  const end = new Date(endDate);

  const dateRange = `${format(start, "d 'de' MMM", { locale: ptBR })} - ${format(end, "d 'de' MMM yyyy", { locale: ptBR })}`;
  const timeRange = `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success('Reserva cancelada com sucesso.');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      setIsCancelDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Erro ao cancelar reserva. Tente novamente.');
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    id,
    service,
    status,
    totalPrice,
    dateRange,
    timeRange,
    isCancelDialogOpen,
    setIsCancelDialogOpen,
    isReviewModalOpen,
    setIsReviewModalOpen,
    isCancelling,
    handleCancelBooking,
  };
}
