import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
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
import { z } from 'zod';

import { ThemedButton, ThemedInput } from '@/components';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { User } from '@/types';

const editProfileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfileModal() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Precisamos de acesso à sua galeria para selecionar uma foto.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setSelectedImage(base64Image);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const onSubmit = async (data: EditProfileFormData) => {
    if (!user) return;

    try {
      setIsLoading(true);

      const updateData: any = {
        name: data.name,
        email: data.email,
      };

      if (selectedImage) {
        updateData.profileImage = selectedImage;
      }

      const response = await api.put('/users/profile', updateData);
      
      const updatedUser = response as unknown as User;
      
      await updateUser(updatedUser);
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.back();
    } catch (error: any) {
      console.error('Update profile error:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível atualizar o perfil.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentImage = selectedImage || user?.avatarUrl || user?.profileImage;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
            Editar Perfil
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-muted dark:bg-muted-dark"
          >
            <X size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View className="mb-6 items-center">
          <TouchableOpacity
            onPress={pickImage}
            className="relative h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-muted dark:bg-muted-dark"
          >
            {currentImage ? (
              <Image
                source={{ uri: currentImage }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <Camera size={40} color="#94a3b8" />
            )}
            
            <View className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary dark:border-background-dark">
              <Camera size={18} color="#ffffff" />
            </View>
          </TouchableOpacity>
          
          <Text className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground">
            Toque para alterar a foto
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                label="Nome Completo"
                placeholder="Seu nome"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
                autoCapitalize="words"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                label="Email"
                placeholder="seu@email.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
        </View>

        {/* Actions */}
        <View className="mt-8 flex-row gap-4">
          <ThemedButton
            onPress={() => router.back()}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Cancelar
          </ThemedButton>
          
          <ThemedButton
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            Salvar
          </ThemedButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
