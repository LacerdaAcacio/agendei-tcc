import { vi } from 'vitest';

// Mock API responses
export const mockApiResponses = {
  services: {
    list: {
      data: [
        {
          id: '1',
          title: 'Test Service',
          description: 'Test Description',
          price: 100,
          priceUnit: 'PER_HOUR',
          location: 'São Paulo, SP',
          rating: 4.5,
          images: ['https://example.com/image.jpg'],
          isFavorited: false,
        },
      ],
    },
    details: {
      data: {
        id: '1',
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
      },
    },
  },
  bookings: {
    list: {
      data: [
        {
          id: '1',
          serviceId: '1',
          date: new Date().toISOString(),
          status: 'CONFIRMED',
          price: 100,
        },
      ],
    },
  },
};

// Mock axios instance
export const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
};
