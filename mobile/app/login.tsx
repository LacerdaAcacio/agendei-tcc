import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, LogIn } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { ThemedButton, ThemedInput } from '@/components';
import { api } from '@/lib/api';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores/useAuthStore';
import type { AuthResponse } from '@/types';

export default function LoginScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', data);
      
      const authData = response as unknown as AuthResponse;
      
      await signIn(authData);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Erro ao fazer login',
        error.response?.data?.message || 'Verifique suas credenciais e tente novamente.'
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
        <View className="mb-10">
          <Text className="text-4xl font-bold text-foreground dark:text-foreground-dark">
            Bem-vindo
          </Text>
          <Text className="mt-2 text-lg text-muted-foreground dark:text-muted-foreground">
            Entre com sua conta
          </Text>
        </View>

        <View className="space-y-4">
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

          <TouchableOpacity className="self-end">
            <Text className="text-sm text-primary">Esqueceu a senha?</Text>
          </TouchableOpacity>

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
                <LogIn size={20} color="#ffffff" />
                <Text className="text-lg font-semibold text-white">Entrar</Text>
              </View>
            )}
          </ThemedButton>

          <View className="mt-6 flex-row items-center justify-center">
            <Text className="text-muted-foreground dark:text-muted-foreground">
              Não tem uma conta?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="font-semibold text-primary">Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
