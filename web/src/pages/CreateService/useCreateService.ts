import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/axios';
import { useServiceDetails } from '@/hooks/useServiceDetails';

import { createServiceSchema } from './constants';
import type { CreateServiceForm } from './types';

export function useCreateService() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: serviceDetails, isLoading: isLoadingDetails } = useServiceDetails(id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
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

  // Populate form when service details are loaded
  useEffect(() => {
    if (serviceDetails && isEditing) {
      // Define extended interface for service details with address fields
      interface ServiceWithAddress {
        title: string;
        description: string;
        price: number;
        categoryId: string;
        type: 'PRESENTIAL' | 'DIGITAL';
        images: string[];
        duration?: number;
        availability?: Record<string, { active: boolean; start: string; end: string }>;
        addressZipCode?: string;
        addressStreet?: string;
        addressNumber?: string;
        addressComplement?: string;
        addressNeighborhood?: string;
        addressCity?: string;
        addressState?: string;
        latitude: number;
        longitude: number;
      }

      const details = serviceDetails as unknown as ServiceWithAddress;

      const formData: Partial<CreateServiceForm> = {
        title: details.title,
        description: details.description,
        price: details.price,
        categoryId: details.categoryId,
        type: details.type,
        images: details.images || [],
        duration: details.duration || 60,
        availability: details.availability ? JSON.stringify(details.availability) : undefined,
      };

      if (details.type === 'PRESENTIAL') {
        formData.addressZipCode = details.addressZipCode;
        formData.addressStreet = details.addressStreet;
        formData.addressNumber = details.addressNumber;
        formData.addressComplement = details.addressComplement;
        formData.addressNeighborhood = details.addressNeighborhood;
        formData.addressCity = details.addressCity;
        formData.addressState = details.addressState;
        formData.latitude = Number(details.latitude);
        formData.longitude = Number(details.longitude);
      }

      reset(formData as CreateServiceForm);
    }
  }, [serviceDetails, isEditing, reset]);

  // Use useWatch for better performance and to satisfy linter
  const serviceType = useWatch({ control, name: 'type' });

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

      if (isEditing && id) {
        const response = await api.put(`/services/${id}`, payload);
        return response.data;
      } else {
        const response = await api.post('/services', payload);
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Serviço atualizado com sucesso!' : 'Serviço criado com sucesso!');
      navigate('/my-services'); // Redirect to My Services instead of Dashboard
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        isEditing ? 'Erro ao atualizar serviço.' : 'Erro ao criar serviço. Tente novamente.',
      );
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
    isEditing,
    isLoadingDetails,
  };
}
