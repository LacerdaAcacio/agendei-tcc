import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@/test/utils';
import { useAuth } from './useAuth';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should start unauthenticated', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should sign in user', () => {
    const { result } = renderHook(() => useAuth());

    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      phone: '11999999999',
      isProvider: false,
      createdAt: new Date().toISOString(),
    };

    const authResponse = {
      token: 'test-token',
      user: mockUser,
    };

    act(() => {
      result.current.signIn(authResponse);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('@agendei:token')).toBe('test-token');
    expect(localStorage.getItem('@agendei:user')).toBe(JSON.stringify(mockUser));
  });

  it('should sign out user', () => {
    const { result } = renderHook(() => useAuth());

    // First sign in
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      phone: '11999999999',
      isProvider: false,
      createdAt: new Date().toISOString(),
    };

    act(() => {
      result.current.signIn({ token: 'test-token', user: mockUser });
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then sign out
    act(() => {
      result.current.signOut();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('@agendei:token')).toBeNull();
    expect(localStorage.getItem('@agendei:user')).toBeNull();
  });

  it('should update user', () => {
    const { result } = renderHook(() => useAuth());

    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      phone: '11999999999',
      isProvider: false,
      createdAt: new Date().toISOString(),
    };

    act(() => {
      result.current.signIn({ token: 'test-token', user: mockUser });
    });

    const updatedUser = { ...mockUser, name: 'Updated Name' };

    act(() => {
      result.current.updateUser(updatedUser);
    });

    expect(result.current.user?.name).toBe('Updated Name');
    expect(localStorage.getItem('@agendei:user')).toBe(JSON.stringify(updatedUser));
  });

  it('should restore session from localStorage', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      phone: '11999999999',
      isProvider: false,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('@agendei:token', 'stored-token');
    localStorage.setItem('@agendei:user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    // Wait for loading to finish
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });
});
