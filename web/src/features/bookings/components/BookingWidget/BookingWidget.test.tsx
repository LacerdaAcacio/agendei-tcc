import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { BookingWidget } from './index';
import { api } from '@/lib/axios';

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockService = {
  id: 'service-123',
  title: 'Test Service',
  description: 'Test Description',
  price: 100,
  priceUnit: 'HOURLY' as const,
  location: 'São Paulo, SP',
  latitude: -23.5505,
  longitude: -46.6333,
  rating: 4.5,
  reviewCount: 10,
  images: [],
  provider: {
    id: 'provider-1',
    name: 'Provider Name',
    avatar: 'avatar.jpg',
    bio: 'Bio',
    rating: 4.8,
    reviewCount: 20,
    email: 'provider@example.com',
    role: 'provider' as const,
  },
  type: 'PRESENTIAL' as const,
  hostYears: 2,
  hostLanguages: ['Português'],
  hostJob: 'Professional',
  amenities: [],
  rules: [],
  safety: [],
  cancellationPolicy: 'FLEXIBLE',
  highlights: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  categoryId: 'category-1',
  userId: 'provider-1',
  availability: {
    monday: { active: true, start: '09:00', end: '18:00' },
    tuesday: { active: true, start: '09:00', end: '18:00' },
    wednesday: { active: true, start: '09:00', end: '18:00' },
    thursday: { active: true, start: '09:00', end: '18:00' },
    friday: { active: true, start: '09:00', end: '18:00' },
    saturday: { active: true, start: '09:00', end: '18:00' },
    sunday: { active: true, start: '09:00', end: '18:00' },
  },
};

describe('BookingWidget', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const selectTomorrow = async (user: ReturnType<typeof userEvent.setup>) => {
    const dateButton = screen.getByRole('button', { name: /adicionar data/i });
    await user.click(dateButton);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayNumber = tomorrow.getDate();

    // Wait for calendar to be visible
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Find and click the day button
    // We use getAllByText because the day number might appear elsewhere, but we want the one in the calendar
    const dayButtons = screen.getAllByText(dayNumber.toString());

    // Find the day button that is in the grid and NOT disabled
    // This avoids selecting the same day number from the previous month (which would be disabled)
    const calendarDay = dayButtons.find(
      (button) => button.closest('[role="grid"]') && !button.hasAttribute('disabled'),
    );

    if (calendarDay) {
      fireEvent.click(calendarDay);
    } else {
      throw new Error('Could not find enabled calendar day button');
    }
  };

  it('should render booking widget', () => {
    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />);

    expect(screen.getByText(/data e horário/i)).toBeInTheDocument();
    expect(screen.getByText(/adicionar data/i)).toBeInTheDocument();
  });

  it('should open calendar when clicking date button', async () => {
    const user = userEvent.setup();
    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />);

    const dateButton = screen.getByRole('button', { name: /adicionar data/i });
    await user.click(dateButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should fetch available slots when date is selected', async () => {
    const user = userEvent.setup();
    const mockSlots = {
      availableSlots: ['09:00', '10:00', '11:00'],
    };

    vi.mocked(api.get).mockResolvedValue(mockSlots);

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />);

    await selectTomorrow(user);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/services/service-123/slots'));
    });
  });

  it('should show available time slots after selecting date', async () => {
    const user = userEvent.setup();
    const mockSlots = {
      availableSlots: ['09:00', '10:00'],
    };

    vi.mocked(api.get).mockResolvedValue(mockSlots);

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />);

    await selectTomorrow(user);

    // After selecting date, slots should appear
    await waitFor(() => {
      expect(screen.getByText(/09:00/)).toBeInTheDocument();
      expect(screen.getByText(/10:00/)).toBeInTheDocument();
    });
  });

  it('should enable submit button when date and time are selected', async () => {
    const user = userEvent.setup();
    const mockSlots = {
      availableSlots: ['09:00'],
    };

    vi.mocked(api.get).mockResolvedValue(mockSlots);

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />);

    await selectTomorrow(user);

    // Select time slot
    await waitFor(async () => {
      const timeSlot = screen.getByText(/09:00/);
      await user.click(timeSlot);
    });

    const submitButton = screen.getByRole('button', { name: /reservar/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('should call onSubmit when clicking submit button', async () => {
    const user = userEvent.setup();
    const mockSlots = {
      availableSlots: ['09:00'],
    };

    vi.mocked(api.get).mockResolvedValue(mockSlots);

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />);

    await selectTomorrow(user);

    // Select time slot
    await waitFor(async () => {
      const timeSlot = screen.getByText(/09:00/);
      await user.click(timeSlot);
    });

    const submitButton = screen.getByRole('button', { name: /reservar/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should show loading state while fetching slots', async () => {
    const user = userEvent.setup();
    vi.mocked(api.get).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    );

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />);

    await selectTomorrow(user);

    // After selecting date, should show loading
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
    });
  });

  it('should calculate total price correctly', async () => {
    const user = userEvent.setup();
    const mockSlots = {
      availableSlots: ['09:00'],
    };

    vi.mocked(api.get).mockResolvedValue(mockSlots);

    render(<BookingWidget service={mockService} onSubmit={mockOnSubmit} />);

    await selectTomorrow(user);

    // Select time slot
    await waitFor(async () => {
      const timeSlot = screen.getByText(/09:00/);
      await user.click(timeSlot);
    });

    // Price should now be visible (100 + 12% fee = 112)
    const priceSection = screen.getByText(/r\$ 112,00/i);
    expect(priceSection).toBeInTheDocument();
  });
});
