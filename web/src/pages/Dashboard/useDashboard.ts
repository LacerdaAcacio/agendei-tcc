import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useUserAppointments } from '@/features/appointments/hooks/useUserAppointments';
import type { AppointmentStatus } from '@/types';

export function useDashboard() {
  const { user, signOut } = useAuth();
  const { data: appointments, isLoading, error } = useUserAppointments();
  const navigate = useNavigate();

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

  return {
    user,
    signOut,
    appointments,
    isLoading,
    error,
    navigate,
    getStatusVariant,
  };
}
