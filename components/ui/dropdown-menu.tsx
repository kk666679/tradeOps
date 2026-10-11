'use client';
import * as React from 'react';
import * as DropdownMenuPrimitive from 'radix-ui';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DropdownMenu = DropdownMenuPrimitive.DropdownMenu.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.DropdownMenu.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.DropdownMenu.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.DropdownMenu.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.DropdownMenu.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.DropdownMenu.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.DropdownMenu.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.DropdownMenu.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.DropdownMenu.SubTrigger
    ref={ref}
    className={cn('flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-[length:var(--text-data)] outline-none focus:bg-[color-mix(in_oklab,var(--color-signal-400)_12%,transparent)] data-[state=open]:bg-[color-mix(in_oklab,var(--color-signal-400)_12%,transparent)]', inset && 'pl-8', className)}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-4" />
  </DropdownMenuPrimitive.DropdownMenu.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.DropdownMenu.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.DropdownMenu.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.DropdownMenu.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.DropdownMenu.SubContent
    ref={ref}
    className={cn('z-50 min-w-[8rem] overflow-hidden rounded-[var(--radius-hud)] border border-[var(--line)] bg-[var(--surface-1)] p-1 text-[var(--ink-strong)] shadow-[var(--shadow-lift)]', className)}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.DropdownMenu.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.DropdownMenu.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.DropdownMenu.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.DropdownMenu.Portal>
    <DropdownMenuPrimitive.DropdownMenu.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn('z-50 min-w-[8rem] overflow-hidden rounded-[var(--radius-hud)] border border-[var(--line)] bg-[var(--surface-1)] p-1 text-[var(--ink-strong)] shadow-[var(--shadow-lift)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95', className)}
      {...props}
    />
  </DropdownMenuPrimitive.DropdownMenu.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.DropdownMenu.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.DropdownMenu.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.DropdownMenu.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.DropdownMenu.Item
    ref={ref}
    className={cn('relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-[length:var(--text-data)] outline-none transition-colors focus:bg-[color-mix(in_oklab,var(--color-signal-400)_12%,transparent)] focus:text-[var(--ink-strong)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50', inset && 'pl-8', className)}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.DropdownMenu.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.DropdownMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.DropdownMenu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.DropdownMenu.CheckboxItem
    ref={ref}
    className={cn('relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-[length:var(--text-data)] outline-none transition-colors focus:bg-[color-mix(in_oklab,var(--color-signal-400)_12%,transparent)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.DropdownMenu.ItemIndicator>
        <Check className="size-4" />
      </DropdownMenuPrimitive.DropdownMenu.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.DropdownMenu.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.DropdownMenu.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.DropdownMenu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.DropdownMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.DropdownMenu.RadioItem
    ref={ref}
    className={cn('relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-[length:var(--text-data)] outline-none transition-colors focus:bg-[color-mix(in_oklab,var(--color-signal-400)_12%,transparent)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.DropdownMenu.ItemIndicator>
        <Circle className="size-2 fill-current" />
      </DropdownMenuPrimitive.DropdownMenu.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.DropdownMenu.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.DropdownMenu.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.DropdownMenu.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.DropdownMenu.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.DropdownMenu.Label ref={ref} className={cn('px-2 py-1.5 text-xs font-semibold text-[var(--ink-muted)]', inset && 'pl-8', className)} {...props} />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.DropdownMenu.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.DropdownMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.DropdownMenu.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.DropdownMenu.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-[var(--line)]', className)} {...props} />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.DropdownMenu.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
);

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup };
