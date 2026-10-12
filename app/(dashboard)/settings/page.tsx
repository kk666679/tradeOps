import * as React from 'react';
import type { Metadata } from 'next';
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
      <div className="mt-6 grid gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:border-primary/40 transition">
            <CardHeader>
              <CardTitle className="text-sm">Profile</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Update your personal information and preferences
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/40 transition">
            <CardHeader>
              <CardTitle className="text-sm">Organization</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Manage organization settings and team members
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/40 transition">
            <CardHeader>
              <CardTitle className="text-sm">Security</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Update passwords and security settings
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:border-primary/40 transition">
            <CardHeader>
              <CardTitle className="text-sm">API Keys</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Manage API keys and access tokens
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/40 transition">
            <CardHeader>
              <CardTitle className="text-sm">Integrations</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Connect third-party services and tools
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/40 transition">
            <CardHeader>
              <CardTitle className="text-sm">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Configure notification preferences
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
