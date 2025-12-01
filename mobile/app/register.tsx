import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedButton, ThemedInput } from '@/components';
import { api } from '@/lib/api';
import { formatDocument } from '@/lib/utils';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores/useAuthStore';
import type { AuthResponse } from '@/types';

export default function RegisterScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      document: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      
      // Clean document (remove non-digits)
      const cleanDoc = data.document.replace(/\D/g, '');
      const docType = cleanDoc.length > 11 ? 'CNPJ' : 'CPF';

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        document: cleanDoc,
        documentType: docType,
      };
      
      const response = await api.post('/auth/register', payload);
      
      const authData = response as unknown as AuthResponse;
      
      await signIn(authData);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Register error:', error);
      Alert.alert(
        'Erro ao criar conta',
        error.response?.data?.message || 'Ocorreu um erro. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center p-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8">
          <Text className="text-4xl font-bold text-foreground dark:text-foreground-dark">
            Criar Conta
          </Text>
          <Text className="mt-2 text-lg text-muted-foreground dark:text-muted-foreground">
            Preencha os dados abaixo
          </Text>
        </View>

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
                autoComplete="email"
              />
            )}
          />

          <Controller
            control={control}
            name="document"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text className="mb-2 text-sm font-medium text-foreground dark:text-foreground-dark">
                  CPF/CNPJ
                </Text>
                <TextInput
                  value={value}
                  onChangeText={(text) => {
                    const formatted = formatDocument(text);
                    onChange(formatted);
                  }}
                  placeholder="000.000.000-00"
                  keyboardType="numeric"
                  className={`rounded-lg border px-4 py-3 ${
                    errors.document
                      ? 'border-destructive'
                      : 'border-input dark:border-input-dark'
                  } bg-white dark:bg-card-dark text-foreground dark:text-foreground-dark`}
                  placeholderTextColor="#94a3b8"
                />
                {errors.document && (
                  <Text className="mt-1 text-sm text-destructive">
                    {errors.document.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <ThemedInput
                  label="Senha"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-9"
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#64748b" />
                  ) : (
                    <Eye size={20} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <ThemedInput
                  label="Confirmar Senha"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-9"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#64748b" />
                  ) : (
                    <Eye size={20} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />

          <ThemedButton
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            variant="primary"
            size="lg"
            className="mt-6"
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <View className="flex-row items-center gap-2">
                <UserPlus size={20} color="#ffffff" />
                <Text className="text-lg font-semibold text-white">Criar Conta</Text>
              </View>
            )}
          </ThemedButton>

          <View className="mt-6 flex-row items-center justify-center">
            <Text className="text-muted-foreground dark:text-muted-foreground">
              Já tem uma conta?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="font-semibold text-primary">Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
