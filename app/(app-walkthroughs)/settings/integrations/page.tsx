import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Integrations' };

export default function Page() {
  return (
    <>
      <PageHeader title="Integrations" description="Open the implemented operational integration workspaces." />
      <Card className="mt-6">
        <CardHeader><CardTitle>Connection settings are unavailable</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The backend has operational integration procedures, but no settings API for configuring connection credentials or managing connection state. This screen does not simulate connection status or save credentials.
        </CardContent>
      </Card>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { title: 'Integration health', href: '/integration/health', description: 'Review integration health information.' },
          { title: 'EDI mappings', href: '/integration/edi/mappings', description: 'Open EDI mapping operations.' },
          { title: 'ERP inventory', href: '/integration/erp/inventory', description: 'Open ERP inventory operations.' },
          { title: 'TMS carriers', href: '/integration/tms/carriers', description: 'Open carrier integration operations.' },
          { title: 'Webhook subscriptions', href: '/integration/webhook/subscriptions', description: 'Open webhook subscription operations.' },
        ].map((item) => (
          <Card key={item.href}>
            <CardHeader><CardTitle className="text-sm">{item.title}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{item.description}</p>
              <Button asChild variant="outline" size="sm">
                <Link href={item.href}>Open workspace</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
