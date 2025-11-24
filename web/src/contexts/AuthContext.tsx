import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (data: AuthResponse) => void;
  signOut: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = () => {
      const storedUser = localStorage.getItem('@agendei:user');
      const storedToken = localStorage.getItem('@agendei:token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    loadStorageData();
  }, []);

  const signIn = ({ token, user }: AuthResponse) => {
    localStorage.setItem('@agendei:token', token);
    localStorage.setItem('@agendei:user', JSON.stringify(user));
    setUser(user);
  };

  const signOut = () => {
    localStorage.removeItem('@agendei:token');
    localStorage.removeItem('@agendei:user');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('@agendei:user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
