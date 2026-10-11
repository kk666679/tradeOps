'use client';
import * as React from 'react';
import * as TabsPrimitive from 'radix-ui';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Tabs.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Tabs.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tabs.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tabs.List
    ref={ref}
    className={cn('inline-flex h-10 items-center justify-center rounded-[var(--radius-hud)] bg-[var(--surface-2)] p-1 text-[var(--ink-muted)]', className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.Tabs.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Tabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tabs.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tabs.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center text-nowrap rounded-sm px-3 py-1.5 text-[length:var(--text-data)] font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[var(--surface-1)] data-[state=active]:text-[var(--ink-strong)] data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Tabs.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Tabs.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tabs.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tabs.Content
    ref={ref}
    className={cn('mt-2 focus-visible:outline-none', className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Tabs.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
