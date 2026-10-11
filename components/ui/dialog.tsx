'use client';
import * as React from 'react';
import * as DialogPrimitive from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Dialog.Root;
const DialogTrigger = DialogPrimitive.Dialog.Trigger;
const DialogPortal = DialogPrimitive.Dialog.Portal;
const DialogClose = DialogPrimitive.Dialog.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Dialog.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Dialog.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Dialog.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Dialog.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-6 shadow-[var(--shadow-lift)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className
      )}
      {...props}
    >
      {children}
      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none disabled:pointer-events-none">
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </DialogPrimitive.Dialog.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Dialog.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)} {...props} />
);

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
);

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Dialog.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Dialog.Title ref={ref} className={cn('text-[length:var(--text-h3)] font-semibold text-[var(--ink-strong)]', className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Dialog.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Dialog.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Dialog.Description ref={ref} className={cn('text-[length:var(--text-data)] text-[var(--ink-muted)]', className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Dialog.Description.displayName;

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
