import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { ServiceCard } from '../ServiceCard';

const mockService = {
  id: '1',
  title: 'Faxina Residencial',
  description: 'Serviço de faxina completa',
  price: 100,
  priceUnit: 'HOURLY' as const,
  location: 'São Paulo - SP',
  latitude: -23.55052,
  longitude: -46.633308,
  images: ['https://example.com/image.jpg'],
  rating: 4.5,
  reviewCount: 10,
  type: 'PRESENTIAL' as const,
  hostYears: 2,
  hostLanguages: ['Português'],
  hostJob: 'Profissional de Limpeza',
  highlights: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  categoryId: 'cat-1',
  userId: 'user-1',
};

// Mock navigation
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock useWishlist hook
jest.mock('@/hooks/useWishlist', () => ({
  useWishlist: () => ({
    isFavorited: jest.fn(() => false),
    toggleWishlist: jest.fn(),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('ServiceCard', () => {
  it('should render service title', () => {
    render(<ServiceCard service={mockService} />, { wrapper: Wrapper });
    
    expect(screen.getByText('Faxina Residencial')).toBeTruthy();
  });

  it('should render service price formatted', () => {
    render(<ServiceCard service={mockService} />, { wrapper: Wrapper });
    
    expect(screen.getByText(/R\$\s*100/)).toBeTruthy();
  });

  it('should render service location', () => {
    render(<ServiceCard service={mockService} />, { wrapper: Wrapper });
    
    expect(screen.getByText('São Paulo - SP')).toBeTruthy();
  });

  it('should render service rating', () => {
    render(<ServiceCard service={mockService} />, { wrapper: Wrapper });
    
    expect(screen.getByText('4.5')).toBeTruthy();
    expect(screen.getByText('(10)')).toBeTruthy();
  });
});
