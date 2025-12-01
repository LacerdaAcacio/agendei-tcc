import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@/test/utils';
import { useProviderGuard } from './useProviderGuard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockAuthContext = {
  user: null as unknown,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  updateUser: vi.fn(),
  isAuthenticated: false,
  isLoading: false,
};

vi.mock('@/contexts/useAuth', () => ({
  useAuth: () => mockAuthContext,
}));

describe('useProviderGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthContext.user = null;
  });

  it('should return false isProvider when user is not provider', () => {
    mockAuthContext.user = {
      id: '1',
      name: 'Regular User',
      email: 'user@example.com',
      phone: '11999999999',
      role: 'user',
      isProvider: false,
      createdAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useProviderGuard());

    expect(result.current.isProvider).toBe(false);
  });

  it('should return true isProvider when user role is provider', () => {
    mockAuthContext.user = {
      id: '1',
      name: 'Provider User',
      email: 'provider@example.com',
      phone: '11999999999',
      role: 'provider',
      isProvider: true,
      createdAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useProviderGuard());

    expect(result.current.isProvider).toBe(true);
  });

  it('should return true isProvider when user role is admin', () => {
    mockAuthContext.user = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '11999999999',
      role: 'admin',
      isProvider: true,
      createdAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useProviderGuard());

    expect(result.current.isProvider).toBe(true);
  });

  it('should navigate to /become-host when checkProvider called and user is not provider', () => {
    mockAuthContext.user = {
      id: '1',
      name: 'Regular User',
      email: 'user@example.com',
      phone: '11999999999',
      role: 'user',
      isProvider: false,
      createdAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useProviderGuard());

    act(() => {
      const isValid = result.current.checkProvider();
      expect(isValid).toBe(false);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/become-host');
  });

  it('should not navigate when checkProvider called with redirect=false', () => {
    mockAuthContext.user = {
      id: '1',
      name: 'Regular User',
      email: 'user@example.com',
      phone: '11999999999',
      role: 'user',
      isProvider: false,
      createdAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useProviderGuard());

    act(() => {
      const isValid = result.current.checkProvider(false);
      expect(isValid).toBe(false);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should return true and not navigate when user is provider', () => {
    mockAuthContext.user = {
      id: '1',
      name: 'Provider User',
      email: 'provider@example.com',
      phone: '11999999999',
      role: 'provider',
      isProvider: true,
      createdAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useProviderGuard());

    act(() => {
      const isValid = result.current.checkProvider();
      expect(isValid).toBe(true);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle null user', () => {
    mockAuthContext.user = null;

    const { result } = renderHook(() => useProviderGuard());

    expect(result.current.isProvider).toBe(false);

    act(() => {
      const isValid = result.current.checkProvider();
      expect(isValid).toBe(false);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/become-host');
  });
});
