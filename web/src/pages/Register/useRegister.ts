import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
    watch,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      document: '',
    },
  });

  const password = watch('password');

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
      const { confirmPassword, ...registerData } = data;

      const cleanDoc = registerData.document.replace(/[^\d]+/g, '');
      const documentType = cleanDoc.length === 14 ? 'CNPJ' : 'CPF';

      const payload = {
        ...registerData,
        document: cleanDoc,
        documentType,
      };

      await api.post('/auth/register', payload);
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      setError('root', {
        message: error.response?.data?.message || t('errors.registerFailed'),
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
