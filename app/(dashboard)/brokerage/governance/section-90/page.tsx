import { SAMPLE_ACCREDITATION } from "@/components/workflow-studio/brokerage/workflow/brokerageWorkflowGraph";
import { Section90Checklist } from "@/components/workflow-studio/brokerage/workflow/Section90Checklist";
import { RegulatoryHealthPanel } from "@/components/workflow-studio/brokerage/workflow/RegulatoryHealthPanel";
import { BrokerageHeader, BrokerageBreadcrumbs } from "../../_components";

export const metadata = {
  title: "Section 90 checklist · Brokerage · TradeOps",
};

export default function Section90Page() {
  const accreditation = SAMPLE_ACCREDITATION;

  return (
    <>
      <BrokerageBreadcrumbs
        items={[
          { label: "Governance", href: "/brokerage/governance" },
          { label: "Section 90" },
        ]}
      />
      <BrokerageHeader
        eyebrow="Customs Act 1967 §90"
        title="Section 90 compliance checklist"
        description={`Licence ${accreditation.licenceNumber} · ${accreditation.ejenType} · expires ${new Date(accreditation.expiresAt).toLocaleDateString()}. Print, sign, and file for your firm's compliance records.`}
      />

      <div className="grid grid-cols-1 gap-4 px-4 pb-6 lg:grid-cols-[1fr_360px]">
        <Section90Checklist data={accreditation} />
        <aside className="flex flex-col gap-3">
          <RegulatoryHealthPanel data={accreditation} />
        </aside>
      </div>
    </>
  );
}
