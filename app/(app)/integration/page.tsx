import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ERPIntegration, TMSIntegration, WMSIntegration } from '@/components/integration';
import { ERPIntegration as ERPCore } from '@/components/integration/ERP';
import { TMSIntegration as TMSCore } from '@/components/integration/TMS';
import { WMSIntegration as WMSCore } from '@/components/integration/WMS';
import { CustomsGateway } from '@/components/integration/CustomsGateway';
import { FizFczGateway } from '@/components/integration/FizFczGateway';
import { AgentMeshGateway } from '@/components/integration/AgentMeshGateway';
import { EdiAsycudaMapper } from '@/components/integration/EdiAsycudaMapper';

export const metadata: Metadata = { title: 'Integrations' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Integrations" description="ERP, TMS, WMS, Customs, FIZ/FCZ, Agent Mesh, and EDI/ASYCUDA gateways" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ERPIntegration />
        <TMSIntegration />
        <WMSIntegration />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ERPCore />
        <TMSCore />
      </div>
      <WMSCore />
      <div className="grid gap-6 lg:grid-cols-3">
        <CustomsGateway />
        <FizFczGateway />
        <AgentMeshGateway />
      </div>
      <EdiAsycudaMapper />
    </div>
  );
}