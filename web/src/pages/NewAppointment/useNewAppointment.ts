import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { api } from '@/lib/axios';

import { createAppointmentSchema } from './constants';
import type { AppointmentFormInputs } from './types';

export function useNewAppointment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const appointmentSchema = createAppointmentSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AppointmentFormInputs>({
    resolver: zodResolver(appointmentSchema) as any,
    defaultValues: {
      duration: 60,
      serviceName: '',
      date: '',
      description: '',
    },
  });

  // Get current date in ISO format truncated to minutes for min attribute
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDate = now.toISOString().slice(0, 16);

  const onSubmit = async (data: AppointmentFormInputs) => {
    try {
      const dateObj = new Date(data.date);
      const payload = {
        ...data,
        date: dateObj.toISOString(),
      };

      await api.post('/appointments', payload);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      setError('root', {
        message: error.response?.data?.message || t('errors.appointmentFailed'),
      });
    }
  };

  return {
    t,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    navigate,
    minDate,
  };
}
