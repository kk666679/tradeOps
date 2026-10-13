import { BrokeragePipeline } from "@/components/workflow-studio/brokerage/pipeline";
import type { Declaration } from "@/components/workflow-studio/brokerage/types";
import { BrokerageHeader, BrokerageBreadcrumbs } from "../_components";

export const metadata = {
  title: "Pipeline · Brokerage · TradeOps",
};

/* Sample declarations — replace with tRPC query in production */
const SAMPLE_DECLARATIONS: Declaration[] = [
  {
    id: "d1",
    reference: "K1/PG/2026/00418",
    clientId: "cl-meridian",
    clientName: "Meridian Electronics Sdn Bhd",
    formCode: "K1",
    type: "import",
    status: "classifying",
    jurisdiction: "MY",
    port: "Penang",
    documents: { invoiceRef: "INV-2026-04-781" },
    lineItems: [],
    totalDeclaredValue: 842_000,
    currency: "MYR",
    totalDuty: 0,
    totalSalesTax: 0,
    totalExcise: 0,
    owningBroker: "aisha.rahman",
    draftedBy: "customs.declaration",
    draftConfidence: 0.94,
    approvals: [],
    eventIds: [],
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    updatedAt: new Date(Date.now() - 400_000).toISOString(),
    flags: [],
  },
  {
    id: "d2",
    reference: "K2/PG/2026/00419",
    clientId: "cl-straits",
    clientName: "Straits Freight Brokers Sdn Bhd",
    formCode: "K2",
    type: "export",
    status: "awaiting-approval",
    jurisdiction: "MY",
    port: "Port Klang",
    documents: {},
    lineItems: [],
    totalDeclaredValue: 128_400,
    currency: "MYR",
    totalDuty: 0,
    totalSalesTax: 0,
    totalExcise: 0,
    owningBroker: "daniel.okafor",
    draftedBy: "customs.declaration",
    draftConfidence: 0.71,
    approvals: [],
    eventIds: [],
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 1_800_000).toISOString(),
    flags: ["origin-unclear"],
  },
  {
    id: "d3",
    reference: "K8/PG/2026/00420",
    clientId: "cl-pacific",
    clientName: "Pacific Bonded Sdn Bhd",
    formCode: "K8",
    type: "transit",
    status: "filed",
    jurisdiction: "MY",
    port: "Penang",
    documents: {},
    lineItems: [],
    totalDeclaredValue: 2_140_000,
    currency: "MYR",
    totalDuty: 0,
    totalSalesTax: 0,
    totalExcise: 0,
    owningBroker: "aisha.rahman",
    draftedBy: "customs.declaration",
    draftConfidence: 0.96,
    approvals: [],
    eventIds: [],
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
    updatedAt: new Date(Date.now() - 7_200_000).toISOString(),
    flags: [],
  },
  {
    id: "d4",
    reference: "K1/PG/2026/00421",
    clientId: "cl-trident",
    clientName: "Trident Clearance Sdn Bhd",
    formCode: "K1",
    type: "import",
    status: "channel-yellow",
    jurisdiction: "MY",
    port: "Penang",
    documents: {},
    lineItems: [],
    totalDeclaredValue: 412_000,
    currency: "MYR",
    totalDuty: 12_400,
    totalSalesTax: 24_720,
    totalExcise: 0,
    owningBroker: "daniel.okafor",
    draftedBy: "customs.declaration",
    draftConfidence: 0.88,
    approvals: [],
    eventIds: [],
    createdAt: new Date(Date.now() - 259_200_000).toISOString(),
    updatedAt: new Date(Date.now() - 3_600_000).toISOString(),
    flags: ["channel-yellow"],
  },
  {
    id: "d5",
    reference: "K9/PG/2026/00422",
    clientId: "cl-seagate",
    clientName: "SeaGate Logistics Sdn Bhd",
    formCode: "K9",
    type: "transhipment",
    status: "cleared",
    jurisdiction: "MY",
    port: "Port Klang",
    documents: {},
    lineItems: [],
    totalDeclaredValue: 78_200,
    currency: "MYR",
    totalDuty: 0,
    totalSalesTax: 0,
    totalExcise: 0,
    owningBroker: "aisha.rahman",
    draftedBy: "customs.declaration",
    draftConfidence: 0.97,
    approvals: [],
    eventIds: [],
    createdAt: new Date(Date.now() - 345_600_000).toISOString(),
    updatedAt: new Date(Date.now() - 10_800_000).toISOString(),
    flags: [],
  },
];

export default function PipelinePage() {
  return (
    <>
      <BrokerageBreadcrumbs items={[{ label: "Pipeline" }]} />
      <BrokerageHeader
        eyebrow="Operational"
        title="Declaration pipeline"
        description="Drag cards between columns to transition declarations. Card click opens the declaration detail. Filters accept types, form codes, and flags."
      />
      <div className="px-4 pb-6">
        <BrokeragePipeline declarations={SAMPLE_DECLARATIONS} />
      </div>
    </>
  );
}
