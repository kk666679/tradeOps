import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-hud)] text-[length:var(--text-data)] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none min-h-[44px] border',
  {
    variants: {
      variant: {
        default: 'bg-[color-mix(in_oklab,var(--surface-3)_55%,transparent)] border-[var(--glass-border)] text-[var(--ink-strong)] hover:bg-[color-mix(in_oklab,var(--surface-3)_78%,transparent)] hover:border-[var(--glass-border-hi)]',
        destructive: 'bg-[var(--destructive)] border-transparent text-[var(--destructive-foreground)] hover:opacity-90',
        outline: 'border-[var(--line)] bg-transparent text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--surface-2)_60%,transparent)]',
        secondary: 'bg-[var(--secondary)] border-transparent text-[var(--secondary-foreground)] hover:opacity-90',
        ghost: 'border-transparent bg-transparent text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--surface-2)_60%,transparent)]',
        link: 'border-transparent bg-transparent text-[var(--primary)] underline-offset-4 hover:underline min-h-0',
      },
      size: {
        default: 'px-4 py-2.5',
        sm: 'px-3 py-1.5 text-xs min-h-[36px]',
        lg: 'px-6 py-3 text-base',
        icon: 'size-10 p-0',
        'icon-sm': 'size-8 p-0',
        'icon-xs': 'size-7 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
