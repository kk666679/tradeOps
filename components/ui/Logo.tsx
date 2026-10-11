'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { brand } from '@/config/brand';

const logoVariants = cva(
  'inline-flex items-center gap-2',
  {
    variants: {
      size: {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

interface LogoProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof logoVariants> {}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(logoVariants({ size }), className)}
        {...props}
      >
        <img
          src="/apple-touch-icon.png"
          alt={brand.name}
          className={cn('rounded-lg', size === 'sm' && 'h-6 w-6', size === 'md' && 'h-8 w-8', size === 'lg' && 'h-10 w-10', size === 'xl' && 'h-12 w-12')}
        />
      </div>
    );
  }
);

Logo.displayName = 'Logo';