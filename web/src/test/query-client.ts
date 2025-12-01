import { QueryClient } from '@tanstack/react-query';

// Create a test Query Client with no retries
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // v5: renamed from cacheTime
      },
      mutations: {
        retry: false,
      },
    },
  });
