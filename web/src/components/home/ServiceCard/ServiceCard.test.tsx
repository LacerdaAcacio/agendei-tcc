import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { ServiceCard } from './index';
import { api } from '@/lib/axios';
import type { Service } from '@/types';

vi.mock('@/lib/axios', () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'price_unit.HOURLY') return 'por hora';
      return key;
    },
  }),
}));

const mockService = {
  id: 'service-123',
  title: 'Professional Photography',
  description: 'High quality photography services',
  price: 250,
  priceUnit: 'HOURLY' as const,
  location: 'São Paulo, SP',
  latitude: -23.5505,
  longitude: -46.6333,
  rating: 4.8,
  reviewCount: 10,
  images: ['https://example.com/image.jpg'],
  isFavorited: false,
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
  availability: {},
};

describe('ServiceCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render service card with all information', () => {
    render(<ServiceCard service={mockService} />);

    expect(screen.getByText('Professional Photography')).toBeInTheDocument();
    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText(/r\$ 250,00/i)).toBeInTheDocument();
  });

  it('should render service image', () => {
    render(<ServiceCard service={mockService} />);

    const image = screen.getByAltText('Professional Photography');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should use fallback image when no images provided', () => {
    const serviceWithoutImages = { ...mockService, images: [] };
    render(<ServiceCard service={serviceWithoutImages} />);

    const image = screen.getByAltText('Professional Photography');
    expect(image).toHaveAttribute('src', expect.stringContaining('unsplash'));
  });

  it('should display rating correctly', () => {
    render(<ServiceCard service={mockService} />);

    const rating = screen.getByText('4.8');
    expect(rating).toBeInTheDocument();
  });

  it('should display default rating when not provided', () => {
    const serviceWithoutRating = { ...mockService, rating: undefined } as unknown as Service;
    render(<ServiceCard service={serviceWithoutRating} />);

    const rating = screen.getByText('5.0');
    expect(rating).toBeInTheDocument();
  });

  it('should format price correctly', () => {
    render(<ServiceCard service={mockService} />);

    expect(screen.getByText(/r\$ 250,00/i)).toBeInTheDocument();
  });

  it('should show price unit correctly', () => {
    render(<ServiceCard service={mockService} />);

    expect(screen.getByText(/por hora/i)).toBeInTheDocument();
  });

  it('should toggle favorite when clicking heart icon', async () => {
    const user = userEvent.setup();
    vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } });

    render(<ServiceCard service={mockService} />);

    const favoriteButton = screen.getByRole('button');
    await user.click(favoriteButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/services/service-123/favorite');
    });
  });

  it('should show filled heart icon when favorited', () => {
    const favoritedService = { ...mockService, isFavorited: true };
    render(<ServiceCard service={favoritedService} />);

    const heartIcon = screen.getByRole('button').querySelector('svg');
    expect(heartIcon).toHaveClass('fill-rose-500');
  });

  it('should show empty heart icon when not favorited', () => {
    render(<ServiceCard service={mockService} />);

    const heartIcon = screen.getByRole('button').querySelector('svg');
    expect(heartIcon).not.toHaveClass('fill-rose-500');
  });

  it('should navigate to service details when clicking card', () => {
    render(<ServiceCard service={mockService} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/services/service-123');
  });

  it('should apply hover effects on card', async () => {
    const user = userEvent.setup();
    render(<ServiceCard service={mockService} />);

    const card = screen.getByRole('link');

    await user.hover(card);

    expect(card).toHaveClass('group');
  });

  it('should handle long service titles', () => {
    const longTitleService = {
      ...mockService,
      title: 'Very Long Service Title That Should Be Truncated When Displayed',
    };
    render(<ServiceCard service={longTitleService} />);

    const title = screen.getByText(/very long service title/i);
    expect(title).toHaveClass('truncate');
  });

  it('should handle long location names', () => {
    const longLocationService = {
      ...mockService,
      location: 'Very Long Location Name, State, Country That Should Be Truncated',
    };
    render(<ServiceCard service={longLocationService} />);

    const location = screen.getByText(/very long location name/i);
    expect(location).toHaveClass('truncate');
  });
});
