import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/axios';
import type { AuthResponse } from '@/types';

import { createLoginSchema } from './constants';
import type { LoginFormInputs } from './types';

export function useLogin() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const loginSchema = createLoginSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema) as any,
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      const authData = response as unknown as AuthResponse;

      signIn(authData);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      setError('root', {
        message: error.response?.data?.message || t('errors.loginFailed'),
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
  };
}
