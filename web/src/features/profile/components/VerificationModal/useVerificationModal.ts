import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts';

export function useVerificationModal(onOpenChange: (open: boolean) => void) {
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);

  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuth();

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setDocFile(selectedFile);
      setDocPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setSelfieFile(selectedFile);
      setSelfiePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!docFile || !selfieFile) return;

    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Documentos enviados para análise!');

      // Mock update user state to PENDING
      if (user) {
        updateUser({
          ...user,
          verificationStatus: 'PENDING',
          isVerified: false, // Ensure isVerified is false while pending
        });
      }

      onOpenChange(false);
      // Reset state
      setDocFile(null);
      setDocPreview(null);
      setSelfieFile(null);
      setSelfiePreview(null);
    }, 1500);
  };

  return {
    docFile,
    docPreview,
    selfieFile,
    selfiePreview,
    isLoading,
    handleDocChange,
    handleSelfieChange,
    handleSubmit,
  };
}
