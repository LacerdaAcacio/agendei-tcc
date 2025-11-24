import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@/test/utils'
import { useSearchServices } from './useSearchServices'
import { api } from '@/lib/axios'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('useSearchServices', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch services with filters', async () => {
    const mockServices = [
      { id: '1', title: 'Service 1', price: 100 },
      { id: '2', title: 'Service 2', price: 200 },
    ]

    vi.mocked(api.get).mockResolvedValueOnce({ services: mockServices })

    const filters = {
      location: 'São Paulo',
      type: 'PRESENTIAL' as const,
      category: 'category-1',
    }

    const { result } = renderHook(() => useSearchServices(filters))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.get).toHaveBeenCalledWith('/services/search', {
      params: expect.objectContaining({
        location: 'São Paulo',
        type: 'PRESENTIAL',
        category: 'category-1',
      }),
    })

    expect(result.current.data).toEqual(mockServices)
  })

  it('should filter out empty/undefined filters', async () => {
    const mockServices = [{ id: '1', title: 'Service 1' }]

    vi.mocked(api.get).mockResolvedValueOnce({ services: mockServices })

    const filters = {
      location: 'São Paulo',
      type: undefined,
      category: '',
    }

    const { result } = renderHook(() => useSearchServices(filters))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.get).toHaveBeenCalledWith('/services/search', {
      params: { location: 'São Paulo' },
    })
  })

  it('should handle nested data structure', async () => {
    const mockServices = [{ id: '1', title: 'Service 1' }]

    vi.mocked(api.get).mockResolvedValueOnce({
      data: { services: mockServices },
    })

    const filters = { search: 'test' }

    const { result } = renderHook(() => useSearchServices(filters))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(mockServices)
  })

  it('should return empty array when no services found', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({})

    const filters = { search: 'nonexistent' }

    const { result } = renderHook(() => useSearchServices(filters))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual([])
  })

  it('should not fetch when all filters are empty', () => {
    const filters = {}

    const { result } = renderHook(() => useSearchServices(filters))

    expect(api.get).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle API error', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('API Error'))

    const filters = { search: 'test' }

    const { result } = renderHook(() => useSearchServices(filters))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeTruthy()
  })

  it('should search by date range', async () => {
    const mockServices = [{ id: '1', title: 'Available Service' }]

    vi.mocked(api.get).mockResolvedValueOnce({ services: mockServices })

    const filters = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    }

    const { result } = renderHook(() => useSearchServices(filters))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.get).toHaveBeenCalledWith('/services/search', {
      params: expect.objectContaining({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      }),
    })
  })
})
