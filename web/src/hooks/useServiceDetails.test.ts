import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@/test/utils';
import { useServiceDetails } from './useServiceDetails';
import { api } from '@/lib/axios';

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('useServiceDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch service details successfully', async () => {
    const mockService = {
      id: 'service-123',
      title: 'Test Service',
      description: 'Test Description',
      price: 100,
      priceUnit: 'PER_HOUR',
      location: 'São Paulo, SP',
      rating: 4.5,
      reviewCount: 10,
      images: ['https://example.com/image.jpg'],
      provider: {
        id: '1',
        name: 'Provider Name',
        avatar: 'https://example.com/avatar.jpg',
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce(mockService);

    const { result } = renderHook(() => useServiceDetails('service-123'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/services/service-123');
    expect(result.current.data).toEqual(mockService);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Service not found'));

    const { result } = renderHook(() => useServiceDetails('service-123'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeTruthy();
  });

  it('should not fetch if serviceId is empty', () => {
    const { result } = renderHook(() => useServiceDetails(''));

    expect(api.get).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });
});
