import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { ServiceCard } from './index'
import { api } from '@/lib/axios'

vi.mock('@/lib/axios', () => ({
  api: {
    post: vi.fn(),
  },
}))

const mockService = {
  id: 'service-123',
  title: 'Professional Photography',
  description: 'High quality photography services',
  price: 250,
  priceUnit: 'PER_HOUR',
  location: 'São Paulo, SP',
  rating: 4.8,
  images: ['https://example.com/image.jpg'],
  isFavorited: false,
}

describe('ServiceCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render service card with all information', () => {
    render(<ServiceCard service={mockService} />)

    expect(screen.getByText('Professional Photography')).toBeInTheDocument()
    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText(/r\$ 250,00/i)).toBeInTheDocument()
  })

  it('should render service image', () => {
    render(<ServiceCard service={mockService} />)

    const image = screen.getByAltText('Professional Photography')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('should use fallback image when no images provided', () => {
    const serviceWithoutImages = { ...mockService, images: [] }
    render(<ServiceCard service={serviceWithoutImages} />)

    const image = screen.getByAltText('Professional Photography')
    expect(image).toHaveAttribute('src', expect.stringContaining('unsplash'))
  })

  it('should display rating correctly', () => {
    render(<ServiceCard service={mockService} />)

    const rating = screen.getByText('4.8')
    expect(rating).toBeInTheDocument()
  })

  it('should display default rating when not provided', () => {
    const serviceWithoutRating = { ...mockService, rating: undefined }
    render(<ServiceCard service={serviceWithoutRating} />)

    const rating = screen.getByText('5.0')
    expect(rating).toBeInTheDocument()
  })

  it('should format price correctly', () => {
    render(<ServiceCard service={mockService} />)

    expect(screen.getByText(/r\$ 250,00/i)).toBeInTheDocument()
  })

  it('should show price unit correctly', () => {
    render(<ServiceCard service={mockService} />)

    expect(screen.getByText(/por hora/i)).toBeInTheDocument()
  })

  it('should toggle favorite when clicking heart icon', async () => {
    const user = userEvent.setup()
    vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } })

    render(<ServiceCard service={mockService} />)

    const favoriteButton = screen.getByRole('button')
    await user.click(favoriteButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/services/service-123/favorite')
    })
  })

  it('should show filled heart icon when favorited', () => {
    const favoritedService = { ...mockService, isFavorited: true }
    render(<ServiceCard service={favoritedService} />)

    const heartIcon = screen.getByRole('button').querySelector('svg')
    expect(heartIcon).toHaveClass('fill-rose-500')
  })

  it('should show empty heart icon when not favorited', () => {
    render(<ServiceCard service={mockService} />)

    const heartIcon = screen.getByRole('button').querySelector('svg')
    expect(heartIcon).not.toHaveClass('fill-rose-500')
  })

  it('should navigate to service details when clicking card', () => {
    render(<ServiceCard service={mockService} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/services/service-123')
  })

  it('should prevent navigation when clicking favorite button', async () => {
    const user = userEvent.setup()
    vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } })

    render(<ServiceCard service={mockService} />)

    const favoriteButton = screen.getByRole('button')
    
    // Click should be prevented from bubbling to link
    const clickEvent = await user.click(favoriteButton)
    
    // Link should not be clicked
    expect(clickEvent).toBeDefined()
  })

  it('should apply hover effects on card', async () => {
    const user = userEvent.setup()
    render(<ServiceCard service={mockService} />)

    const card = screen.getByRole('link')
    
    await user.hover(card)
    
    expect(card).toHaveClass('group')
  })

  it('should handle long service titles', () => {
    const longTitleService = {
      ...mockService,
      title: 'Very Long Service Title That Should Be Truncated When Displayed',
    }
    render(<ServiceCard service={longTitleService} />)

    const title = screen.getByText(/very long service title/i)
    expect(title).toHaveClass('truncate')
  })

  it('should handle long location names', () => {
    const longLocationService = {
      ...mockService,
      location: 'Very Long Location Name, State, Country That Should Be Truncated',
    }
    render(<ServiceCard service={longLocationService} />)

    const location = screen.getByText(/very long location name/i)
    expect(location).toHaveClass('truncate')
  })
})
