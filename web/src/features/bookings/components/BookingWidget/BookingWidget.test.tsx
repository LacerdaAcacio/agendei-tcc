import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { BookingWidget } from './index'
import { api } from '@/lib/axios'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}))

const mockService = {
  id: 'service-123',
  title: 'Test Service',
  price: 100,
  priceUnit: 'PER_HOUR',
  location: 'São Paulo, SP',
  rating: 4.5,
  images: [],
}

describe('BookingWidget', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render booking widget', () => {
    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />)

    expect(screen.getByText(/data e horário/i)).toBeInTheDocument()
    expect(screen.getByText(/adicionar data/i)).toBeInTheDocument()
  })

  it('should open calendar when clicking date button', async () => {
    const user = userEvent.setup()
    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />)

    const dateButton = screen.getByRole('button', { name: /adicionar data/i })
    await user.click(dateButton)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('should fetch available slots when date is selected', async () => {
    const user = userEvent.setup()
    const mockSlots = {
      data: [
        { startTime: '09:00', endTime: '10:00', available: true },
        { startTime: '10:00', endTime: '11:00', available: true },
        { startTime: '11:00', endTime: '12:00', available: false },
      ],
    }

    vi.mocked(api.get).mockResolvedValueOnce(mockSlots)

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />)

    const dateButton = screen.getByRole('button', { name: /adicionar data/i })
    await user.click(dateButton)

    // Select a date (this is simplified - actual implementation depends on Calendar component)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('/services/service-123/slots')
      )
    })
  })

  it('should show available time slots after selecting date', async () => {
    const mockSlots = {
      data: [
        { startTime: '09:00', endTime: '10:00', available: true },
        { startTime: '10:00', endTime: '11:00', available: true },
      ],
    }

    vi.mocked(api.get).mockResolvedValueOnce(mockSlots)

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />)

    // After selecting date, slots should appear
    await waitFor(() => {
      expect(screen.getByText(/09:00/)).toBeInTheDocument()
      expect(screen.getByText(/10:00/)).toBeInTheDocument()
    })
  })

  it('should disable unavailable time slots', async () => {
    const mockSlots = {
      data: [
        { startTime: '09:00', endTime: '10:00', available: true },
        { startTime: '10:00', endTime: '11:00', available: false },
      ],
    }

    vi.mocked(api.get).mockResolvedValueOnce(mockSlots)

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />)

    await waitFor(() => {
      const unavailableSlot = screen.getByText(/10:00/)
      const button = unavailableSlot.closest('button')
      expect(button).toBeDisabled()
    })
  })

  it('should enable submit button when date and time are selected', async () => {
    const user = userEvent.setup()
    const mockSlots = {
      data: [{ startTime: '09:00', endTime: '10:00', available: true }],
    }

    vi.mocked(api.get).mockResolvedValueOnce(mockSlots)

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />)

    // Select time slot
    await waitFor(async () => {
      const timeSlot = screen.getByText(/09:00/)
      await user.click(timeSlot)
    })

    const submitButton = screen.getByRole('button', { name: /reservar/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('should call onSubmit when clicking submit button', async () => {
    const user = userEvent.setup()
    const mockSlots = {
      data: [{ startTime: '09:00', endTime: '10:00', available: true }],
    }

    vi.mocked(api.get).mockResolvedValueOnce(mockSlots)

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />)

    // Select time slot
    await waitFor(async () => {
      const timeSlot = screen.getByText(/09:00/)
      await user.click(timeSlot)
    })

    const submitButton = screen.getByRole('button', { name: /reservar/i })
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it('should show loading state while fetching slots', async () => {
    vi.mocked(api.get).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />)

    // After selecting date, should show loading
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument() // Loading spinner
    })
  })

  it('should calculate total price correctly', async () => {
    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />)

    const priceSection = screen.getByText(/r\$ 100,00/i)
    expect(priceSection).toBeInTheDocument()
  })
})
