import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { typographyVariants } from './typography-variants';

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

function getDefaultElement(variant: TypographyProps['variant']): React.ElementType {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'small':
    case 'muted':
      return 'span';
    default:
      return 'p';
  }
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Comp = (as || getDefaultElement(variant)) as React.ElementType;
    return <Comp className={cn(typographyVariants({ variant, className }))} ref={ref} {...props} />;
  },
);
Typography.displayName = 'Typography';

export { Typography };
