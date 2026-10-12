import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Settings' };

export default function Page() {
  return (
    <>
      <PageHeader 
        title="Settings" 
        description="Manage your account, preferences, and integrations"
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { title: 'Profile', href: '/settings/profile', description: 'View signed-in account identity. Profile editing is not currently exposed by the API.' },
          { title: 'Organization', href: '/settings/organization', description: 'Review the tenant context for this account. Dedicated organization preferences are unavailable.' },
          { title: 'Security', href: '/settings/security', description: 'See which account-protection controls are supported by the authentication API.' },
          { title: 'API keys', href: '/settings/api-keys', description: 'API key management is unavailable because no key-management endpoint exists.' },
          { title: 'Integrations', href: '/settings/integrations', description: 'Open operational integration screens. Credential and connection settings are unavailable.' },
          { title: 'Notifications', href: '/settings/notifications', description: 'Notification preferences are unavailable because no settings API exists.' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="h-full transition group-hover:border-primary/40">
              <CardHeader><CardTitle className="text-sm">{item.title}</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.description}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
