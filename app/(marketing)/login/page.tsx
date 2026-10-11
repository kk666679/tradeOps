import * as React from 'react';
import type { Metadata } from 'next';
import { AuthForm, AuthShell } from '@/components/marketing/auth';

export const metadata: Metadata = { title: 'Login' };

export default function Page() {
  return <AuthShell><AuthForm mode="login" /></AuthShell>;
}
