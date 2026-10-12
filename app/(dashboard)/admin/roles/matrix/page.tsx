import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Matrix' };

export default function Page() {
  return (
    <>
      <PageHeader title="Matrix" description="Route: /admin/roles/matrix" />
      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {['Open', 'In Progress', 'Awaiting Customs', 'Exceptions'].map((l) => (
          <Card key={l}>
            <CardHeader><CardTitle className="text-sm">{l}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold">0</CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Detail</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Wire this page to the  domain components.</CardContent>
      </Card>
    </>
  );
}
