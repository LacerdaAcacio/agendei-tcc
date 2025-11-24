import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/axios';

export function useReportModal(serviceId: string | undefined, onClose: () => void) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!serviceId) return;
    if (reason.length < 10) return;

    setIsSubmitting(true);
    try {
      await api.post('/reports', {
        serviceId,
        reason: 'OTHER',
        description: reason,
      });

      toast.success('Denúncia enviada para análise.');
      onClose();
      setReason('');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Erro ao enviar denúncia. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reason,
    setReason,
    isSubmitting,
    handleSubmit,
  };
}
