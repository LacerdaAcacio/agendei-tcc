import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppointment } from '@/features/appointments/hooks/useAppointment';
import type { AppointmentStatus } from '@/types';

export function useAppointmentDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: appointment, isLoading, error } = useAppointment(id!);

  const getStatusVariant = (status: AppointmentStatus) => {
    const variants: Record<AppointmentStatus, 'pending' | 'confirmed' | 'cancelled' | 'completed'> =
      {
        pending: 'pending',
        confirmed: 'confirmed',
        cancelled: 'cancelled',
        completed: 'completed',
      };
    return variants[status];
  };

  const canCancel = appointment && new Date(appointment.date) > new Date();

  const handleCancel = async () => {
    // TODO: Implement cancel logic
    console.log('Cancel appointment', id);
  };

  return {
    t,
    i18n,
    appointment,
    isLoading,
    error,
    navigate,
    getStatusVariant,
    handleCancel,
    canCancel,
  };
}
