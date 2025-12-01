import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { containerVariants } from './container-variants';

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: 'div' | 'main' | 'section' | 'article';
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, as: Comp = 'div', ...props }, ref) => {
    return (
      <Comp className={cn(containerVariants({ size, padding, className }))} ref={ref} {...props} />
    );
  },
);
Container.displayName = 'Container';

export { Container };
