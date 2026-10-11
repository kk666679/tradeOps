import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthShell } from '@/components/marketing/auth';

export const metadata: Metadata = { title: 'Reset Password' };

export default function Page() {
  return (
    <AuthShell>
      <Card>
        <CardHeader><CardTitle>Reset Password</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Auth page for <code>/reset-password</code>.</p>
          <Button asChild className="w-full"><Link href="/login">Continue</Link></Button>
          <p className="text-center text-xs text-muted-foreground">
            <Link href="/">← Back to home</Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
