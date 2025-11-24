import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { api } from '@/lib/axios';

import { createServiceSchema } from './constants';
import type { CreateServiceForm } from './types';

export function useCreateService() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceForm>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      type: 'PRESENTIAL',
      duration: 60,
      images: [],
      latitude: -23.55052,
      longitude: -46.633308,
    },
  });

  const serviceType = watch('type');

  const createService = useMutation({
    mutationFn: async (data: CreateServiceForm) => {
      // Construct legacy address string and location
      let fullAddress = '';
      let locationName = 'Digital';

      if (data.type === 'PRESENTIAL') {
        fullAddress = `${data.addressStreet}, ${data.addressNumber}`;
        if (data.addressComplement) fullAddress += ` - ${data.addressComplement}`;
        fullAddress += ` - ${data.addressNeighborhood}, ${data.addressCity} - ${data.addressState}, ${data.addressZipCode}`;

        locationName = `${data.addressCity} - ${data.addressState}`;
      }

      const payload = {
        ...data,
        location: locationName,
        address: fullAddress,
        // Ensure lat/lng are numbers
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      };

      const response = await api.post('/services', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Serviço criado com sucesso!');
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao criar serviço. Tente novamente.');
    },
  });

  const onSubmit = (data: CreateServiceForm) => {
    if (data.type === 'PRESENTIAL') {
      if (
        !data.addressZipCode ||
        !data.addressStreet ||
        !data.addressNumber ||
        !data.addressCity ||
        !data.addressState
      ) {
        toast.error('Por favor, preencha o endereço completo.');
        return;
      }
    }
    createService.mutate(data);
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    isSubmitting,
    serviceType,
    onSubmit,
    createService,
    navigate,
  };
}
