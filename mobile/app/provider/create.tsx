import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera, Check, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { z } from 'zod';

import { ThemedButton, ThemedInput } from '@/components';
import { useCategories } from '@/hooks/useCategories';
import { createDefaultAvailability, fetchAddressByCEP } from '@/lib/address';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

const serviceSchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres'),
  description: z.string().min(20, 'Descrição deve ter no mínimo 20 caracteres'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  price: z.string().min(1, 'Informe o preço'),
  priceUnit: z.enum(['HOURLY', 'DAILY', 'FIXED', 'PER_PERSON', 'PER_METRIC']),
  type: z.enum(['PRESENTIAL', 'DIGITAL']),
  duration: z.string().min(1, 'Informe a duração'),
  addressZipCode: z.string().optional(),
  addressStreet: z.string().optional(),
  addressNumber: z.string().optional(),
  addressNeighborhood: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function CreateServiceScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { categories } = useCategories();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useBusinessHours, setUseBusinessHours] = useState(true);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      price: '',
      priceUnit: 'HOURLY',
      type: 'PRESENTIAL',
      duration: '60',
      addressZipCode: '',
      addressStreet: '',
      addressNumber: '',
      addressNeighborhood: '',
      addressCity: '',
      addressState: '',
    },
  });

  const serviceType = watch('type');

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão Necessária', 'Precisamos de acesso à sua galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        const base64Images = result.assets
          .filter((asset) => asset.base64)
          .map((asset) => `data:image/jpeg;base64,${asset.base64}`);

        setSelectedImages([...selectedImages, ...base64Images].slice(0, 5));
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Erro', 'Não foi possível selecionar as imagens.');
    }
  };

  const handleCEPLookup = async (cep: string) => {
    const address = await fetchAddressByCEP(cep);

    if (address) {
      setValue('addressStreet', address.street);
      setValue('addressNeighborhood', address.neighborhood);
      setValue('addressCity', address.city);
      setValue('addressState', address.state);
    } else {
      Alert.alert('CEP não encontrado', 'Verifique o CEP e tente novamente.');
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      setIsSubmitting(true);

      const availability = useBusinessHours ? createDefaultAvailability() : undefined;

      const payload = {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        price: parseFloat(data.price),
        priceUnit: data.priceUnit,
        type: data.type,
        duration: parseInt(data.duration),
        images: selectedImages,
        availability: availability ? JSON.stringify(availability) : undefined,
        addressZipCode: data.addressZipCode,
        addressStreet: data.addressStreet,
        addressNumber: data.addressNumber,
        addressNeighborhood: data.addressNeighborhood,
        addressCity: data.addressCity,
        addressState: data.addressState,
        latitude: -23.55052,
        longitude: -46.633308,
        location: data.type === 'PRESENTIAL' ? `${data.addressCity} - ${data.addressState}` : 'Digital',
        address:
          data.type === 'PRESENTIAL'
            ? `${data.addressStreet}, ${data.addressNumber} - ${data.addressNeighborhood}, ${data.addressCity} - ${data.addressState}`
            : '',
      };

      await api.post('/services', payload);

      queryClient.invalidateQueries({ queryKey: ['provider-services'] });

      Alert.alert('Sucesso', 'Serviço criado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Error creating service:', error);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível criar o serviço.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => (
    <View className="mb-6 flex-row items-center justify-between px-4">
      {[1, 2, 3, 4].map((step) => (
        <View key={step} className="flex-1 flex-row items-center">
          <View
            className={`h-8 w-8 items-center justify-center rounded-full ${
              step === currentStep
                ? 'bg-primary'
                : step < currentStep
                ? 'bg-green-500'
                : 'bg-muted dark:bg-muted-dark'
            }`}
          >
            {step < currentStep ? (
              <Check size={16} color="#ffffff" />
            ) : (
              <Text
                className={`text-sm font-semibold ${
                  step === currentStep ? 'text-white' : 'text-muted-foreground'
                }`}
              >
                {step}
              </Text>
            )}
          </View>
          {step < 4 && (
            <View
              className={`h-1 flex-1 ${
                step < currentStep ? 'bg-green-500' : 'bg-muted dark:bg-muted-dark'
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View className="space-y-4">
      <Text className="mb-4 text-2xl font-bold text-foreground dark:text-foreground-dark">
        Informações Básicas
      </Text>

      <Controller
        control={control}
        name="title"
        render={({ field: { value, onChange } }) => (
          <ThemedInput
            label="Título do Serviço"
            placeholder="Ex: Faxina Residencial Completa"
            value={value}
            onChangeText={onChange}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange } }) => (
          <ThemedInput
            label="Descrição"
            placeholder="Descreva detalhadamente o serviço..."
            value={value}
            onChangeText={onChange}
            error={errors.description?.message}
            multiline
            numberOfLines={4}
            className="h-24"
          />
        )}
      />

      <Controller
        control={control}
        name="categoryId"
        render={({ field: { value, onChange } }) => (
          <View>
            <Text className="mb-2 text-sm font-medium text-foreground dark:text-foreground-dark">
              Categoria
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-2">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => onChange(cat.id)}
                  className={`mr-2 rounded-lg border px-4 py-2 ${
                    value === cat.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border dark:border-border-dark'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      value === cat.id ? 'text-primary' : 'text-foreground dark:text-foreground-dark'
                    }`}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.categoryId && (
              <Text className="mt-1 text-sm text-destructive">{errors.categoryId.message}</Text>
            )}
          </View>
        )}
      />

      <View className="flex-row gap-4">
        <Controller
          control={control}
          name="price"
          render={({ field: { value, onChange } }) => (
            <View className="flex-1">
              <ThemedInput
                label="Preço (R$)"
                placeholder="0,00"
                value={value}
                onChangeText={onChange}
                error={errors.price?.message}
                keyboardType="decimal-pad"
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="priceUnit"
          render={({ field: { value, onChange } }) => (
            <View className="flex-1">
              <Text className="mb-2 text-sm font-medium text-foreground dark:text-foreground-dark">
                Unidade
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {['HOURLY', 'DAILY', 'FIXED'].map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => onChange(unit)}
                    className={`rounded-lg border px-3 py-2 ${
                      value === unit
                        ? 'border-primary bg-primary/10'
                        : 'border-border dark:border-border-dark'
                    }`}
                  >
                    <Text
                      className={`text-xs ${
                        value === unit ? 'text-primary' : 'text-foreground dark:text-foreground-dark'
                      }`}
                    >
                      {unit === 'HOURLY' ? 'Hora' : unit === 'DAILY' ? 'Dia' : 'Fixo'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
      </View>

      <Controller
        control={control}
        name="type"
        render={({ field: { value, onChange } }) => (
          <View>
            <Text className="mb-2 text-sm font-medium text-foreground dark:text-foreground-dark">
              Tipo de Serviço
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => onChange('PRESENTIAL')}
                className={`flex-1 rounded-lg border p-4 ${
                  value === 'PRESENTIAL'
                    ? 'border-primary bg-primary/10'
                    : 'border-border dark:border-border-dark'
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    value === 'PRESENTIAL' ? 'text-primary' : 'text-foreground dark:text-foreground-dark'
                  }`}
                >
                  Presencial
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onChange('DIGITAL')}
                className={`flex-1 rounded-lg border p-4 ${
                  value === 'DIGITAL'
                    ? 'border-primary bg-primary/10'
                    : 'border-border dark:border-border-dark'
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    value === 'DIGITAL' ? 'text-primary' : 'text-foreground dark:text-foreground-dark'
                  }`}
                >
                  Digital
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text className="mb-4 text-2xl font-bold text-foreground dark:text-foreground-dark">
        Fotos do Serviço
      </Text>
      <Text className="mb-4 text-sm text-muted-foreground dark:text-muted-foreground">
        Adicione até 5 fotos do seu serviço
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {selectedImages.map((image, index) => (
          <View key={index} className="relative">
            <Image source={{ uri: image }} className="h-24 w-24 rounded-lg" resizeMode="cover" />
            <TouchableOpacity
              onPress={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
              className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-red-600"
            >
              <X size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        ))}

        {selectedImages.length < 5 && (
          <TouchableOpacity
            onPress={pickImages}
            className="h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-border dark:border-border-dark"
          >
            <Camera size={24} color="#94a3b8" />
            <Text className="mt-1 text-xs text-muted-foreground">Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderStep3 = () => {
    if (serviceType === 'DIGITAL') {
      return (
        <View className="items-center justify-center py-12">
          <Text className="text-center text-xl font-bold text-foreground dark:text-foreground-dark">
            Serviço Digital
          </Text>
          <Text className="mt-2 text-center text-muted-foreground dark:text-muted-foreground">
            Não é necessário informar localização para serviços digitais
          </Text>
        </View>
      );
    }

    return (
      <View className="space-y-4">
        <Text className="mb-4 text-2xl font-bold text-foreground dark:text-foreground-dark">
          Localização
        </Text>

        <Controller
          control={control}
          name="addressZipCode"
          render={({ field: { value, onChange } }) => (
            <View>
              <Text className="mb-2 text-sm font-medium text-foreground dark:text-foreground-dark">
                CEP
              </Text>
              <View className="flex-row gap-2">
                <MaskedTextInput
                  mask="99999-999"
                  value={value}
                  onChangeText={onChange}
                  placeholder="00000-000"
                  keyboardType="numeric"
                  className="flex-1 rounded-lg border border-input dark:border-input-dark bg-white px-4 py-3 text-foreground dark:bg-card-dark dark:text-foreground-dark"
                  placeholderTextColor="#94a3b8"
                />
                <ThemedButton
                  onPress={() => value && handleCEPLookup(value)}
                  variant="primary"
                  size="md"
                  disabled={!value || value.length < 9}
                >
                  Buscar
                </ThemedButton>
              </View>
              {errors.addressZipCode && (
                <Text className="mt-1 text-sm text-destructive">{errors.addressZipCode.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="addressStreet"
          render={({ field: { value, onChange } }) => (
            <ThemedInput label="Rua" placeholder="Nome da rua" value={value || ''} onChangeText={onChange} />
          )}
        />

        <View className="flex-row gap-4">
          <Controller
            control={control}
            name="addressNumber"
            render={({ field: { value, onChange } }) => (
              <View className="w-28">
                <ThemedInput label="Número" placeholder="123" value={value || ''} onChangeText={onChange} />
              </View>
            )}
          />

          <Controller
            control={control}
            name="addressNeighborhood"
            render={({ field: { value, onChange } }) => (
              <View className="flex-1">
                <ThemedInput label="Bairro" placeholder="Bairro" value={value || ''} onChangeText={onChange} />
              </View>
            )}
          />
        </View>

        <View className="flex-row gap-4">
          <Controller
            control={control}
            name="addressCity"
            render={({ field: { value, onChange } }) => (
              <View className="flex-1">
                <ThemedInput label="Cidade" placeholder="Cidade" value={value || ''} onChangeText={onChange} />
              </View>
            )}
          />

          <Controller
            control={control}
            name="addressState"
            render={({ field: { value, onChange } }) => (
              <View className="w-20">
                <ThemedInput
                  label="UF"
                  placeholder="SP"
                  value={value || ''}
                  onChangeText={onChange}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            )}
          />
        </View>
      </View>
    );
  };

  const renderStep4 = () => (
    <View className="space-y-4">
      <Text className="mb-4 text-2xl font-bold text-foreground dark:text-foreground-dark">
        Regras e Disponibilidade
      </Text>

      <Controller
        control={control}
        name="duration"
        render={({ field: { value, onChange } }) => (
          <ThemedInput
            label="Duração (minutos)"
            placeholder="60"
            value={value}
            onChangeText={onChange}
            error={errors.duration?.message}
            keyboardType="numeric"
          />
        )}
      />

      <View>
        <Text className="mb-2 text-sm font-medium text-foreground dark:text-foreground-dark">
          Grade Horária
        </Text>

        <TouchableOpacity
          onPress={() => setUseBusinessHours(true)}
          className={`mb-3 rounded-lg border p-4 ${
            useBusinessHours
              ? 'border-primary bg-primary/10'
              : 'border-border dark:border-border-dark'
          }`}
        >
          <Text
            className={`font-semibold ${
              useBusinessHours ? 'text-primary' : 'text-foreground dark:text-foreground-dark'
            }`}
          >
            Horário Comercial
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
            Segunda a Sexta, 08:00 às 18:00
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUseBusinessHours(false)}
          className={`rounded-lg border p-4 ${
            !useBusinessHours
              ? 'border-primary bg-primary/10'
              : 'border-border dark:border-border-dark'
          }`}
        >
          <Text
            className={`font-semibold ${
              !useBusinessHours ? 'text-primary' : 'text-foreground dark:text-foreground-dark'
            }`}
          >
            Configuração Avançada
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
            Recomendado configurar na versão Web
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      {/* Header */}
      <View className="border-b border-border px-6 pb-4 pt-12 dark:border-border-dark">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#4f46e5" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Novo Serviço
          </Text>
          <View className="w-6" />
        </View>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {renderStepIndicator()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="border-t border-border p-6 dark:border-border-dark">
        <View className="flex-row gap-4">
          {currentStep > 1 && (
            <ThemedButton onPress={prevStep} variant="outline" size="lg" className="flex-1">
              <View className="flex-row items-center gap-2">
                <ChevronLeft size={20} color="#4f46e5" />
                <Text className="font-semibold text-primary">Voltar</Text>
              </View>
            </ThemedButton>
          )}

          {currentStep < 4 ? (
            <ThemedButton onPress={nextStep} variant="primary" size="lg" className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-white">Próximo</Text>
                <ChevronRight size={20} color="#ffffff" />
              </View>
            </ThemedButton>
          ) : (
            <ThemedButton
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              Criar Serviço
            </ThemedButton>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
