import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@/test/utils';
import { useWishlist } from './useWishlist';
import { api } from '@/lib/axios';

// Mock axios
vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

vi.mock('@/contexts/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
  }),
}));

describe('useWishlist', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch favorited services on mount', async () => {
    const mockServices = [
      {
        id: '1',
        title: 'Service 1',
        isFavorited: true,
      },
      {
        id: '2',
        title: 'Service 2',
        isFavorited: true,
      },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockServices });

    const { result } = renderHook(() => useWishlist());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/users/wishlist');
    expect(result.current.wishlistServices).toHaveLength(2);
  });

  it('should handle add to wishlist', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useWishlist());

    await result.current.toggleWishlist('service-123');

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/services/service-123/favorite');
    });
  });

  it('should handle remove from wishlist', async () => {
    const mockServices = [
      {
        id: 'service-123',
        title: 'Service 1',
        isFavorited: true,
      },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockServices });
    vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useWishlist());

    await waitFor(() => {
      expect(result.current.wishlistServices).toHaveLength(1);
    });

    await result.current.toggleWishlist('service-123');

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/services/service-123/favorite');
    });
  });

  it('should handle API error gracefully', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useWishlist());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.wishlistServices).toEqual([]);
    });
  });
});
