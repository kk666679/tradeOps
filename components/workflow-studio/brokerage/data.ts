/**
 * Brokerage reference data.
 *
 * These are fully-populated, deterministic records used by the dashboard
 * surfaces before the brokerage tRPC procedures land. Every field is
 * populated — no empty strings, nulls, or fabricated gaps. The shape mirrors
 * the Prisma models in `prisma/schema.prisma` (Accreditation, CertificateHolder,
 * ApprovedStaff, Client, Declaration) so it can be swapped for real query
 * output without changing the consumers.
 */

import type { Accreditation, BrokerClient, Declaration } from './types';

/* The single tenant used across the brokerage dashboard. */
export const TENANT_ID = 'ten-ntb001';

/* ---------------------------------------------------------------- *
 * Section 90 accreditation
 * ---------------------------------------------------------------- */

export interface CertificateHolderRecord {
  id: string;
  name: string;
  icNumber: string;
  role: 'director' | 'owner' | 'manager' | 'employee';
  courseType: 'KEK' | 'KEP';
  certificateNum: string;
  issuedAt: string;
  active: boolean;
}

export interface ApprovedStaffRecord {
  id: string;
  name: string;
  icNumber: string;
  position: string;
  authorizedAt: string;
  idPassNumber: string;
  idPassStatus: 'active' | 'lost' | 'returned' | 'pending';
}

export interface AccreditationRecord extends Accreditation {
  tenantId: string;
  licenceNumber: string;
  ejenType: 'PENGHANTARAN' | 'PERKAPALAN' | 'PENGANGKUT_BARANG';
  approvalPeriod: '1-year' | '2-year' | '5-year';
  issuedAt: string;
  renewalFiled: boolean;
  paidUpCapital: number;
  capitalRequired: number;
  registrationType: 'business-act-1956' | 'companies-act-2016';
  serviceTaxReg?: string;
  bondAmount: number;
  bondExpiresAt?: string;
  bumiputeraRequired: boolean;
  bumiputeraActual?: number;
  bumiputeraThreshold?: number;
  outstandingTax: boolean;
  hangingFormsCount: number;
  certificateHolders: CertificateHolderRecord[];
  approvedStaff: ApprovedStaffRecord[];
}

const now = new Date('2026-10-13T00:00:00.000Z');
const at = (daysOffset: number) =>
  new Date(now.getTime() + daysOffset * 86_400_000).toISOString();

export const SAMPLE_ACCREDITATION: AccreditationRecord = {
  id: 'acc-ntb-001',
  code: 'JKDM/EA/2026/1188',
  label: 'Forwarding Agent Licence',
  status: 'active',
  expiresAt: at(412),
  tenantId: TENANT_ID,
  licenceNumber: 'JKDM/EA/2026/1188',
  ejenType: 'PENGHANTARAN',
  approvalPeriod: '5-year',
  issuedAt: at(-153),
  renewalFiled: false,
  paidUpCapital: 350_000,
  capitalRequired: 100_000,
  registrationType: 'companies-act-2016',
  serviceTaxReg: 'W10-1808-31000128',
  bondAmount: 10_000,
  bondExpiresAt: at(732),
  bumiputeraRequired: true,
  bumiputeraActual: 4,
  bumiputeraThreshold: 5,
  outstandingTax: false,
  hangingFormsCount: 0,
  certificateHolders: [
    {
      id: 'ch-1',
      name: 'Nurul Aisyah binti Mohd Yusof',
      icNumber: '880512-14-6038',
      role: 'director',
      courseType: 'KEK',
      certificateNum: 'KEK-2019-0734',
      issuedAt: at(-2210),
      active: true,
    },
    {
      id: 'ch-2',
      name: 'Tan Wei Ming',
      icNumber: '860324-08-5127',
      role: 'director',
      courseType: 'KEK',
      certificateNum: 'KEK-2019-0802',
      issuedAt: at(-2185),
      active: true,
    },
    {
      id: 'ch-3',
      name: 'Siti Zubaidah binti Hamdan',
      icNumber: '900811-10-4416',
      role: 'manager',
      courseType: 'KEP',
      certificateNum: 'KEP-2021-0291',
      issuedAt: at(-1440),
      active: true,
    },
    {
      id: 'ch-4',
      name: 'Rajesh a/l Krishnan',
      icNumber: '850927-14-7754',
      role: 'employee',
      courseType: 'KEP',
      certificateNum: 'KEP-2022-1156',
      issuedAt: at(-980),
      active: true,
    },
    {
      id: 'ch-5',
      name: 'Faridah binti Osman',
      icNumber: '781130-09-2281',
      role: 'owner',
      courseType: 'KEK',
      certificateNum: 'KEK-2012-0331',
      issuedAt: at(-4620),
      active: true,
    },
  ],
  approvedStaff: [
    {
      id: 'as-1',
      name: 'Aisha Rahman',
      icNumber: '930514-13-8842',
      position: 'Senior Customs Declarant',
      authorizedAt: at(-1035),
      idPassNumber: 'IP-A-4417',
      idPassStatus: 'active',
    },
    {
      id: 'as-2',
      name: 'Daniel Okafor',
      icNumber: '910208-14-5563',
      position: 'Customs Declarant',
      authorizedAt: at(-620),
      idPassNumber: 'IP-A-5288',
      idPassStatus: 'active',
    },
    {
      id: 'as-3',
      name: 'Lim Sook Lin',
      icNumber: '941118-10-3391',
      position: 'Compliance Officer',
      authorizedAt: at(-470),
      idPassNumber: 'IP-A-6014',
      idPassStatus: 'active',
    },
    {
      id: 'as-4',
      name: 'Mohd Hafiz bin Ismail',
      icNumber: '890713-14-6729',
      position: 'Documentation Clerk',
      authorizedAt: at(-185),
      idPassNumber: 'IP-A-6742',
      idPassStatus: 'lost',
    },
  ],
};

export const SAMPLE_ACCREDITATIONS: AccreditationRecord[] = [SAMPLE_ACCREDITATION];

/* ---------------------------------------------------------------- *
 * Clients
 * ---------------------------------------------------------------- */

export const SAMPLE_CLIENTS: [BrokerClient, ...BrokerClient[]] = [
  {
    id: 'cl-meridian',
    name: 'Meridian Electronics Sdn Bhd',
    meta: 'Semiconductor import & distribution',
    email: 'compliance@meridian-elec.com.my',
    contactEmail: 'compliance@meridian-elec.com.my',
    phone: '+60 4 388 4421',
    country: 'MY',
    status: 'active',
    registrationNumber: '2014010177X (1245-H)',
    registeredState: 'Penang',
    tier: 'ENTERPRISE',
    sla: 'PRIORITY',
    monthlyVolume: 412,
    onboardedAt: at(-1180),
    authorization: {
      written: true,
      reference: 'JKDM/AUTH/2024/MEE-0119',
      signedAt: at(-1180),
      signedBy: 'Chen Li Wei',
      status: 'active',
      effectiveFrom: at(-1180),
      effectiveTo: at(730),
      scope: ['import', 'export', 'transit', 'bonded', 'drawback'],
      issuedBy: 'Meridian Electronics Sdn Bhd',
    },
    assignedBrokers: ['aisha.rahman', 'daniel.okafor'],
  },
  {
    id: 'cl-straits',
    name: 'Straits Freight Brokers Sdn Bhd',
    meta: 'Re-export & consolidation',
    email: 'ops@straitsfreight.com.my',
    contactEmail: 'ops@straitsfreight.com.my',
    phone: '+60 3 3162 8890',
    country: 'MY',
    status: 'active',
    registrationNumber: '2008010352K (8168-W)',
    registeredState: 'Selangor',
    tier: 'PREFERRED',
    sla: 'STANDARD',
    monthlyVolume: 238,
    onboardedAt: at(-2400),
    authorization: {
      written: true,
      reference: 'JKDM/AUTH/2025/SFB-0073',
      signedAt: at(-900),
      signedBy: 'Noraini binti Roslan',
      status: 'active',
      effectiveFrom: at(-900),
      effectiveTo: at(455),
      scope: ['import', 'export', 'transhipment'],
      issuedBy: 'Straits Freight Brokers Sdn Bhd',
    },
    assignedBrokers: ['daniel.okafor', 'limsooklin'],
  },
  {
    id: 'cl-borneoagri',
    name: 'Borneo AgriProcess Sdn Bhd',
    meta: 'Edible oils · FIZ operator',
    email: 'trade@borneoagri.com.my',
    contactEmail: 'trade@borneoagri.com.my',
    phone: '+60 88 445 6120',
    country: 'MY',
    status: 'active',
    registrationNumber: '2018010288V (1290-A)',
    registeredState: 'Sabah',
    tier: 'STANDARD',
    sla: 'STANDARD',
    monthlyVolume: 96,
    onboardedAt: at(-540),
    authorization: {
      written: false,
      status: 'pending',
      scope: [],
    },
    assignedBrokers: ['aisha.rahman'],
  },
];

export const SAMPLE_CLIENT: BrokerClient = SAMPLE_CLIENTS[0];

/* ---------------------------------------------------------------- *
 * Declarations
 * ---------------------------------------------------------------- */

export const SAMPLE_DECLARATIONS: [Declaration, ...Declaration[]] = [
  {
    id: 'd1',
    reference: 'K1/PG/2026/00418',
    clientId: 'cl-meridian',
    clientName: 'Meridian Electronics Sdn Bhd',
    formCode: 'K1',
    type: 'import',
    status: 'classifying',
    jurisdiction: 'MY',
    port: 'Penang',
    documents: {
      invoiceRef: 'INV-2026-04-781',
      blRef: 'MAEU2631478',
      packingRef: 'PL-2026-0194',
    },
    lineItems: [
      {
        id: 'li-1',
        hsCode: '8471.30.0000',
        description: 'Portable automatic data processing machines, weighing not more than 10 kg',
        quantity: 2400,
        unit: 'PCE',
        unitValue: 350.83,
        totalValue: 842_000,
        dutyRate: 0,
        hsConfidence: 0.97,
        preferenceScheme: 'ATIGA',
        currency: 'MYR',
        classifiedBy: 'customs.hs-classifier',
        classifiedAt: at(-0.5),
      },
      {
        id: 'li-2',
        hsCode: '8504.40.1990',
        description: 'Static converters for telecommunication apparatus',
        quantity: 4800,
        unit: 'PCE',
        unitValue: 24.5,
        totalValue: 117_600,
        dutyRate: 0,
        hsConfidence: 0.88,
        preferenceScheme: 'none',
        currency: 'MYR',
        classifiedBy: 'manual',
        classifiedAt: at(-0.4),
      },
    ],
    totalDeclaredValue: 959_600,
    currency: 'MYR',
    totalDuty: 0,
    totalSalesTax: 57_576,
    totalExcise: 0,
    owningBroker: 'aisha.rahman',
    borangCReference: 'JKDM/PG/2026/B00118',
    draftedBy: 'customs.declaration',
    submittedBy: 'aisha.rahman',
    draftConfidence: 0.94,
    approvals: [],
    createdAt: at(-0.15),
    updatedAt: at(-0.005),
    eventIds: ['evt-1', 'evt-2'],
    flags: [],
  },
  {
    id: 'd2',
    reference: 'K2/PG/2026/00419',
    clientId: 'cl-straits',
    clientName: 'Straits Freight Brokers Sdn Bhd',
    formCode: 'K2',
    type: 'export',
    status: 'awaiting-approval',
    jurisdiction: 'MY',
    port: 'Port Klang',
    documents: {
      invoiceRef: 'SIB-2026-2204',
      blRef: 'EGLV1426879',
    },
    lineItems: [
      {
        id: 'li-3',
        hsCode: '4011.10.1000',
        description: 'New pneumatic tyres of rubber for motor cars',
        quantity: 3200,
        unit: 'PCE',
        unitValue: 40.13,
        totalValue: 128_400,
        dutyRate: 0,
        hsConfidence: 0.99,
        currency: 'MYR',
        classifiedBy: 'customs.hs-classifier',
        classifiedAt: at(-0.6),
      },
    ],
    totalDeclaredValue: 128_400,
    currency: 'MYR',
    totalDuty: 0,
    totalSalesTax: 0,
    totalExcise: 0,
    owningBroker: 'daniel.okafor',
    draftedBy: 'customs.declaration',
    draftConfidence: 0.71,
    approvals: [],
    createdAt: at(-1),
    updatedAt: at(-0.021),
    eventIds: ['evt-3'],
    flags: ['low-draft-confidence'],
  },
  {
    id: 'd3',
    reference: 'K1/PKL/2026/00312',
    clientId: 'cl-borneoagri',
    clientName: 'Borneo AgriProcess Sdn Bhd',
    formCode: 'K1',
    type: 'import',
    status: 'awaiting-approval',
    jurisdiction: 'MY',
    port: 'Sandakan',
    documents: {
      invoiceRef: 'BAP-INV-2026-0092',
      blRef: 'COSU6123049',
    },
    lineItems: [
      {
        id: 'li-4',
        hsCode: '1207.99.0000',
        description: 'Other oil seeds and oleaginous fruits, whether or not broken',
        quantity: 480,
        unit: 'MTQ',
        unitValue: 2680,
        totalValue: 1_286_400,
        dutyRate: 0,
        hsConfidence: 0.93,
        preferenceScheme: 'none',
        currency: 'MYR',
        classifiedBy: 'customs.hs-classifier',
        classifiedAt: at(-1.2),
      },
    ],
    totalDeclaredValue: 1_286_400,
    currency: 'MYR',
    totalDuty: 0,
    totalSalesTax: 77_184,
    totalExcise: 0,
    owningBroker: 'aisha.rahman',
    borangCReference: 'JKDM/SN/2026/B00044',
    draftedBy: 'customs.declaration',
    draftConfidence: 0.93,
    approvals: [
      {
        id: 'apr-1',
        role: 'operations-manager',
        name: 'Lim Sook Lin',
        actor: 'limsooklin',
        decision: 'approved',
        comment: 'FIZ intake reconciled against bonded balance.',
        at: at(-0.4),
        borangCReference: 'JKDM/SN/2026/B00044',
      },
    ],
    createdAt: at(-2.5),
    updatedAt: at(-0.4),
    eventIds: ['evt-4', 'evt-5', 'evt-6'],
    flags: ['fiz-bonded-intake'],
  },
  {
    id: 'd4',
    reference: 'K9/BRN/2026/00087',
    clientId: 'cl-meridian',
    clientName: 'Meridian Electronics Sdn Bhd',
    formCode: 'K9',
    type: 'transit',
    status: 'channel-yellow',
    jurisdiction: 'MY',
    port: 'Johor Bahru',
    documents: {
      invoiceRef: 'INV-2026-03-664',
      blRef: 'MSCU8821406',
      packingRef: 'PL-2026-0171',
    },
    lineItems: [
      {
        id: 'li-5',
        hsCode: '8542.31.0000',
        description: 'Electronic integrated circuits — processors and controllers',
        quantity: 15_000,
        unit: 'PCE',
        unitValue: 11.2,
        totalValue: 168_000,
        dutyRate: 0,
        hsConfidence: 0.85,
        preferenceScheme: 'RCEP',
        currency: 'MYR',
        classifiedBy: 'manual',
        classifiedAt: at(-2.1),
      },
    ],
    totalDeclaredValue: 168_000,
    currency: 'MYR',
    totalDuty: 0,
    totalSalesTax: 10_080,
    totalExcise: 0,
    owningBroker: 'daniel.okafor',
    draftedBy: 'customs.declaration',
    submittedBy: 'daniel.okafor',
    draftConfidence: 0.85,
    approvals: [
      {
        id: 'apr-2',
        role: 'senior-declarant',
        name: 'Aisha Rahman',
        actor: 'aisha.rahman',
        decision: 'approved',
        comment: 'HS confidence below 0.90 — flagged for review before filing.',
        at: at(-1.1),
      },
    ],
    createdAt: at(-3),
    updatedAt: at(-1),
    eventIds: ['evt-7'],
    flags: ['low-draft-confidence', 'rcep-origin-doc-required'],
  },
  {
    id: 'd5',
    reference: 'K3/PKL/2026/00154',
    clientId: 'cl-straits',
    clientName: 'Straits Freight Brokers Sdn Bhd',
    formCode: 'K3',
    type: 'export',
    status: 'cleared',
    jurisdiction: 'MY',
    port: 'Port Klang',
    documents: {
      invoiceRef: 'SIB-2026-2188',
      blRef: 'CMAU4418092',
    },
    lineItems: [
      {
        id: 'li-6',
        hsCode: '4412.10.0000',
        description: 'Plywood, veneered panels and similar laminated wood',
        quantity: 9000,
        unit: 'CTN',
        unitValue: 21.6,
        totalValue: 194_400,
        dutyRate: 0,
        hsConfidence: 0.98,
        currency: 'MYR',
        classifiedBy: 'customs.hs-classifier',
        classifiedAt: at(-5),
      },
    ],
    totalDeclaredValue: 194_400,
    currency: 'MYR',
    totalDuty: 0,
    totalSalesTax: 0,
    totalExcise: 0,
    owningBroker: 'daniel.okafor',
    draftedBy: 'customs.declaration',
    submittedBy: 'daniel.okafor',
    approvedBy: 'limsooklin',
    draftConfidence: 0.98,
    approvals: [
      {
        id: 'apr-3',
        role: 'senior-declarant',
        name: 'Aisha Rahman',
        actor: 'aisha.rahman',
        decision: 'approved',
        comment: 'Routed green lane.',
        at: at(-4.5),
      },
      {
        id: 'apr-4',
        role: 'operations-manager',
        name: 'Lim Sook Lin',
        actor: 'limsooklin',
        decision: 'approved',
        comment: 'Released at PKL gate 3.',
        at: at(-4.2),
      },
    ],
    createdAt: at(-5),
    updatedAt: at(-4.2),
    eventIds: ['evt-8', 'evt-9', 'evt-10', 'evt-11'],
    flags: [],
  },
  {
    id: 'd6',
    reference: 'K2/PKL/2026/00336',
    clientId: 'cl-borneoagri',
    clientName: 'Borneo AgriProcess Sdn Bhd',
    formCode: 'K2',
    type: 'export',
    status: 'draft',
    jurisdiction: 'MY',
    port: 'Kota Kinabalu',
    documents: {},
    lineItems: [],
    totalDeclaredValue: 0,
    currency: 'MYR',
    totalDuty: 0,
    totalSalesTax: 0,
    totalExcise: 0,
    owningBroker: 'aisha.rahman',
    draftedBy: 'manual',
    approvals: [],
    createdAt: at(-0.8),
    updatedAt: at(-0.8),
    eventIds: [],
    flags: ['no-line-items', 'authorization-not-signed'],
  },
  {
    id: 'd7',
    reference: 'K7/PG/2026/00209',
    clientId: 'cl-meridian',
    clientName: 'Meridian Electronics Sdn Bhd',
    formCode: 'K7',
    type: 'import',
    status: 'channel-red',
    jurisdiction: 'MY',
    port: 'Penang',
    documents: {
      invoiceRef: 'INV-2026-04-801',
      blRef: 'MAEU2631820',
    },
    lineItems: [
      {
        id: 'li-7',
        hsCode: '8528.52.0000',
        description: 'Monitors capable of directly connecting to automatic data processing machines',
        quantity: 1800,
        unit: 'PCE',
        unitValue: 486.5,
        totalValue: 875_700,
        dutyRate: 0,
        hsConfidence: 0.62,
        preferenceScheme: 'none',
        currency: 'MYR',
        classifiedBy: 'manual',
        classifiedAt: at(-3.4),
      },
    ],
    totalDeclaredValue: 875_700,
    currency: 'MYR',
    totalDuty: 0,
    totalSalesTax: 52_542,
    totalExcise: 0,
    owningBroker: 'daniel.okafor',
    draftedBy: 'customs.declaration',
    submittedBy: 'daniel.okafor',
    draftConfidence: 0.62,
    approvals: [],
    createdAt: at(-3.5),
    updatedAt: at(-3.4),
    eventIds: ['evt-12'],
    flags: ['low-draft-confidence', 'red-lane-inspection'],
  },
];

export const SAMPLE_DECLARATION: Declaration = SAMPLE_DECLARATIONS[0];

/* ---------------------------------------------------------------- *
 * Declaration workflow graph (Section 90 / K-form pipeline)
 * ---------------------------------------------------------------- */

import type { BrokerageWorkflow } from './types';

export const SAMPLE_WORKFLOW: BrokerageWorkflow = {
  nodes: [
    { id: 'intake', label: 'Document intake', kind: 'start', status: 'done' },
    { id: 'classify', label: 'HS classification', kind: 'task', status: 'done' },
    { id: 'verify', label: 'Agent verification', kind: 'task', status: 'active' },
    { id: 'senior-approval', label: 'Senior declarant approval', kind: 'approval', status: 'active' },
    { id: 'ops-approval', label: 'Operations manager approval', kind: 'approval', status: 'pending' },
    { id: 'file', label: 'File K-form with JKDM', kind: 'task', status: 'pending' },
    { id: 'channel', label: 'Channel selection', kind: 'decision', status: 'pending' },
    { id: 'cleared', label: 'Declared cleared', kind: 'end', status: 'pending' },
  ],
  edges: [
    { from: 'intake', to: 'classify', label: 'documents received' },
    { from: 'classify', to: 'verify', label: 'HS + valuation' },
    { from: 'verify', to: 'senior-approval', label: 'verified' },
    { from: 'senior-approval', to: 'ops-approval', label: 'approved' },
    { from: 'ops-approval', to: 'file', label: 'approved' },
    { from: 'file', to: 'channel', label: 'K-form lodged' },
    { from: 'channel', to: 'cleared', label: 'green / yellow released' },
  ],
};

/* ---------------------------------------------------------------- *
 * Workflow directory
 * ---------------------------------------------------------------- */

export interface WorkflowDirectoryEntry {
  id: string;
  name: string;
  description: string;
  domain: 'brokerage' | 'fiz' | 'fcz' | 'wms' | 'cargo' | 'order-management';
  stepCount: number;
  agentCount: number;
  status: 'live' | 'draft' | 'deprecated';
  href: string;
}

export const WORKFLOW_DIRECTORY: WorkflowDirectoryEntry[] = [
  {
    id: 'wf-brokerage-declaration',
    name: 'Brokerage declaration lifecycle',
    description:
      'Document intake through HS classification, agent verification, dual approval, K-form lodgement, and channel release.',
    domain: 'brokerage',
    stepCount: 8,
    agentCount: 3,
    status: 'live',
    href: '/brokerage',
  },
  {
    id: 'wf-brokerage-pipeline',
    name: 'Declaration pipeline board',
    description:
      'Column view of live declarations by status — draft, classifying, awaiting approval, channel, cleared.',
    domain: 'brokerage',
    stepCount: 8,
    agentCount: 3,
    status: 'live',
    href: '/brokerage/pipeline',
  },
  {
    id: 'wf-section-90',
    name: 'Section 90 governance review',
    description:
      'Section 90 Customs Act 1967 licence conditions: capital, certificate holders, authorised staff, bonds, Bumiputera equity.',
    domain: 'brokerage',
    stepCount: 7,
    agentCount: 0,
    status: 'live',
    href: '/brokerage/governance/section-90',
  },
  {
    id: 'wf-bonded-ledger',
    name: 'Bonded ledger workflow',
    description:
      'FIZ and FCZ bonded movements with hash-chained ledger events and ten designed exception paths.',
    domain: 'fiz',
    stepCount: 12,
    agentCount: 4,
    status: 'live',
    href: '/fiz/walkthrough',
  },
  {
    id: 'wf-fcz-entrepot',
    name: 'FCZ entrepôt matching',
    description:
      'Import, hold, match, and re-export flow for goods held under entrepôt status.',
    domain: 'fcz',
    stepCount: 9,
    agentCount: 2,
    status: 'live',
    href: '/fcz/entrepot/matches',
  },
  {
    id: 'wf-wms-slotting',
    name: 'Warehouse slot allocation',
    description:
      'Replenishment, slotting rules, and pick-face allocation across zones and rack levels.',
    domain: 'wms',
    stepCount: 6,
    agentCount: 1,
    status: 'live',
    href: '/wms',
  },
];

/* ---------------------------------------------------------------- *
 * Section 90 checklist conditions
 * ---------------------------------------------------------------- */

export interface Section90Condition {
  id: string;
  clause: string;
  requirement: string;
  pass: boolean;
  detail: string;
}

/** Derive pass/fail from the accreditation record — no hard-coded verdicts. */
export function buildSection90Conditions(acc: AccreditationRecord): Section90Condition[] {
  const keks = acc.certificateHolders.filter((c) => c.courseType === 'KEK');
  const activeHolders = acc.certificateHolders.filter((c) => c.active);
  const activeStaff = acc.approvedStaff.filter((s) => s.idPassStatus === 'active');
  const capitalShortfall = acc.paidUpCapital - acc.capitalRequired;

  return [
    {
      id: 's90-1',
      clause: '§90(1)(a)',
      requirement: 'Forwarding agent licence issued by JKDM',
      pass: acc.status === 'active',
      detail: `Licence ${acc.licenceNumber} is ${acc.status}${acc.expiresAt ? ` until ${new Date(acc.expiresAt).toISOString().slice(0, 10)}` : ''}.`,
    },
    {
      id: 's90-2',
      clause: '§90(1)(b)',
      requirement: 'Minimum paid-up capital of RM 100,000',
      pass: capitalShortfall >= 0,
      detail:
        capitalShortfall >= 0
          ? `Paid-up capital RM ${acc.paidUpCapital.toLocaleString()} exceeds the RM ${acc.capitalRequired.toLocaleString()} minimum by RM ${capitalShortfall.toLocaleString()}.`
          : `Paid-up capital RM ${acc.paidUpCapital.toLocaleString()} is RM ${Math.abs(capitalShortfall).toLocaleString()} below the RM ${acc.capitalRequired.toLocaleString()} minimum.`,
    },
    {
      id: 's90-3',
      clause: '§90(1)(c)',
      requirement: 'Registration as an ejen penghantaran',
      pass: acc.ejenType === 'PENGHANTARAN',
      detail: `Registered under the ${acc.registrationType === 'companies-act-2016' ? 'Companies Act 2016' : 'Business Act 1956'} as ${acc.ejenType}.`,
    },
    {
      id: 's90-4',
      clause: '§90(1)(d)',
      requirement: 'At least one KEK-certified holder of authority',
      pass: keks.length > 0,
      detail: `${keks.length} KEK certificate holder${keks.length === 1 ? '' : 's'} on record (${activeHolders.length} active holders in total).`,
    },
    {
      id: 's90-5',
      clause: '§90(2)(a)',
      requirement: 'Authorised staff hold valid JKDM ID passes',
      pass: acc.approvedStaff.every((s) => s.idPassStatus !== 'pending'),
      detail: `${activeStaff.length} of ${acc.approvedStaff.length} authorised staff hold active ID passes.`,
    },
    {
      id: 's90-6',
      clause: '§90(2)(b)',
      requirement: 'Security bond of RM 10,000 in force',
      pass: !!acc.bondExpiresAt && new Date(acc.bondExpiresAt) > new Date(),
      detail: acc.bondExpiresAt
        ? `Bond of RM ${acc.bondAmount.toLocaleString()} expires ${new Date(acc.bondExpiresAt).toISOString().slice(0, 10)}.`
        : 'No bond expiry recorded.',
    },
    {
      id: 's90-7',
      clause: '§90(3)',
      requirement: 'No outstanding customs tax liability',
      pass: !acc.outstandingTax && acc.hangingFormsCount === 0,
      detail: acc.outstandingTax
        ? 'Outstanding tax liability must be settled.'
        : `No outstanding liability. ${acc.hangingFormsCount} hanging K-forms.`,
    },
    {
      id: 's90-8',
      clause: 'Sch. 2',
      requirement: 'Bumiputera equity threshold met',
      pass: !acc.bumiputeraRequired || (acc.bumiputeraActual ?? 0) >= (acc.bumiputeraThreshold ?? 0),
      detail: acc.bumiputeraRequired
        ? `${acc.bumiputeraActual ?? 0} of ${acc.bumiputeraThreshold ?? 0} required Bumiputera shareholders.`
        : 'Bumiputera equity requirement not applicable.',
    },
  ];
}