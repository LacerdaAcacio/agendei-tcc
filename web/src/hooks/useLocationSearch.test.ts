import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@/test/utils'
import { useLocationSearch } from './useLocationSearch'

// Mock global fetch
global.fetch = vi.fn()

describe('useLocationSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should start with empty query and results', () => {
    const { result } = renderHook(() => useLocationSearch())

    expect(result.current.query).toBe('')
    expect(result.current.results).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it('should not search when query is less than 3 characters', async () => {
    const { result } = renderHook(() => useLocationSearch())

    act(() => {
      result.current.setQuery('ab')
    })

    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(global.fetch).not.toHaveBeenCalled()
    expect(result.current.results).toEqual([])
  })

  it('should fetch location results when query is valid', async () => {
    const mockData = [
      {
        display_name: 'São Paulo, SP, Brasil',
        lat: '-23.5505',
        lon: '-46.6333',
      },
      {
        display_name: 'São Paulo, Campinas, Brasil',
        lat: '-22.9068',
        lon: '-47.0633',
      },
    ]

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response)

    const { result } = renderHook(() => useLocationSearch())

    act(() => {
      result.current.setQuery('São Paulo')
    })

    act(() => {
      vi.advanceTimersByTime(600)
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('São Paulo')
    )
    expect(result.current.results).toHaveLength(2)
    expect(result.current.results[0]).toEqual({
      label: 'São Paulo, SP, Brasil',
      lat: -23.5505,
      lon: -46.6333,
    })
  })

  it('should use fallback data when API fails', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useLocationSearch())

    act(() => {
      result.current.setQuery('Curitiba')
    })

    act(() => {
      vi.advanceTimersByTime(600)
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.results.length).toBeGreaterThan(0)
    expect(result.current.results[0].label).toContain('Curitiba')
  })

  it('should debounce search queries', async () => {
    const { result } = renderHook(() => useLocationSearch())

    // Trigger multiple rapid changes
    act(() => {
      result.current.setQuery('S')
    })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    act(() => {
      result.current.setQuery('Sã')
    })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    act(() => {
      result.current.setQuery('São')
    })
    act(() => {
      vi.advanceTimersByTime(600)
    })

    // Should only call fetch once after debounce
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('should show loading state while fetching', async () => {
    vi.mocked(global.fetch).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true, json: async () => [] } as Response), 1000)
        )
    )

    const { result } = renderHook(() => useLocationSearch())

    act(() => {
      result.current.setQuery('São Paulo')
    })

    act(() => {
      vi.advanceTimersByTime(600)
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })
  })

  it('should clear results when query becomes empty', async () => {
    const { result } = renderHook(() => useLocationSearch())

    act(() => {
      result.current.setQuery('São Paulo')
    })

    act(() => {
      vi.advanceTimersByTime(600)
    })

    act(() => {
      result.current.setQuery('')
    })

    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(result.current.results).toEqual([])
  })
})
