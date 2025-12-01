import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@/test/utils';
import { useServices } from './useServices';
import { api } from '@/lib/axios';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = (initialEntries: string[] = ['/']) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('useServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all services when no params', async () => {
    const mockServices = [
      { id: '1', title: 'Service 1' },
      { id: '2', title: 'Service 2' },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({ services: mockServices });

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(['/services']),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/services', { params: {} });
    expect(result.current.data).toEqual(mockServices);
  });

  it('should use search endpoint when location params present', async () => {
    const mockServices = [{ id: '1', title: 'Nearby Service' }];

    vi.mocked(api.get).mockResolvedValueOnce({ services: mockServices });

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(['/services?lat=-23.5505&lng=-46.6333']),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/services/search', {
      params: {
        latitude: '-23.5505',
        longitude: '-46.6333',
      },
    });
  });

  it('should include category filter', async () => {
    const mockServices = [{ id: '1', title: 'Photography Service' }];

    vi.mocked(api.get).mockResolvedValueOnce({ services: mockServices });

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(['/services?category=photography']),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/services', {
      params: { categoryId: 'photography' },
    });
  });

  it('should include date filter', async () => {
    const mockServices = [{ id: '1', title: 'Available Service' }];

    vi.mocked(api.get).mockResolvedValueOnce({ services: mockServices });

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(['/services?date=2024-01-01']),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/services', {
      params: { startDate: '2024-01-01' },
    });
  });

  it('should handle multiple params', async () => {
    const mockServices = [{ id: '1', title: 'Filtered Service' }];

    vi.mocked(api.get).mockResolvedValueOnce({ services: mockServices });

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper([
        '/services?lat=-23.5505&lng=-46.6333&category=photography&date=2024-01-01',
      ]),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/services/search', {
      params: {
        latitude: '-23.5505',
        longitude: '-46.6333',
        categoryId: 'photography',
        startDate: '2024-01-01',
      },
    });
  });

  it('should handle nested data structures', async () => {
    const mockServices = [{ id: '1', title: 'Service' }];

    vi.mocked(api.get).mockResolvedValueOnce({ data: { services: mockServices } });

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(['/services']),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockServices);
  });

  it('should handle array response directly', async () => {
    const mockServices = [{ id: '1', title: 'Service' }];

    vi.mocked(api.get).mockResolvedValueOnce(mockServices);

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(['/services']),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockServices);
  });

  it('should return empty array on error', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(['/services']),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
  });
});
