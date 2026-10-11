'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface PageHeaderProps {
  title?: string;
  value?: React.ReactNode;
  hint?: string;
  zone?: 'FIZ' | 'FCZ';
  className?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  title = 'PageHeader',
  value,
  hint,
  zone,
  className,
  description,
  action,
  children,
}: PageHeaderProps) {
  // Banner layout — used by app pages (title + description + optional action)
  if (description !== undefined || action !== undefined || children !== undefined) {
    return (
      <div className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className ?? ''}`}>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted-foreground break-words">{description}</p> : null}
          {children}
        </div>
        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </div>
    );
  }

  // Card layout — legacy stat widget usage
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {zone ? <span className="text-xs text-muted-foreground">{zone}</span> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value ?? '—'}</div>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export default PageHeader;
