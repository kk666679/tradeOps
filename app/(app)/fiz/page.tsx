import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizDashboard } from '@/components/fiz-fcz/fiz/FizDashboard';
import { FizRawMaterialLedger } from '@/components/fiz-fcz/fiz/FizRawMaterialLedger';
import { FizProductionInputTracker } from '@/components/fiz-fcz/fiz/FizProductionInputTracker';
import { FizFinishedGoodsRegister } from '@/components/fiz-fcz/fiz/FizFinishedGoodsRegister';
import { FizMachineryImport } from '@/components/fiz-fcz/fiz/FizMachineryImport';
import { FizOperatorRegistry } from '@/components/fiz-fcz/fiz/FizOperatorRegistry';
import { FizSubcontractPanel } from '@/components/fiz-fcz/fiz/FizSubcontractPanel';
import { FizWastageScrapPanel } from '@/components/fiz-fcz/fiz/FizWastageScrapPanel';
import { FizApprovalWorkflow } from '@/components/fiz-fcz/fiz/FizApprovalWorkflow';

const handleSubmit = async (values: Record<string, unknown>) => {
  'use server';
  console.log('Submit:', values);
};

const handleCancel = async () => {
  'use server';
  console.log('Cancel');
};

export const metadata: Metadata = { title: 'Free Industrial Zone (FIZ)' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Free Industrial Zone (FIZ)" description="Raw materials, production inputs, finished goods, machinery, operators, subcontracting, wastage, and approvals" />
      <FizDashboard />
      <div className="grid gap-6 lg:grid-cols-2">
        <FizRawMaterialLedger />
        <FizProductionInputTracker />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <FizFinishedGoodsRegister />
        <FizMachineryImport />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <FizOperatorRegistry />
        <FizSubcontractPanel onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <FizWastageScrapPanel onSubmit={handleSubmit} onCancel={handleCancel} />
        <FizApprovalWorkflow />
      </div>
    </div>
  );
}