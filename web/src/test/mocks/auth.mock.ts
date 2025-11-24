import { vi } from 'vitest';

export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  phone: '11999999999',
  isProvider: false,
  createdAt: new Date().toISOString(),
};

export const mockAuthContext = {
  user: mockUser,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
};

export const mockAuthContextUnauthenticated = {
  user: null,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  isAuthenticated: false,
  isLoading: false,
};
