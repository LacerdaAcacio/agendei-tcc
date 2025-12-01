import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts';

export function useProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return {
    user,
    handleLogout,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    navigate,
  };
}
