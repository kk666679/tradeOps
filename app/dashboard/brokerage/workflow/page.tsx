import { BondedWorkflowExplorer } from "@/components/fiz-fcz/workflow/BondedWorkflowExplorer";
import { BrokerageHeader, BrokerageBreadcrumbs } from "../_components";

export const metadata = {
  title: "Workflow · Brokerage · TradeOps",
};

export default function WorkflowPage() {
  return (
    <>
      <BrokerageBreadcrumbs items={[{ label: "Workflow" }]} />
      <BrokerageHeader
        eyebrow="Section 90 · Operational"
        title="Brokerage workflow explorer"
        description="Three interleaved layers: Section 90 regulatory accreditation, client engagement, and the operational declaration lifecycle. Click any node to inspect. Run the simulation to walk the graph."
      />
      <div className="px-4 pb-6">
        <BondedWorkflowExplorer height={760} />
      </div>
    </>
  );
}
