'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { brand } from '@/config/brand';

const brandLogoVariants = cva(
  'inline-flex items-center gap-2',
  {
    variants: {
      variant: {
        full: 'gap-2',
        compact: 'gap-1.5',
        icon: '',
        wordmark: 'gap-1.5',
      },
      size: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
    },
    defaultVariants: {
      variant: 'full',
      size: 'md',
    },
  }
);

interface BrandLogoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof brandLogoVariants> {
  showTagline?: boolean;
  priority?: boolean;
}

export const BrandLogo = forwardRef<HTMLDivElement, BrandLogoProps>(
  (
    {
      className,
      variant = 'full',
      size = 'md',
      showTagline = false,
      priority = false,
      ...props
    },
    ref
  ) => {
    const iconSizeClass = cn(
      'flex-shrink-0',
      size === 'xs' && 'h-5 w-5',
      size === 'sm' && 'h-6 w-6',
      size === 'md' && 'h-8 w-8',
      size === 'lg' && 'h-10 w-10',
      size === 'xl' && 'h-12 w-12'
    );

    const textSizeClass = cn(
      'font-semibold tracking-tight text-foreground',
      size === 'xs' && 'text-xs',
      size === 'sm' && 'text-sm',
      size === 'md' && 'text-base',
      size === 'lg' && 'text-lg',
      size === 'xl' && 'text-xl'
    );

    const taglineSizeClass = cn(
      'font-medium text-muted-foreground',
      size === 'xs' && 'text-[10px]',
      size === 'sm' && 'text-[11px]',
      size === 'md' && 'text-xs',
      size === 'lg' && 'text-sm',
      size === 'xl' && 'text-base'
    );

    return (
      <div
        ref={ref}
        className={cn(brandLogoVariants({ variant, size }), className)}
        {...props}
      >
        {variant !== 'wordmark' && (
          <img
            src={brand.logo.icon}
            alt={variant === 'icon' ? brand.name : ''}
            className={cn(iconSizeClass, 'rounded-lg object-contain')}
            loading={priority ? 'eager' : undefined}
            fetchPriority={priority ? 'high' : 'auto'}
          />
        )}

        {(variant === 'full' || variant === 'compact' || variant === 'wordmark') && (
          <span className={cn(textSizeClass, 'whitespace-nowrap')}>
            {brand.name}
            {showTagline && <span className="ml-1 font-normal text-muted-foreground">— Container Freight System</span>}
          </span>
        )}

        {showTagline && variant === 'full' && size !== 'xs' && size !== 'sm' && (
          <span className={taglineSizeClass} style={{ marginTop: '2px' }}>
            Container Freight System (CFS WMS)
          </span>
        )}
      </div>
    );
  }
);

BrandLogo.displayName = 'BrandLogo';