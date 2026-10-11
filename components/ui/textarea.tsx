import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-[var(--radius-hud)] border border-[var(--line)] bg-[var(--glass-bg-sunken)] px-3 py-2 text-[length:var(--text-data)] text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] transition-[border-color,box-shadow] focus:outline-none focus:border-[color-mix(in_oklab,var(--color-signal-400)_60%,transparent)] focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-signal-400)_20%,transparent)] disabled:cursor-not-allowed disabled:opacity-50 resize-none',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export { Textarea };
