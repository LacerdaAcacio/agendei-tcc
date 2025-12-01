import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ⚠️ IMPORTANTE: Altere este IP para o IP da sua máquina quando testar em device físico
// Para descobrir: ipconfig (Windows) ou ifconfig (Mac/Linux)
const LOCAL_IP = '192.168.2.113'; // Updated from Metro logs

/**
 * Detecta o ambiente e retorna a baseURL correta:
 * - Android Emulator: 10.0.2.2 (aponta para localhost da máquina host)
 * - iOS Simulator: localhost (acessa diretamente o host)
 * - Physical Device: IP da máquina na rede local
 */
const getBaseUrl = (): string => {
  if (__DEV__) {
    // Modo desenvolvimento
    if (Platform.OS === 'android') {
      // Prefer using LAN IP to support both Emulator and Physical Device
      return `http://${LOCAL_IP}:3000/api/v1`;
    }
    if (Platform.OS === 'ios') {
      return 'http://localhost:3000/api/v1';
    }
    // Device físico (ajuste o LOCAL_IP acima)
    return `http://${LOCAL_IP}:3000/api/v1`;
  }
  
  // Modo produção (configurar quando tiver servidor)
  return 'https://api.agendei.com/api/v1';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Request Interceptor: Injeta o Token JWT
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync('agendei_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token from SecureStore:', error);
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unwrap data (igual ao Web)
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Backend retorna { status: 'success', data: { ... } }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
  async (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Remove token e redireciona para login
      await SecureStore.deleteItemAsync('agendei_token');
      await SecureStore.deleteItemAsync('agendei_user');
      
      // Aqui você pode disparar um evento ou usar navigation
      // Por exemplo: navigationRef.current?.navigate('Login');
    }
    
    return Promise.reject(error);
  }
);
