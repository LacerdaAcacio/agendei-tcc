import { isAxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { api } from '@/lib/axios';

import { createRegisterSchema } from './constants';
import type { RegisterFormInputs } from './types';

export function useRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const registerSchema = createRegisterSchema(t);

  const {
    register,
    handleSubmit,
    control, // Add control
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      document: '',
    },
  });

  // Use useWatch for better performance and to satisfy linter
  const password = useWatch({ control, name: 'password' });

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 14) val = val.slice(0, 14);

    // Dynamic Masking
    if (val.length <= 11) {
      // CPF Mask: 999.999.999-99
      val = val.replace(/(\d{3})(\d)/, '$1.$2');
      val = val.replace(/(\d{3})(\d)/, '$1.$2');
      val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ Mask: 99.999.999/0001-99
      val = val.replace(/^(\d{2})(\d)/, '$1.$2');
      val = val.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      val = val.replace(/\.(\d{3})(\d)/, '.$1/$2');
      val = val.replace(/(\d{4})(\d)/, '$1-$2');
    }

    setValue('document', val, { shouldValidate: true });
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const cleanDoc = data.document.replace(/[^\d]+/g, '');
      const documentType = cleanDoc.length === 14 ? 'CNPJ' : 'CPF';

      // Explicitly construct payload to avoid unused variable warning
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        document: cleanDoc,
        documentType,
      };

      await api.post('/auth/register', payload);
      navigate('/login');
    } catch (error) {
      console.error(error);
      let message = t('errors.registerFailed');

      if (isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }

      setError('root', {
        message,
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
    handleDocumentChange,
    setValue,
    password,
  };
}
