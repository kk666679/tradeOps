import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BondedLedgerAgent, ClearanceFollowUpAgent, CustomsValuationAgent, DeclarationFilingAgent, DocumentExtractionAgent, DrawbackRecoveryAgent, DutyOptimizationAgent, ExemptionReconciliationAgent, HsClassificationAgent, OriginDeterminationAgent, PermitSourcingAgent, PostAuditAgent, SanctionScreeningAgent, TariffChangeWatcherAgent, ZoneGateAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Customs Agents' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customs Agents" description="Route: /custom-agents/customs-agents" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          <BondedLedgerAgent key="BondedLedgerAgent" />,
          <ClearanceFollowUpAgent key="ClearanceFollowUpAgent" />,
          <CustomsValuationAgent key="CustomsValuationAgent" />,
          <DeclarationFilingAgent key="DeclarationFilingAgent" />,
          <DocumentExtractionAgent key="DocumentExtractionAgent" />,
          <DrawbackRecoveryAgent key="DrawbackRecoveryAgent" />,
          <DutyOptimizationAgent key="DutyOptimizationAgent" />,
          <ExemptionReconciliationAgent key="ExemptionReconciliationAgent" />,
          <HsClassificationAgent key="HsClassificationAgent" />,
          <OriginDeterminationAgent key="OriginDeterminationAgent" />,
          <PermitSourcingAgent key="PermitSourcingAgent" />,
          <PostAuditAgent key="PostAuditAgent" />,
          <SanctionScreeningAgent key="SanctionScreeningAgent" />,
          <TariffChangeWatcherAgent key="TariffChangeWatcherAgent" />,
          <ZoneGateAgent key="ZoneGateAgent" />,
        ]}
      </div>
    </div>
  );
}
