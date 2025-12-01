import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

// Extend AxiosRequestConfig if needed, but usually InternalAxiosRequestConfig is enough for interceptors

export const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('@agendei:token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Unwrap Data
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // The backend returns { status: 'success', data: { ... } }
    // We want to return just the inner data to the application
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized globally if needed (e.g., redirect to login)
    if (error.response?.status === 401) {
      localStorage.removeItem('@agendei:token');
      localStorage.removeItem('@agendei:user');
      // Optional: window.location.href = '/login';
      // Better to handle this in the AuthContext or Router
    }
    return Promise.reject(error);
  },
);
