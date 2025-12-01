import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@/test/utils';
import { useHomeData } from './useHomeData';
import { api } from '@/lib/axios';

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('useHomeData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch home data successfully', async () => {
    const mockHomeData = {
      categories: [
        { id: '1', name: 'Category 1', icon: 'icon1' },
        { id: '2', name: 'Category 2', icon: 'icon2' },
      ],
      featuredServices: [
        { id: 'service1', title: 'Featured Service 1', price: 100 },
        { id: 'service2', title: 'Featured Service 2', price: 200 },
      ],
    };

    vi.mocked(api.get).mockResolvedValueOnce(mockHomeData);

    const { result } = renderHook(() => useHomeData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/home');
    expect(result.current.data).toEqual(mockHomeData);
  });

  it('should return empty arrays if no data', async () => {
    vi.mocked(api.get).mockResolvedValueOnce(null);

    const { result } = renderHook(() => useHomeData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({ categories: [], featuredServices: [] });
  });

  it('should handle fetch error', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useHomeData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });
});
