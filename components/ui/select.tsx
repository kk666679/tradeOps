'use client';
import * as React from 'react';
import * as SelectPrimitive from 'radix-ui';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Select.Root;
const SelectGroup = SelectPrimitive.Select.Group;
const SelectValue = SelectPrimitive.Select.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Select.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Select.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Select.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-[var(--radius-hud)] border border-[var(--line)] bg-[var(--glass-bg-sunken)] px-3 py-2 text-[length:var(--text-data)] text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[color-mix(in_oklab,var(--color-signal-400)_60%,transparent)] focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-signal-400)_20%,transparent)] disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Select.Icon asChild>
      <ChevronDown className="size-4 opacity-50" />
    </SelectPrimitive.Select.Icon>
  </SelectPrimitive.Select.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Select.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Select.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Select.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Select.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.Select.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.Select.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Select.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Select.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Select.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.Select.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.Select.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Select.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Select.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Select.Portal>
    <SelectPrimitive.Select.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-[var(--radius-hud)] border border-[var(--line)] bg-[var(--surface-1)] text-[var(--ink-strong)] shadow-[var(--shadow-lift)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Select.Viewport className={cn('p-1', position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]')}>
        {children}
      </SelectPrimitive.Select.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Select.Content>
  </SelectPrimitive.Select.Portal>
));
SelectContent.displayName = SelectPrimitive.Select.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Select.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Select.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Select.Label ref={ref} className={cn('py-1.5 pl-8 pr-2 text-xs font-semibold text-[var(--ink-muted)]', className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Select.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Select.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Select.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Select.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-[length:var(--text-data)] outline-none focus:bg-[color-mix(in_oklab,var(--color-signal-400)_12%,transparent)] focus:text-[var(--ink-strong)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.Select.ItemIndicator>
        <Check className="size-4" />
      </SelectPrimitive.Select.ItemIndicator>
    </span>
    <SelectPrimitive.Select.ItemText>{children}</SelectPrimitive.Select.ItemText>
  </SelectPrimitive.Select.Item>
));
SelectItem.displayName = SelectPrimitive.Select.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Select.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Select.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Select.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-[var(--line)]', className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Select.Separator.displayName;

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton };
