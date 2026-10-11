'use client';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface TestimonialCardProps { quote: string; author: string; org?: string; }
export function TestimonialCard({ quote, author, org }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-3 p-6">
        <p className="text-sm">“{quote}”</p>
        <div className="text-xs text-muted-foreground">— {author}{org ? ', ' + org : ''}</div>
      </CardContent>
    </Card>
  );
}
export default TestimonialCard;
