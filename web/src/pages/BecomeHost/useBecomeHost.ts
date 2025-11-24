import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/axios';

export function useBecomeHost() {
  const { t } = useTranslation();
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const handleUpgrade = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update user role to provider
      const response = await api.put(`/users/${user.id}`, {
        role: 'provider',
      });

      // Update local auth state
      const updatedUser = (response as any).user || (response as any).data?.user || response;
      const token = localStorage.getItem('@agendei:token');

      if (token && updatedUser) {
        signIn({ user: updatedUser, token });
        setIsSuccessDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to upgrade user', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessDialogOpen(false);
    navigate('/services/new');
  };

  // Mock masked CPF since it's not in the User type yet
  const maskedCpf = '***.***.***-**';

  return {
    t,
    user,
    isLoading,
    isEditProfileOpen,
    setIsEditProfileOpen,
    isSuccessDialogOpen,
    handleUpgrade,
    handleSuccessClose,
    maskedCpf,
  };
}
