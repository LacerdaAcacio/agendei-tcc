import { describe, it, expect } from 'vitest';

import { cn } from './utils';

describe('cn (className utility)', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('should handle empty strings', () => {
    expect(cn('', 'foo', '')).toBe('foo');
  });

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('should override conflicting Tailwind classes', () => {
    expect(cn('px-2', 'px-4')).not.toContain('px-2');
    expect(cn('px-2', 'px-4')).toContain('px-4');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });
});
