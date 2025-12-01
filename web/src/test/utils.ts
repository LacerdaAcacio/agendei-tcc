import type { ReactElement } from 'react';
import { render, type RenderOptions, renderHook as rtlRenderHook } from '@testing-library/react';
import { AllTheProviders } from './test-providers';
import { createTestQueryClient } from './query-client';

// Custom render function
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Custom renderHook function
const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: Omit<RenderOptions, 'wrapper'>,
) => rtlRenderHook(render, { wrapper: AllTheProviders, ...options });

// Re-export everything
// Re-export everything
export * from '@testing-library/react';
export { customRender as render, customRenderHook as renderHook, createTestQueryClient };
