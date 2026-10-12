import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { GuardrailMatrix } from '@/components/custom-agents/policy';

export const metadata: Metadata = { title: 'Guardrails' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Guardrails" description="Route: /custom-agents/policy/guardrails" />
      <GuardrailMatrix />
    </div>
  );
}
