'use client';
import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface FeatureCardProps { title: string; body: string; href?: string; icon?: React.ReactNode; }
export function FeatureCard({ title, body, href, icon }: FeatureCardProps) {
  const Wrapper: any = href ? Link : 'div';
  return (
    <Wrapper href={href ?? '#'} className="block">
      <Card className="h-full transition hover:border-primary/40 hover:shadow-sm">
        <CardHeader>
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">{icon ?? '◆'}</div>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{body}</CardContent>
      </Card>
    </Wrapper>
  );
}
export default FeatureCard;
