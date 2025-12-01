import { cva } from 'class-variance-authority';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-3xl font-bold text-gray-900 dark:text-white',
      h2: 'text-2xl font-bold text-gray-900 dark:text-white',
      h3: 'text-xl font-semibold text-gray-900 dark:text-white',
      h4: 'text-lg font-semibold text-gray-900 dark:text-white',
      body: 'text-base text-gray-700 dark:text-slate-300',
      small: 'text-sm text-gray-600 dark:text-slate-400',
      muted: 'text-sm text-gray-500 dark:text-slate-400',
      lead: 'text-lg text-gray-700 dark:text-slate-300',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});
