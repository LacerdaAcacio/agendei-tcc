import { cva } from 'class-variance-authority';

export const containerVariants = cva('mx-auto px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      default: 'max-w-7xl',
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-screen-xl',
      full: 'max-w-full',
    },
    padding: {
      none: 'px-0',
      sm: 'px-2 sm:px-4',
      default: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-6 sm:px-8 lg:px-12',
    },
  },
  defaultVariants: {
    size: 'default',
    padding: 'default',
  },
});
