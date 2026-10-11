'use client';
import * as React from 'react';
import * as AvatarPrimitive from 'radix-ui';
import { cn } from '@/lib/utils';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Avatar.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Avatar.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Avatar.Root
    ref={ref}
    className={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Avatar.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Avatar.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Avatar.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Avatar.Image ref={ref} className={cn('aspect-square size-full', className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Avatar.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Avatar.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Avatar.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Avatar.Fallback
    ref={ref}
    className={cn('flex size-full items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--ink-muted)] text-sm font-medium', className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Avatar.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
