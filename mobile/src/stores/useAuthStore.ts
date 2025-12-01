import type { AuthResponse, User } from '@/types';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  signIn: (data: AuthResponse) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setToken: (token) => set({ token }),

  signIn: async ({ user, token }: AuthResponse) => {
    try {
      if (token) {
        await SecureStore.setItemAsync('agendei_token', token);
      }
      if (user) {
        await SecureStore.setItemAsync('agendei_user', JSON.stringify(user));
      }
      
      set({ user, token, isAuthenticated: true });
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await SecureStore.deleteItemAsync('agendei_token');
      await SecureStore.deleteItemAsync('agendei_user');
      
      set({ user: null, token: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  },

  updateUser: async (user: User) => {
    try {
      if (user) {
        await SecureStore.setItemAsync('agendei_user', JSON.stringify(user));
      }
      set({ user });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      
      const [storedToken, storedUser] = await Promise.all([
        SecureStore.getItemAsync('agendei_token'),
        SecureStore.getItemAsync('agendei_user'),
      ]);

      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser) as User;
        set({ user, token: storedToken, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      await SecureStore.deleteItemAsync('agendei_token');
      await SecureStore.deleteItemAsync('agendei_user');
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Hook helper para facilitar o uso
export const useAuth = () => {
  const { user, isAuthenticated, isLoading, signIn, signOut, updateUser, loadUser } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    updateUser,
    loadUser,
  };
};
