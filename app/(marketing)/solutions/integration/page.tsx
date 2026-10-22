'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* ══════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════ */
type SolutionId = 'broker' | 'forwarder' | 'manufacturer';
type IntCategory = 'erp' | 'accounting' | 'carrier' | 'customs' | 'banking' | 'ecommerce' | 'docs';
type IntStatus = 'live' | 'beta' | 'coming';
type IntDirection = '↔' | '→' | '←';
type CompValue = 'yes' | 'partial' | 'no';

interface SolutionMetric { v: string; l: string; }
interface SolutionModule { ico: string; t: string; d: string; }
interface WorkflowStep { t: string; d: string; }
interface CaseStudy { quote: string; author: string; initial: string; }

interface Solution {
  id: SolutionId;
  title: string;
  shortDesc: string;
  icon: string;
  tagline: string;
  metrics: SolutionMetric[];
  modules: SolutionModule[];
  workflow: WorkflowStep[];
  case: CaseStudy;
  extra: string;
}

interface ComparisonRow {
  cap: string;
  broker: CompValue;
  forwarder: CompValue;
  manufacturer: CompValue;
}

interface Integration {
  id: string;
  cat: IntCategory;
  name: string;
  status: IntStatus;
  direction: IntDirection;
  desc: string;
  long: string;
  capabilities: string[];
  setup: string;
  auth: string;
  entities: string[];
  endpoint: string;
}

interface IntegrationCategory { id: 'all' | IntCategory; label: string; }
interface Toast { id: number; msg: string; kind: 'ok' | 'warn'; }
interface TickerLine { time: string; src: string; msg: string; cls: string; }

/* ══════════════════════════════════════════════════════════
   BRAND LOGOS (SVG strings)
   ══════════════════════════════════════════════════════════ */
const LOGOS: Record<string, string> = {
  sap: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sap-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0FAAFF"/><stop offset="1" stop-color="#0064A4"/></linearGradient></defs><rect width="40" height="40" fill="url(#sap-g)"/><text x="20" y="26" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="13" fill="#fff" letter-spacing="0.5">SAP</text></svg>`,
  netsuite: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#1B5F9E"/><text x="20" y="17" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="8" fill="#fff">ORACLE</text><text x="20" y="28" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="10" fill="#fff" letter-spacing="-0.3">NetSuite</text></svg>`,
  dynamics: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#fff"/><rect x="8" y="8" width="11" height="11" fill="#F25022"/><rect x="21" y="8" width="11" height="11" fill="#7FBA00"/><rect x="8" y="21" width="11" height="11" fill="#00A4EF"/><rect x="21" y="21" width="11" height="11" fill="#FFB900"/></svg>`,
  odoo: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#714B67"/><circle cx="20" cy="20" r="10.5" fill="none" stroke="#fff" stroke-width="3"/><circle cx="20" cy="20" r="3.4" fill="#fff"/></svg>`,
  quickbooks: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#2CA01C"/><circle cx="20" cy="20" r="11.5" fill="#fff"/><text x="20" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="13" fill="#2CA01C" letter-spacing="-0.5">qb</text></svg>`,
  xero: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#13B5EA"/><circle cx="20" cy="20" r="12" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M15 15l10 10M25 15L15 25" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  zoho: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#E42527"/><path d="M11 11h17L13 29h16" stroke="#fff" stroke-width="3.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
  maersk: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#42B0D5"/><path d="M20 7.5l2.9 8.2h8.6l-7 5.1 2.7 8.3L20 24.1l-7.2 5 2.7-8.3-7-5.1h8.6z" fill="#fff"/></svg>`,
  msc: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#003366"/><text x="20" y="27" text-anchor="middle" font-family="Georgia,serif" font-weight="900" font-size="14" fill="#fff" letter-spacing="-0.5">MSC</text></svg>`,
  cmacgm: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#00A0DF"/><text x="20" y="19" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="9.5" fill="#fff">CMA</text><text x="20" y="29" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="9.5" fill="#fff">CGM</text></svg>`,
  dhl: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#FFCC00"/><text x="20" y="27" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="15" fill="#D40511" letter-spacing="-1">DHL</text></svg>`,
  fedex: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#fff"/><text x="20" y="27" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="13" letter-spacing="-0.8"><tspan fill="#4D148C">Fed</tspan><tspan fill="#FF6600">Ex</tspan></text></svg>`,
  ups: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#351C15"/><path d="M20 5.5l11 3.5v9c0 8-4.7 12.8-11 14.5-6.3-1.7-11-6.5-11-14.5v-9z" fill="#FFB500"/><text x="20" y="23.5" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="10" fill="#351C15">UPS</text></svg>`,
  ucustoms: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#010066"/><rect x="8" y="9" width="24" height="4" fill="#CC0001"/><rect x="8" y="13" width="24" height="4" fill="#fff"/><rect x="8" y="17" width="24" height="4" fill="#FFCC00"/><rect x="8" y="21" width="24" height="4" fill="#CC0001"/><rect x="8" y="25" width="24" height="4" fill="#fff"/><rect x="8" y="29" width="24" height="4" fill="#CC0001"/></svg>`,
  tradenet: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#EF3340"/><text x="20" y="26" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="12" fill="#fff" letter-spacing="0.3">TN</text></svg>`,
  cbam: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#003399"/><circle cx="20" cy="20" r="9" fill="none" stroke="#FFCC00" stroke-width="1.2"/><g fill="#FFCC00"><circle cx="20" cy="10.5" r="1.3"/><circle cx="20" cy="29.5" r="1.3"/><circle cx="10.5" cy="20" r="1.3"/><circle cx="29.5" cy="20" r="1.3"/><circle cx="13.3" cy="13.3" r="1.3"/><circle cx="26.7" cy="13.3" r="1.3"/><circle cx="13.3" cy="26.7" r="1.3"/><circle cx="26.7" cy="26.7" r="1.3"/></g></svg>`,
  ace: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#0A3161"/><rect x="8" y="11" width="24" height="2" fill="#fff"/><rect x="8" y="16" width="24" height="2" fill="#fff"/><rect x="8" y="21" width="24" height="2" fill="#fff"/><rect x="8" y="26" width="24" height="2" fill="#fff"/><rect x="8" y="11" width="11" height="17" fill="#B31942"/><g fill="#fff"><circle cx="11" cy="14" r="0.7"/><circle cx="14" cy="14" r="0.7"/><circle cx="17" cy="14" r="0.7"/><circle cx="12.5" cy="17" r="0.7"/><circle cx="15.5" cy="17" r="0.7"/><circle cx="11" cy="20" r="0.7"/><circle cx="14" cy="20" r="0.7"/><circle cx="17" cy="20" r="0.7"/><circle cx="12.5" cy="23" r="0.7"/><circle cx="15.5" cy="23" r="0.7"/></g></svg>`,
  defi: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#627EEA"/><path d="M20 7L27 20.5l-7 4.2-7-4.2z" fill="#fff" opacity="0.9"/><path d="M20 21.5v12L27 21z" fill="#fff" opacity="0.6"/><path d="M20 21.5v12L13 21z" fill="#fff" opacity="0.75"/></svg>`,
  stablecoin: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#2775CA"/><circle cx="20" cy="20" r="11.5" fill="none" stroke="#fff" stroke-width="2"/><text x="20" y="23.5" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="8" fill="#fff">USDC</text></svg>`,
  maybank: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#FFCC00"/><path d="M10 28c2-6 6.5-11 10-11s8 5 10 11z" fill="#000"/><text x="20" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="6" fill="#000" letter-spacing="0.3">maybank</text></svg>`,
  shopify: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#95BF47"/><path d="M27 12c0-2-1.5-3.5-3.5-3.5-1 0-2 .5-2.5 1.2C20.5 8.6 19.5 8 18.5 8c-2.5 0-4 3-4.5 6l-3.5.8L13.5 31h14z" fill="#fff"/><path d="M23.5 8.5c1.5 0 2.5 1 3 2.5" stroke="#95BF47" stroke-width="1" fill="none"/><circle cx="18.5" cy="15" r="0.9" fill="#95BF47"/></svg>`,
  amazon: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#232F3E"/><text x="20" y="23" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="10" fill="#fff" letter-spacing="-0.3">amazon</text><path d="M12.5 26.5c3 2.2 12 2.2 15 0l.7.7c-3.2 2.2-13.2 2.2-16.4 0z" fill="#FF9900"/></svg>`,
  alibaba: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#FF6A00"/><text x="20" y="26" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="13" fill="#fff" letter-spacing="-0.5">Ali</text></svg>`,
  docusign: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#FFCC22"/><text x="20" y="27" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="15" fill="#000" letter-spacing="-0.6">Docu</text></svg>`,
  adobe: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#FA0F00"/><path d="M22.5 8L32 32h-6.5l-1.8-5h-6L22.5 8z" fill="#fff"/><path d="M17.5 8L8 32h6.5l1.8-5h6L17.5 8z" fill="#fff"/></svg>`,
  slack: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#fff"/><g transform="translate(9,9)"><path d="M5.5 13.5a2.5 2.5 0 11-2.5-2.5h2.5v2.5z" fill="#E01E5A"/><path d="M7 13.5a2.5 2.5 0 015 0v6.5a2.5 2.5 0 01-5 0v-6.5z" fill="#E01E5A"/><path d="M9.5 5.5a2.5 2.5 0 11-2.5-2.5v2.5h2.5z" fill="#36C5F0"/><path d="M9.5 7a2.5 2.5 0 010 5H3a2.5 2.5 0 010-5h6.5z" fill="#36C5F0"/><path d="M16.5 9.5a2.5 2.5 0 112.5 2.5h-2.5V9.5z" fill="#2EB67D"/><path d="M15 9.5a2.5 2.5 0 01-5 0V3a2.5 2.5 0 015 0v6.5z" fill="#2EB67D"/><path d="M12.5 17.5a2.5 2.5 0 112.5 2.5v-2.5h-2.5z" fill="#ECB22E"/><path d="M12.5 16a2.5 2.5 0 010-5H19a2.5 2.5 0 010 5h-6.5z" fill="#ECB22E"/></g></svg>`,
  whatsapp: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#25D366"/><path d="M20 8.5c-6.1 0-11 4.9-11 11 0 2 .5 3.9 1.5 5.6L8.5 31.5l6.5-1.9c1.6.9 3.4 1.4 5 1.4 6.1 0 11-4.9 11-11s-4.9-11-11-11z" fill="#fff"/><path d="M16.8 14.6c-.3-.6-.5-.6-.8-.6h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.1-1.2 2.7 0 1.6 1.2 3.1 1.3 3.4.2.3 2.3 3.6 5.5 5 2.7 1.1 3.3.9 3.9.8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4l-2-.9c-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.4.2-.6.1-.3-.1-1.4-.5-2.6-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4-.1-.6-.1-.2-.7-1.7-.9-2z" fill="#25D366"/></svg>`,
};

/* ══════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════ */
const SOLUTIONS: Solution[] = [
  {
    id: 'broker', title: 'For Customs Brokers',
    shortDesc: 'Automate HS classification, eliminate manual data entry, and generate ZK-proofs for tariff compliance.',
    icon: '🧑‍💼', tagline: 'Every declaration from first lookup to lodged MRN.',
    metrics: [{ v: '92%', l: 'Classification auto-accuracy' }, { v: '4×', l: 'Faster lodgement' }, { v: '0', l: 'Manual re-keys' }],
    modules: [
      { ico: '⚡', t: 'AI HS Classification', d: 'Scored suggestions from tariff + prior rulings, with one-click apply and full audit trail.' },
      { ico: '🛡️', t: 'ZK Compliance Proofs', d: 'Zero-knowledge proof that the declared code matches the tariff schedule — no data leakage.' },
      { ico: '📑', t: 'Declaration Studio', d: 'Full Form C1 workflow with line items, origin, duty, tax and supporting documents in one screen.' },
      { ico: '🔍', t: 'Ruling Library', d: 'Search BTIs and prior rulings against the goods you are about to lodge.' },
      { ico: '🎯', t: 'FTA Origin Checker', d: 'ATIGA, RCEP, MJEPA — checks RVC or CTH tests against the actual line items.' },
      { ico: '📡', t: 'Customs Gateway', d: 'Bi-directional with the customs system. MRNs land in your jobs automatically.' },
      { ico: '✦', t: 'Copilot for Brokers', d: 'One agent that classifies, flags compliance risk, prepares MyInvois payloads, and drafts replies.' },
    ],
    workflow: [
      { t: 'Receive pre-alert', d: 'Job arrives from the forwarder or importer, with documents and line hints.' },
      { t: 'Auto-classify', d: 'AI proposes HS codes; broker confirms or overrides. Every change is logged.' },
      { t: 'Validate compliance', d: 'Permits, standards, origin, FTA eligibility — resolved before lodgement.' },
      { t: 'Lodge declaration', d: 'Single click to the customs gateway; MRN is captured back into the job.' },
      { t: 'Handle queries', d: 'If customs queries, copilot drafts a defensible response using the same underlying data.' },
      { t: 'Archive & audit', d: 'Full audit trail retained for post-entry defence.' },
    ],
    case: { quote: 'We went from 12 minutes per declaration to under 3 — and our audit-defence file writes itself.', author: 'Mei L. · Licensed Customs Broker · Port Klang', initial: 'ML' },
    extra: 'Every lookup, override, and lodgement is stamped with a reason code, giving you a defensible audit trail without a separate project.',
  },
  {
    id: 'forwarder', title: 'For Freight Forwarders',
    shortDesc: 'Tokenize Bills of Lading (eBL), settle fees instantly via smart contracts, and provide real-time tracking.',
    icon: '🚛', tagline: 'Every job from booking to POD — one operational cockpit.',
    metrics: [{ v: '68%', l: 'Margin visibility lift' }, { v: '12m', l: 'Instant settlement' }, { v: '1', l: 'eBL · MLETR compliant' }],
    modules: [
      { ico: '📋', t: 'Job Workspace', d: 'Bookings, parties, routing, containers, milestones — the operational home base for every shipment.' },
      { ico: '🔗', t: 'eBL Tokenization', d: 'MLETR-compliant electronic Bills of Lading, negotiable via smart contract.' },
      { ico: '💸', t: 'Smart-contract Settlement', d: 'Freight, THC, brokerage — settle instantly across entities, no wire delays.' },
      { ico: '📍', t: 'Real-time Tracking', d: 'Multi-carrier ETA, milestones, exception alerts — surfaced in the job.' },
      { ico: '💰', t: 'Buy / Sell Charges', d: 'Multi-currency charges with live gross-profit and margin per job.' },
      { ico: '📄', t: 'Document Library', d: 'Booking, SI, VGM, invoice, packing list, B/L, COO, arrival notice, DO — all in one place.' },
      { ico: '🌿', t: 'Carbon Tracking', d: 'GLEC-aligned well-to-wake emissions, shadow carbon pricing, CBAM exposure.' },
      { ico: '✦', t: 'Copilot for Forwarders', d: 'Auto-classifies, validates lodging, drafts customer updates, and prepares e-invoice payloads.' },
    ],
    workflow: [
      { t: 'Booking', d: 'Carrier booking captured, confirmation sent, shipper/consignee recorded.' },
      { t: 'Documentation', d: 'SI, VGM, invoice, packing list, COO — collected and validated against each other.' },
      { t: 'Origin clearance', d: 'Export declaration at origin filed, gate pass captured, container loaded.' },
      { t: 'In transit', d: 'eBL tokenized, milestones streamed, ETA risk scored, carbon measured.' },
      { t: 'Import clearance', d: 'Broker receives a live copy of the same data — no re-keys, no gaps.' },
      { t: 'Delivery & billing', d: 'POD collected, invoice issued, charges settled via smart contract.' },
    ],
    case: { quote: 'We went live in three weeks. The broker on the other side was already on TradeOps — nothing to integrate.', author: 'Daniel T. · Ops Director · Regional Freight Co.', initial: 'DT' },
    extra: 'Every charge, milestone and document is timestamped and versioned — so dispute resolution becomes a query, not a phone call.',
  },
  {
    id: 'manufacturer', title: 'For Manufacturers',
    shortDesc: 'Track bonded inventory effortlessly, forecast raw material demand with AI, and finance via RWA tokenization.',
    icon: '🏭', tagline: 'Every batch from bonded intake to RWA-backed liquidity.',
    metrics: [{ v: '99.4%', l: 'Production uptime' }, { v: '$4.5M', l: 'Collateral unlocked' }, { v: '32d', l: 'Cash cycle reduction' }],
    modules: [
      { ico: '📦', t: 'Bonded Ledger (FIZ)', d: 'Duty-suspended inventory tracked at SKU level, with AI deductions as materials enter the line.' },
      { ico: '📈', t: 'Predictive Demand', d: '14-day forecast per SKU, shortage-day alerts, one-click reorder to suppliers.' },
      { ico: '💰', t: 'RWA Financing', d: 'Tokenize finished goods, access DeFi liquidity, monitor LTV and APY in one view.' },
      { ico: '🌿', t: 'CBAM & Emissions', d: 'Embedded intensity per CN code, verifier-ready declarations, EU registry filing.' },
      { ico: '🏭', t: 'Production Order', d: 'Demand → BOM → allocation → run → QA → COGS, all in one lifecycle.' },
      { ico: '🤝', t: 'Supplier Onboarding', d: 'KYC, sanctions, contract, first PO, quarterly scorecards — inside the platform.' },
      { ico: '✦', t: 'Copilot for Manufacturers', d: 'Deducts on production, flags shortage days, drafts CBAM declarations, and proposes tokenization.' },
    ],
    workflow: [
      { t: 'Bonded intake', d: 'Pre-alert, gate-in, bond entry, put-away to FIZ, ledger updated.' },
      { t: 'Issue to production', d: 'Issue slip triggers AI deduction from the bonded ledger — duty stays suspended.' },
      { t: 'Production & QA', d: 'Yield tracking, WIP ledger, release certificate — one continuous chain.' },
      { t: 'Finished goods receipt', d: 'GRN, valuation, insurance — the goods become RWA-eligible collateral.' },
      { t: 'Tokenization', d: 'SPV created, smart contract deployed, tokens minted, collateral escrowed.' },
      { t: 'Servicing & repayment', d: 'LTV maintained, interest calculated, tokens burned at repayment.' },
    ],
    case: { quote: 'We used to finance production from working capital. Now the warehouse itself does the financing.', author: 'Aisyah R. · CFO · Consumer Electronics Manufacturer', initial: 'AR' },
    extra: 'Because bonded inventory, production orders, and RWA facilities all reference the same SKU master, the ledger reconciles itself.',
  },
];

const COMPARISON: ComparisonRow[] = [
  { cap: 'AI HS classification', broker: 'yes', forwarder: 'partial', manufacturer: 'partial' },
  { cap: 'Customs declaration lodge', broker: 'yes', forwarder: 'yes', manufacturer: 'no' },
  { cap: 'Bonded inventory (FIZ)', broker: 'no', forwarder: 'no', manufacturer: 'yes' },
  { cap: 'eBL tokenization', broker: 'no', forwarder: 'yes', manufacturer: 'no' },
  { cap: 'Job / shipment workspace', broker: 'yes', forwarder: 'yes', manufacturer: 'partial' },
  { cap: 'Predictive demand forecast', broker: 'no', forwarder: 'no', manufacturer: 'yes' },
  { cap: 'RWA financing', broker: 'no', forwarder: 'partial', manufacturer: 'yes' },
  { cap: 'CBAM emissions reporting', broker: 'partial', forwarder: 'yes', manufacturer: 'yes' },
  { cap: 'e-Invoice (MyInvois)', broker: 'yes', forwarder: 'yes', manufacturer: 'yes' },
  { cap: 'Multi-currency buy/sell', broker: 'no', forwarder: 'yes', manufacturer: 'partial' },
  { cap: 'AI copilot', broker: 'yes', forwarder: 'yes', manufacturer: 'yes' },
  { cap: 'Full audit trail', broker: 'yes', forwarder: 'yes', manufacturer: 'yes' },
];

const INTEGRATIONS: Integration[] = [
  { id: 'sap', cat: 'erp', name: 'SAP S/4HANA', status: 'live', direction: '↔',
    desc: 'Bi-directional sync of purchase orders, inventory, cost centres, and GL postings.',
    long: 'Native SAP S/4HANA connector using OData v4 and BAPIs. Sync POs, goods receipts, material master, GL postings, and cost-centre allocations in near real time, with idempotent message handling and full reconciliation reports.',
    capabilities: ['Purchase orders & goods receipts', 'Material master sync', 'GL postings to FI/CO', 'Cost centre mapping', 'Idempotent message handling'],
    setup: '2–3 weeks', auth: 'OAuth 2.0 · SAP Cloud Connector', entities: ['Brokers', 'Forwarders', 'Manufacturers'], endpoint: 'POST /api/v1/integrations/sap/pos' },
  { id: 'netsuite', cat: 'erp', name: 'Oracle NetSuite', status: 'live', direction: '↔',
    desc: 'Sync sales orders, invoices, inventory, and vendor bills with NetSuite.',
    long: 'RESTlet + SuiteScript connector for NetSuite. Push sales orders, invoices, and vendor bills; pull inventory balances, item master, and customer records. Handles multi-subsidiary and multi-currency mapping.',
    capabilities: ['Sales orders & invoices', 'Vendor bills', 'Inventory balances', 'Item & customer master', 'Multi-subsidiary mapping'],
    setup: '1–2 weeks', auth: 'OAuth 2.0 · Token-based (TBA)', entities: ['Brokers', 'Forwarders', 'Manufacturers'], endpoint: 'POST /api/v1/integrations/netsuite/orders' },
  { id: 'dynamics', cat: 'erp', name: 'Microsoft Dynamics 365', status: 'live', direction: '↔',
    desc: 'Finance & Operations connector for POs, ledgers, and project accounting.',
    long: 'Dataverse + OData v4 connector for Dynamics 365 Finance & Operations. Syncs POs, ledger entries, project accounting, and vendor master, with field-level mapping and event-driven triggers.',
    capabilities: ['Purchase orders', 'Ledger & journal entries', 'Project accounting', 'Vendor master', 'Event-driven triggers'],
    setup: '2 weeks', auth: 'OAuth 2.0 · Azure AD', entities: ['Brokers', 'Forwarders', 'Manufacturers'], endpoint: 'POST /api/v1/integrations/dynamics/entries' },
  { id: 'odoo', cat: 'erp', name: 'Odoo', status: 'beta', direction: '↔',
    desc: 'Lightweight ERP connector for SME manufacturers and forwarders.',
    long: 'Odoo XML-RPC connector for community and enterprise editions. Syncs sale orders, purchase orders, stock moves, and invoices with automatic field discovery.',
    capabilities: ['Sale orders', 'Purchase orders', 'Stock moves', 'Invoices', 'Field auto-discovery'],
    setup: '3–5 days', auth: 'API key', entities: ['Forwarders', 'Manufacturers'], endpoint: 'POST /api/v1/integrations/odoo/orders' },
  { id: 'quickbooks', cat: 'accounting', name: 'QuickBooks', status: 'live', direction: '↔',
    desc: 'Invoice, bill, and payment sync with automatic chart-of-accounts mapping.',
    long: 'QuickBooks Online connector with automatic chart-of-accounts mapping. Push invoices, bills, and payments; pull customer, vendor, and account lists. Supports multi-entity accounting.',
    capabilities: ['Invoices & bills', 'Payment sync', 'Chart-of-accounts mapping', 'Customer & vendor sync', 'Multi-entity accounting'],
    setup: '3–5 days', auth: 'OAuth 2.0', entities: ['Brokers', 'Forwarders', 'Manufacturers'], endpoint: 'POST /api/v1/integrations/quickbooks/invoices' },
  { id: 'xero', cat: 'accounting', name: 'Xero', status: 'live', direction: '↔',
    desc: 'Contacts, invoices, bills, and bank feeds for modern trade businesses.',
    long: 'Xero connector for contacts, invoices, bills, and bank reconciliation feeds. Tax code mapping for SST/GST/VAT is included out of the box.',
    capabilities: ['Contacts sync', 'Invoices & bills', 'Bank feed reconciliation', 'Tax code mapping (SST/GST/VAT)', 'Multi-currency invoices'],
    setup: '3–5 days', auth: 'OAuth 2.0', entities: ['Brokers', 'Forwarders', 'Manufacturers'], endpoint: 'POST /api/v1/integrations/xero/invoices' },
  { id: 'zoho', cat: 'accounting', name: 'Zoho Books', status: 'beta', direction: '↔',
    desc: 'Invoices, expenses, and contact sync for regional SMBs.',
    long: 'Zoho Books connector covering invoices, expenses, contacts, and payment reminders. Optimised for APAC regional deployments.',
    capabilities: ['Invoices', 'Expenses', 'Contacts', 'Payment reminders', 'Regional tax support'],
    setup: '3–5 days', auth: 'OAuth 2.0', entities: ['Brokers', 'Forwarders'], endpoint: 'POST /api/v1/integrations/zoho/invoices' },
  { id: 'maersk', cat: 'carrier', name: 'Maersk', status: 'live', direction: '↔',
    desc: 'Booking, eBL, tracking, and DCSA-compliant EDI integration.',
    long: 'Maersk partner API + DCSA EDI for bookings, bills of lading, container events, and vessel schedules. Real-time milestones flow straight into job workspaces.',
    capabilities: ['Booking creation', 'DCSA eBL exchange', 'Container event tracking', 'Vessel schedules', 'Exception alerts'],
    setup: '1–2 weeks', auth: 'OAuth 2.0 · DCSA', entities: ['Forwarders', 'Brokers'], endpoint: 'POST /api/v1/integrations/maersk/bookings' },
  { id: 'msc', cat: 'carrier', name: 'MSC', status: 'live', direction: '↔',
    desc: 'Booking, tracking, and eBL via MSC partner API.',
    long: 'MSC partner API for bookings, container tracking, and electronic bills of lading. Supports DCSA standards for document exchange.',
    capabilities: ['Booking', 'Container tracking', 'DCSA eBL', 'Vessel schedules', 'Document exchange'],
    setup: '1–2 weeks', auth: 'OAuth 2.0 · DCSA', entities: ['Forwarders', 'Brokers'], endpoint: 'POST /api/v1/integrations/msc/bookings' },
  { id: 'cmacgm', cat: 'carrier', name: 'CMA CGM', status: 'beta', direction: '↔',
    desc: 'Booking and tracking for CMA CGM group carriers.',
    long: 'CMA CGM connector for bookings, tracking, and vessel schedules. Covers ANL, APL and CNC brands under the group.',
    capabilities: ['Booking', 'Container tracking', 'Vessel schedules', 'Multi-brand coverage', 'Exception alerts'],
    setup: '1–2 weeks', auth: 'API key', entities: ['Forwarders'], endpoint: 'POST /api/v1/integrations/cmacgm/bookings' },
  { id: 'dhl', cat: 'carrier', name: 'DHL', status: 'live', direction: '↔',
    desc: 'Air freight booking, tracking, and rate quotes via DHL API.',
    long: 'DHL Global Forwarding connector for air bookings, tracking, and rate quotes. Shipment events flow into jobs in real time.',
    capabilities: ['Air bookings', 'Tracking events', 'Rate quotes', 'Shipment milestones', 'Exception alerts'],
    setup: '1 week', auth: 'API key', entities: ['Forwarders'], endpoint: 'POST /api/v1/integrations/dhl/shipments' },
  { id: 'fedex', cat: 'carrier', name: 'FedEx', status: 'live', direction: '↔',
    desc: 'Shipping, rating, and tracking for FedEx Express & Ground.',
    long: 'FedEx connector for shipping labels, rating, and real-time tracking across Express and Ground services.',
    capabilities: ['Shipping labels', 'Rate quotes', 'Real-time tracking', 'Exception alerts', 'Signature capture'],
    setup: '3–5 days', auth: 'OAuth 2.0', entities: ['Forwarders', 'Brokers'], endpoint: 'POST /api/v1/integrations/fedex/shipments' },
  { id: 'ups', cat: 'carrier', name: 'UPS', status: 'live', direction: '↔',
    desc: 'Shipping, rating, and tracking for UPS services.',
    long: 'UPS connector for shipping, rating, and tracking. Includes signature capture and delivery confirmation.',
    capabilities: ['Shipping', 'Rate quotes', 'Tracking', 'Signature capture', 'Delivery confirmation'],
    setup: '3–5 days', auth: 'OAuth 2.0', entities: ['Forwarders'], endpoint: 'POST /api/v1/integrations/ups/shipments' },
  { id: 'ucustoms', cat: 'customs', name: 'Malaysia uCustoms', status: 'live', direction: '↔',
    desc: 'Declaration filing, MRN capture, and status polling for Malaysian customs.',
    long: 'Direct uCustoms gateway integration for the Malaysian Directorate General of Customs. Lodges declarations, captures MRNs, and polls status. Supports Form C1, C2, and ZB1.',
    capabilities: ['Declaration lodging', 'MRN capture', 'Status polling', 'Duty computation', 'Form C1/C2/ZB1'],
    setup: '2–3 weeks (licensing)', auth: 'mTLS · User credentials', entities: ['Brokers', 'Forwarders'], endpoint: 'POST /api/v1/integrations/ucustoms/declarations' },
  { id: 'tradenet', cat: 'customs', name: 'Singapore TradeNet', status: 'live', direction: '↔',
    desc: 'Singapore Customs TradeNet declaration and permit sync.',
    long: 'Singapore Customs TradeNet connector for declarations, permits, and duty/GST computation. Supports inbound and outbound cargo.',
    capabilities: ['Declaration filing', 'Permit sync', 'Duty & GST computation', 'Status alerts', 'Bond management'],
    setup: '2 weeks (licensing)', auth: 'mTLS · CrimsonLogic', entities: ['Brokers', 'Forwarders'], endpoint: 'POST /api/v1/integrations/tradenet/declarations' },
  { id: 'cbam', cat: 'customs', name: 'EU CBAM Registry', status: 'live', direction: '→',
    desc: 'CBAM declaration filing with embedded-emissions XML export.',
    long: 'EU CBAM transitional and definitive registry connector. Generates CBAM declaration XML from embedded-emissions data, files via the EU portal, and tracks acceptance.',
    capabilities: ['Declaration XML', 'Emissions data export', 'EU portal filing', 'Acceptance tracking', 'Verifier reports'],
    setup: '2 weeks', auth: 'EU Login · mTLS', entities: ['Manufacturers', 'Forwarders'], endpoint: 'POST /api/v1/integrations/cbam/declarations' },
  { id: 'ace', cat: 'customs', name: 'US CBP ACE', status: 'beta', direction: '↔',
    desc: 'ACE filing via ABI/ACE for US-bound imports and exports.',
    long: 'US Customs ACE connector via ABI. Files entry summaries, ISF, and export declarations.',
    capabilities: ['Entry summaries', 'ISF filing', 'Export declarations', 'Status polling', 'Duty computation'],
    setup: '3–4 weeks', auth: 'ABI · ACE portal', entities: ['Brokers', 'Forwarders'], endpoint: 'POST /api/v1/integrations/ace/entries' },
  { id: 'defi', cat: 'banking', name: 'DeFi Liquidity Pools', status: 'live', direction: '↔',
    desc: 'Tokenized RWA liquidity via on-chain lender pools.',
    long: 'Multi-protocol DeFi liquidity pool connector. Publishes RWA token offerings, accepts bids, executes smart-contract draws, and services repayment across Aave, Maple, and Centrifuge pools.',
    capabilities: ['Token offering publishing', 'Bid matching', 'Smart-contract draws', 'Interest accrual', 'Collateral release'],
    setup: '3–4 weeks', auth: 'Wallet · Smart contract', entities: ['Manufacturers', 'Forwarders'], endpoint: 'POST /api/v1/integrations/defi/offerings' },
  { id: 'stablecoin', cat: 'banking', name: 'USDC Settlement Rails', status: 'live', direction: '↔',
    desc: 'Stablecoin settlement for freight and duty charges.',
    long: 'USDC settlement rails on Ethereum, Solana, and Base. Trigger P2P settlement for freight and duty charges with instant finality and on-chain reconciliation.',
    capabilities: ['USDC settlement', 'Instant finality', 'On-chain reconciliation', 'Multi-chain support', 'Refund reversal'],
    setup: '1–2 weeks', auth: 'Wallet · API key', entities: ['Forwarders', 'Manufacturers'], endpoint: 'POST /api/v1/integrations/usdc/settlements' },
  { id: 'maybank', cat: 'banking', name: 'Maybank Trade Finance', status: 'beta', direction: '↔',
    desc: 'LC issuance, bank guarantees, and trade finance facilities.',
    long: 'Maybank trade finance connector for LC issuance, bank guarantees, and supply-chain finance facilities. Supports both conventional and Islamic trade finance.',
    capabilities: ['LC issuance', 'Bank guarantees', 'Supply-chain finance', 'Islamic finance support', 'Document checking'],
    setup: '4–6 weeks', auth: 'OAuth 2.0 · SWIFT', entities: ['Forwarders', 'Manufacturers'], endpoint: 'POST /api/v1/integrations/maybank/lc' },
  { id: 'shopify', cat: 'ecommerce', name: 'Shopify', status: 'live', direction: '↔',
    desc: 'Order, fulfilment, and tracking sync for DTC brands.',
    long: 'Shopify connector for orders, fulfilments, and tracking. Goods flow from checkout to customs declaration without manual handling.',
    capabilities: ['Order sync', 'Fulfilment sync', 'Tracking push', 'Product master', 'Multi-store support'],
    setup: '3–5 days', auth: 'OAuth 2.0', entities: ['Forwarders', 'Brokers'], endpoint: 'POST /api/v1/integrations/shopify/orders' },
  { id: 'amazon', cat: 'ecommerce', name: 'Amazon Seller Central', status: 'beta', direction: '↔',
    desc: 'FBA and FBM order sync with Amazon SP-API.',
    long: 'Amazon Selling Partner API connector for FBA and FBM orders, inbound shipments, and tracking. Optimised for cross-border e-commerce.',
    capabilities: ['Order sync', 'Inbound shipments', 'Tracking push', 'FBA replenishment', 'Cross-border handling'],
    setup: '1 week', auth: 'OAuth 2.0 · LWA', entities: ['Forwarders', 'Brokers'], endpoint: 'POST /api/v1/integrations/amazon/orders' },
  { id: 'alibaba', cat: 'ecommerce', name: 'Alibaba.com', status: 'beta', direction: '↔',
    desc: 'RFQ, order, and logistics sync for cross-border trade.',
    long: 'Alibaba.com connector for RFQs, orders, and trade assurance. Brings B2B sourcing flows straight into the bonded ledger.',
    capabilities: ['RFQ sync', 'Order sync', 'Trade assurance', 'Logistics integration', 'Supplier verification'],
    setup: '1–2 weeks', auth: 'OAuth 2.0', entities: ['Manufacturers', 'Forwarders'], endpoint: 'POST /api/v1/integrations/alibaba/orders' },
  { id: 'docusign', cat: 'docs', name: 'DocuSign', status: 'live', direction: '→',
    desc: 'eSignature for commercial invoices, POAs, and contracts.',
    long: 'DocuSign connector for sending and tracking signatures on invoices, POAs, contracts, and trade documents. Signed PDFs return to the document library automatically.',
    capabilities: ['Send for signature', 'Signature status tracking', 'Signed PDF return', 'Templates', 'Bulk sending'],
    setup: '2–3 days', auth: 'OAuth 2.0', entities: ['Brokers', 'Forwarders', 'Manufacturers'], endpoint: 'POST /api/v1/integrations/docusign/envelopes' },
  { id: 'adobe', cat: 'docs', name: 'Adobe Acrobat Sign', status: 'live', direction: '→',
    desc: 'Alternative eSignature provider for enterprise workflows.',
    long: 'Adobe Acrobat Sign connector for enterprise workflows, with form-field mapping and audit trails.',
    capabilities: ['Send for signature', 'Form-field mapping', 'Audit trail', 'Templates', 'Bulk sending'],
    setup: '2–3 days', auth: 'OAuth 2.0', entities: ['Brokers', 'Forwarders', 'Manufacturers'], endpoint: 'POST /api/v1/integrations/adobe/envelopes' },
  { id: 'slack', cat: 'docs', name: 'Slack', status: 'live', direction: '→',
    desc: 'Push job events and copilot alerts to Slack channels.',
    long: 'Slack integration for job event notifications, copilot alerts, and approval workflows. Map events to channels by entity, customer, or job type.',
    capabilities: ['Event notifications', 'Copilot alerts', 'Approval workflows', 'Channel routing', 'Thread replies'],
    setup: '1 day', auth: 'OAuth 2.0 · Webhooks', entities: ['Brokers', 'Forwarders', 'Manufacturers'], endpoint: 'POST /api/v1/integrations/slack/messages' },
  { id: 'whatsapp', cat: 'docs', name: 'WhatsApp Business', status: 'live', direction: '→',
    desc: 'Customer updates and document delivery via WhatsApp Business.',
    long: 'WhatsApp Business API connector for customer updates, document delivery, and confirmation requests. Supports template messages and media attachments.',
    capabilities: ['Customer updates', 'Document delivery', 'Confirmation requests', 'Template messages', 'Media attachments'],
    setup: '1–2 days', auth: 'OAuth 2.0 · Meta Business', entities: ['Forwarders', 'Brokers'], endpoint: 'POST /api/v1/integrations/whatsapp/messages' },
];

const INT_CATEGORIES: IntegrationCategory[] = [
  { id: 'all', label: 'All' },
  { id: 'erp', label: 'ERP' },
  { id: 'accounting', label: 'Accounting' },
  { id: 'carrier', label: 'Carrier' },
  { id: 'customs', label: 'Customs' },
  { id: 'banking', label: 'Banking & DeFi' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'docs', label: 'Docs & Comms' },
];

const TICKER_EVENTS = [
  { src: 'SAP S/4HANA', msg: 'PO-2026-88213 created · 3 lines', cls: 'tt-ok' },
  { src: 'Maersk', msg: 'Container MSKU4471823 · gate-in at CNSHA', cls: '' },
  { src: 'uCustoms', msg: 'MRN-2026-44718231 accepted', cls: 'tt-ok' },
  { src: 'QuickBooks', msg: 'Invoice INV-4471 posted · MYR 12,400.00', cls: '' },
  { src: 'DeFi Pool', msg: 'Collateral check passed · LTV 62% (threshold 65%)', cls: 'tt-warn' },
  { src: 'Shopify', msg: 'Order #SH-8841 received · 2 items', cls: '' },
  { src: 'NetSuite', msg: 'Vendor bill VB-2291 synced', cls: 'tt-ok' },
  { src: 'WhatsApp Business', msg: 'Document INV-4471.pdf delivered', cls: '' },
  { src: 'DHL', msg: 'AWB 618-12345678 · departed LEJ hub', cls: '' },
  { src: 'Xero', msg: 'Bank feed reconciled · 14 transactions', cls: 'tt-ok' },
  { src: 'EU CBAM Registry', msg: 'Q4 declaration accepted · 92 tCO₂e', cls: 'tt-ok' },
  { src: 'Slack', msg: 'Job JOB-2026-004418 lodged → #ops', cls: '' },
  { src: 'Dynamics 365', msg: 'Project accounting updated · 2 entries', cls: '' },
  { src: 'FedEx', msg: 'Delivery exception — addressed', cls: 'tt-warn' },
  { src: 'DocuSign', msg: 'Envelope ENV-4471 signed by buyer', cls: 'tt-ok' },
];

/* ══════════════════════════════════════════════════════════
   CSS (inlined — move to a .css file if you prefer)
   ══════════════════════════════════════════════════════════ */
const CSS = `
  :root{
    --bg:#050505; --panel:#0A0A0A; --panel-2:#08080a;
    --line:rgba(255,255,255,.06); --line-2:rgba(255,255,255,.12);
    --text:#e6edf7; --muted:#8a94a6; --muted-2:#5c6474;
    --blue:#60a5fa; --blue-2:#93c5fd;
    --emerald:#34d399; --emerald-2:#6ee7b7;
    --purple:#a855f7; --purple-2:#c084fc;
    --cyan:#22d3ee; --cyan-2:#67e8f9;
    --amber:#f59e0b; --amber-2:#fcd34d;
    --rose:#f43f5e; --rose-2:#fda4af;
    --slate:#94a3b8;
    --radius:16px;
    font-synthesis:none;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:var(--bg);color:var(--text);
    font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    font-size:14px;line-height:1.55;-webkit-font-smoothing:antialiased}
  a{color:inherit;text-decoration:none}
  button{font-family:inherit;font-size:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
  :focus-visible{outline:2px solid var(--purple);outline-offset:2px;border-radius:6px}
  .atmos{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
  .atmos .dotgrid{position:absolute;inset:0;opacity:.28;
    background-image:radial-gradient(circle at 1px 1px, rgba(168,85,247,.12) 1px, transparent 0);
    background-size:28px 28px;
    -webkit-mask-image:radial-gradient(ellipse at center, black 25%, transparent 75%);
    mask-image:radial-gradient(ellipse at center, black 25%, transparent 75%)}
  .atmos .blob{position:absolute;border-radius:50%;filter:blur(150px)}
  .atmos .b1{top:-200px;left:15%;width:700px;height:500px;background:rgba(96,165,250,.16)}
  .atmos .b2{top:15%;right:-120px;width:600px;height:600px;background:rgba(52,211,153,.10)}
  .atmos .b3{bottom:-150px;left:-100px;width:600px;height:600px;background:rgba(168,85,247,.12)}
  .page{position:relative;z-index:1}
  .topbar{max-width:1180px;margin:0 auto;padding:20px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px}
  .brand{display:flex;align-items:center;gap:10px}
  .brand-mark{width:28px;height:28px;border-radius:8px;
    background:linear-gradient(135deg,var(--blue),var(--purple));color:#04121f;
    display:grid;place-items:center;font-weight:900;font-size:13px}
  .brand-name{font-size:13px;font-weight:700;letter-spacing:-.1px;line-height:1.15}
  .brand-name small{display:block;font-size:9.5px;font-weight:400;letter-spacing:.14em;
    text-transform:uppercase;color:var(--muted-2);margin-top:2px}
  .nav{display:none;align-items:center;gap:26px;font-size:12px;color:var(--muted)}
  @media(min-width:900px){.nav{display:flex}}
  .nav a{transition:color .15s}
  .nav a:hover{color:var(--text)}
  .header-actions{display:flex;align-items:center;gap:8px}
  .signin{font-size:12px;color:var(--muted);padding:8px 12px;border-radius:8px;transition:.15s;display:none}
  @media(min-width:640px){.signin{display:inline-block}}
  .signin:hover{color:var(--text)}
  .btn-ghost-sm{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 14px;
    border-radius:999px;background:#fff;color:#050505;font-size:12px;font-weight:700;transition:.15s}
  .btn-ghost-sm:hover{background:#e2e8f0}
  .hero{max-width:1100px;margin:0 auto;padding:32px 20px 72px;text-align:center}
  .badge{display:inline-flex;align-items:center;gap:8px;padding:4px 12px;border-radius:999px;
    background:rgba(96,165,250,.08);border:1px solid rgba(96,165,250,.22);
    color:#93c5fd;font-size:11.5px;margin-bottom:24px}
  .badge .divider{width:1px;height:12px;background:rgba(96,165,250,.30)}
  .badge .live{display:flex;align-items:center;gap:6px;color:#6ee7b7}
  .pulse{position:relative;width:6px;height:6px}
  .pulse::before,.pulse::after{content:"";position:absolute;inset:0;border-radius:50%;background:#34d399}
  .pulse::before{animation:ping 1.6s cubic-bezier(0,0,.2,1) infinite;opacity:.75}
  @keyframes ping{0%{transform:scale(1);opacity:.75}75%,100%{transform:scale(2.5);opacity:0}}
  .h1{font-size:clamp(36px,6.5vw,76px);line-height:1;letter-spacing:-.035em;font-weight:900;margin:0 0 24px}
  .h1 .grad{background:linear-gradient(90deg,var(--blue-2),var(--purple-2),var(--emerald-2));
    -webkit-background-clip:text;background-clip:text;color:transparent}
  .lede{font-size:clamp(15px,1.6vw,19px);color:var(--muted);max-width:640px;
    margin:0 auto 40px;line-height:1.6;font-weight:300}
  .hero-stats{display:flex;justify-content:center;gap:32px;flex-wrap:wrap;margin-bottom:56px}
  .hero-stat{text-align:center;min-width:100px}
  .hero-stat .v{font-size:26px;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums;
    background:linear-gradient(90deg,var(--blue-2),var(--purple-2));
    -webkit-background-clip:text;background-clip:text;color:transparent}
  .hero-stat .l{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted-2);font-weight:700;margin-top:2px}
  .solutions{max-width:1180px;margin:0 auto;padding:0 20px 100px}
  .solutions-grid{display:grid;grid-template-columns:1fr;gap:20px}
  @media(min-width:640px){.solutions-grid{grid-template-columns:repeat(2,1fr)}}
  @media(min-width:1024px){.solutions-grid{grid-template-columns:repeat(3,1fr);gap:24px}}
  .sol-card{position:relative;border-radius:24px;background:var(--panel);border:1px solid var(--line);
    padding:28px;text-align:left;transition:.25s;display:flex;flex-direction:column;overflow:hidden}
  .sol-card::before{content:"";position:absolute;inset:0;opacity:0;transition:opacity .25s;
    background:radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.06), transparent 40%);
    pointer-events:none}
  .sol-card:hover{transform:translateY(-6px);border-color:var(--line-2)}
  .sol-card:hover::before{opacity:1}
  .sol-card.broker:hover{border-color:rgba(96,165,250,.35)}
  .sol-card.forwarder:hover{border-color:rgba(52,211,153,.35)}
  .sol-card.manufacturer:hover{border-color:rgba(168,85,247,.35)}
  .sol-icon{width:56px;height:56px;border-radius:16px;display:grid;place-items:center;
    font-size:24px;margin-bottom:20px;transition:transform .25s}
  .sol-card:hover .sol-icon{transform:scale(1.08) rotate(-4deg)}
  .sol-icon.broker{background:rgba(96,165,250,.10);color:var(--blue-2)}
  .sol-icon.forwarder{background:rgba(52,211,153,.10);color:var(--emerald-2)}
  .sol-icon.manufacturer{background:rgba(168,85,247,.10);color:var(--purple-2)}
  .sol-title{font-size:22px;font-weight:800;letter-spacing:-.02em;margin:0 0 10px;line-height:1.2}
  .sol-desc{font-size:13.5px;color:var(--muted);line-height:1.6;margin:0 0 20px;flex:1}
  .sol-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px}
  .sol-chip{font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;
    background:rgba(255,255,255,.04);border:1px solid var(--line);color:var(--muted)}
  .sol-cta{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:var(--text);transition:.15s}
  .sol-cta .arrow{transition:transform .2s;font-size:14px}
  .sol-card:hover .sol-cta .arrow{transform:translateX(6px)}
  .sol-metrics{display:flex;gap:14px;margin-top:16px;padding-top:16px;border-top:1px solid var(--line)}
  .sol-metric{flex:1;min-width:0}
  .sol-metric .v{font-size:16px;font-weight:800;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
  .sol-metric.broker .v{color:var(--blue-2)}
  .sol-metric.forwarder .v{color:var(--emerald-2)}
  .sol-metric.manufacturer .v{color:var(--purple-2)}
  .sol-metric .l{font-size:9.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted-2);font-weight:700;margin-top:2px}
  .modal{position:fixed;inset:0;background:rgba(5,10,20,.72);
    -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);z-index:100;
    display:flex;align-items:flex-start;justify-content:center;padding:5vh 16px;overflow-y:auto}
  .modal-shell{width:min(1080px,100%);background:var(--panel-2);border:1px solid var(--line);
    border-radius:24px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6);animation:pop .2s ease}
  @keyframes pop{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}
  .modal-head{display:flex;align-items:flex-start;gap:16px;padding:24px 28px;
    border-bottom:1px solid var(--line);position:sticky;top:0;
    background:rgba(8,8,10,.96);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);z-index:5}
  .modal-icon{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;font-size:20px;flex:0 0 48px}
  .modal-head-body{flex:1;min-width:0}
  .modal-eyebrow{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:var(--muted-2);font-weight:800;margin-bottom:4px}
  .modal-title{font-size:22px;font-weight:800;letter-spacing:-.02em;margin:0;line-height:1.2}
  .modal-sub{font-size:12.5px;color:var(--muted);margin-top:4px;line-height:1.5;max-width:640px}
  .modal-close{width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.04);
    border:1px solid var(--line);color:var(--muted);font-size:14px;display:grid;place-items:center;
    flex-shrink:0;transition:.15s}
  .modal-close:hover{background:rgba(255,255,255,.10);color:var(--text)}
  .modal-body{padding:24px 28px 32px}
  .modal-grid{display:grid;grid-template-columns:1fr;gap:24px}
  @media(min-width:900px){.modal-grid{grid-template-columns:1fr 1fr;gap:32px}}
  .modal-section-title{font-size:11px;text-transform:uppercase;letter-spacing:.12em;
    color:var(--muted-2);font-weight:800;margin:0 0 12px}
  .modal-metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:22px}
  @media(min-width:640px){.modal-metrics{grid-template-columns:repeat(4,1fr)}}
  .mm{border-radius:12px;background:rgba(255,255,255,.02);border:1px solid var(--line);padding:12px 14px}
  .mm .v{font-size:20px;font-weight:800;letter-spacing:-.01em;font-variant-numeric:tabular-nums;line-height:1.1}
  .mm .l{font-size:9.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted-2);font-weight:700;margin-top:4px}
  .mm.broker .v{color:var(--blue-2)}
  .mm.forwarder .v{color:var(--emerald-2)}
  .mm.manufacturer .v{color:var(--purple-2)}
  .modules{display:flex;flex-direction:column;gap:8px}
  .module{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border-radius:12px;
    background:rgba(255,255,255,.02);border:1px solid var(--line);transition:.15s}
  .module:hover{background:rgba(255,255,255,.04);border-color:var(--line-2)}
  .module-ico{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;flex:0 0 30px;font-size:14px}
  .module.broker .module-ico{background:rgba(96,165,250,.10);color:var(--blue-2)}
  .module.forwarder .module-ico{background:rgba(52,211,153,.10);color:var(--emerald-2)}
  .module.manufacturer .module-ico{background:rgba(168,85,247,.10);color:var(--purple-2)}
  .module-body{flex:1;min-width:0}
  .module-title{font-size:12.5px;font-weight:700;margin-bottom:2px;line-height:1.3}
  .module-desc{font-size:11px;color:var(--muted);line-height:1.5}
  .workflow-list{display:flex;flex-direction:column;gap:0}
  .wf-step{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);position:relative}
  .wf-step:last-child{border-bottom:0}
  .wf-step-num{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;
    flex:0 0 22px;font-size:10.5px;font-weight:800;background:rgba(255,255,255,.05);color:var(--muted);margin-top:1px;
    font-family:ui-monospace,Menlo,monospace}
  .wf-step-body{flex:1;min-width:0}
  .wf-step-title{font-size:12px;font-weight:700;line-height:1.3}
  .wf-step-desc{font-size:10.5px;color:var(--muted-2);margin-top:1px;line-height:1.4}
  .case-study{background:rgba(255,255,255,.02);border:1px solid var(--line);border-radius:14px;padding:16px;margin-top:20px}
  .case-study .quote{font-size:12.5px;line-height:1.6;color:#cbd5e1;font-style:italic;margin:0 0 12px}
  .case-study .author{font-size:11px;color:var(--muted-2);display:flex;align-items:center;gap:8px}
  .case-study .avatar{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;
    font-size:10px;font-weight:800;flex:0 0 24px}
  .case-study.broker .avatar{background:rgba(96,165,250,.2);color:var(--blue-2)}
  .case-study.forwarder .avatar{background:rgba(52,211,153,.2);color:var(--emerald-2)}
  .case-study.manufacturer .avatar{background:rgba(168,85,247,.2);color:var(--purple-2)}
  .modal-actions{display:flex;gap:10px;margin-top:24px;padding-top:20px;border-top:1px solid var(--line);flex-wrap:wrap}
  .btn-solid{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:40px;padding:0 22px;
    border-radius:999px;font-size:12.5px;font-weight:800;transition:.15s;flex-shrink:0}
  .btn-solid.broker{background:var(--blue);color:#fff}
  .btn-solid.broker:hover{background:#3b82f6}
  .btn-solid.forwarder{background:var(--emerald);color:#02130a}
  .btn-solid.forwarder:hover{background:#10b981}
  .btn-solid.manufacturer{background:var(--purple);color:#fff}
  .btn-solid.manufacturer:hover{background:#9333ea}
  .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:40px;padding:0 20px;
    border-radius:999px;font-size:12.5px;font-weight:700;background:rgba(255,255,255,.03);
    border:1px solid var(--line);color:#cbd5e1;transition:.15s}
  .btn-ghost:hover{background:rgba(255,255,255,.07);border-color:var(--line-2)}
  .comparison{max-width:1180px;margin:0 auto;padding:0 20px 100px}
  .comparison h2{font-size:clamp(24px,3.2vw,36px);font-weight:900;letter-spacing:-.03em;text-align:center;margin:0 0 12px}
  .comparison .sub{text-align:center;font-size:13.5px;color:var(--muted);max-width:520px;margin:0 auto 40px;line-height:1.6}
  .comp-shell{border-radius:20px;overflow:hidden;border:1px solid var(--line);background:var(--panel)}
  .comp-table{width:100%;border-collapse:collapse;font-size:12.5px}
  .comp-table thead th{padding:16px 18px;text-align:left;font-weight:800;font-size:11.5px;
    background:rgba(255,255,255,.02);border-bottom:1px solid var(--line);white-space:nowrap}
  .comp-table thead th.broker{color:var(--blue-2)}
  .comp-table thead th.forwarder{color:var(--emerald-2)}
  .comp-table thead th.manufacturer{color:var(--purple-2)}
  .comp-table tbody td{padding:12px 18px;border-bottom:1px solid var(--line);vertical-align:top;line-height:1.5}
  .comp-table tbody tr:last-child td{border-bottom:0}
  .comp-table tbody td:first-child{font-weight:700;color:#cbd5e1;white-space:nowrap;background:rgba(255,255,255,.01)}
  .comp-table tbody tr:hover td{background:rgba(255,255,255,.02)}
  .comp-check{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:var(--muted)}
  .comp-check.yes{color:var(--emerald-2)}
  .comp-check.no{color:var(--muted-2);opacity:.7}
  .comp-check.partial{color:var(--amber)}
  .ecosystem{max-width:1180px;margin:0 auto;padding:0 20px 100px}
  .eco-shell{border-radius:24px;border:1px solid var(--line);
    background:linear-gradient(135deg, rgba(96,165,250,.05), rgba(52,211,153,.04), rgba(168,85,247,.05));
    padding:40px 32px}
  @media(min-width:900px){.eco-shell{padding:56px 48px}}
  .eco-shell .title{font-size:clamp(22px,3vw,32px);font-weight:900;letter-spacing:-.02em;margin:0 0 12px;text-align:center}
  .eco-shell .sub{text-align:center;font-size:13.5px;color:var(--muted);max-width:560px;margin:0 auto 40px;line-height:1.6}
  .eco-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
  @media(min-width:768px){.eco-grid{grid-template-columns:repeat(4,1fr)}}
  .eco-item{padding:18px;border-radius:14px;background:rgba(0,0,0,.3);border:1px solid var(--line);text-align:center}
  .eco-item .ico{font-size:22px;margin-bottom:8px;display:block}
  .eco-item .t{font-size:12.5px;font-weight:700;margin-bottom:4px;line-height:1.3}
  .eco-item .d{font-size:10.5px;color:var(--muted-2);line-height:1.5}
  .integrations{max-width:1180px;margin:0 auto;padding:0 20px 100px}
  .int-head{margin-bottom:28px}
  .int-head .eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;
    text-transform:uppercase;letter-spacing:.14em;color:var(--muted-2);font-weight:800;margin-bottom:14px}
  .int-head h2{font-size:clamp(24px,3.4vw,40px);font-weight:900;letter-spacing:-.03em;margin:0 0 12px;line-height:1.1;max-width:760px}
  .int-head h2 .grad{background:linear-gradient(90deg,var(--cyan-2),var(--blue-2),var(--purple-2));
    -webkit-background-clip:text;background-clip:text;color:transparent}
  .int-head p{font-size:14px;color:var(--muted);max-width:620px;line-height:1.6;margin:0}
  .int-health{display:flex;flex-wrap:wrap;gap:12px;padding:16px 20px;margin-top:24px;
    border-radius:16px;background:rgba(255,255,255,.02);border:1px solid var(--line);align-items:center}
  .int-health .pill{display:inline-flex;align-items:center;gap:7px;padding:5px 11px;
    border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.02em}
  .int-health .pill.live{background:rgba(52,211,153,.10);color:var(--emerald-2);border:1px solid rgba(52,211,153,.24)}
  .int-health .pill.beta{background:rgba(245,158,11,.10);color:var(--amber-2);border:1px solid rgba(245,158,11,.24)}
  .int-health .pill.coming{background:rgba(148,163,184,.10);color:var(--slate);border:1px solid rgba(148,163,184,.24)}
  .int-health .sync{margin-left:auto;display:flex;align-items:center;gap:8px;font-size:11px;
    color:var(--muted-2);font-family:ui-monospace,Menlo,monospace}
  .int-health .sync .dot{width:6px;height:6px;border-radius:50%;background:var(--emerald);
    box-shadow:0 0 8px var(--emerald);animation:int-blink 2.2s ease-in-out infinite}
  @keyframes int-blink{0%,100%{opacity:.4}50%{opacity:1}}
  .int-filters{display:flex;flex-wrap:wrap;gap:6px;margin:22px 0 18px}
  .int-filter{padding:6px 13px;border-radius:999px;font-size:11.5px;font-weight:700;
    background:rgba(255,255,255,.02);border:1px solid var(--line);color:var(--muted);
    transition:.15s;letter-spacing:.01em;display:inline-flex;align-items:center;gap:6px}
  .int-filter:hover{background:rgba(255,255,255,.05);color:var(--text)}
  .int-filter.active{background:rgba(168,85,247,.14);border-color:rgba(168,85,247,.42);color:var(--purple-2)}
  .int-filter .count{font-size:9.5px;font-weight:800;padding:0 5px;border-radius:4px;
    background:rgba(255,255,255,.06);color:var(--muted-2);min-width:16px;text-align:center}
  .int-filter.active .count{background:rgba(168,85,247,.25);color:var(--purple-2)}
  .int-grid{display:grid;grid-template-columns:1fr;gap:12px}
  @media(min-width:640px){.int-grid{grid-template-columns:repeat(2,1fr)}}
  @media(min-width:900px){.int-grid{grid-template-columns:repeat(3,1fr)}}
  @media(min-width:1100px){.int-grid{grid-template-columns:repeat(4,1fr)}}
  .int-card{position:relative;border-radius:16px;background:var(--panel);border:1px solid var(--line);
    padding:16px;text-align:left;transition:.2s;display:flex;flex-direction:column;gap:10px;overflow:hidden}
  .int-card:hover{background:rgba(255,255,255,.03);border-color:var(--line-2);transform:translateY(-3px)}
  .int-card::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .25s;
    border-radius:16px;background:radial-gradient(400px circle at var(--mx,50%) var(--my,50%),
      rgba(255,255,255,.05), transparent 60%)}
  .int-card:hover::after{opacity:1}
  .int-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
  .int-card-icon{width:44px;height:44px;border-radius:12px;overflow:hidden;
    flex:0 0 44px;display:block;box-shadow:0 2px 8px rgba(0,0,0,.35),
    inset 0 0 0 1px rgba(255,255,255,.06)}
  .int-card-icon svg{width:100%;height:100%;display:block}
  .int-status{display:inline-flex;align-items:center;gap:5px;font-size:9.5px;font-weight:800;
    letter-spacing:.06em;text-transform:uppercase;padding:2px 7px;border-radius:5px}
  .int-status.live{background:rgba(52,211,153,.10);color:var(--emerald-2)}
  .int-status.beta{background:rgba(245,158,11,.10);color:var(--amber-2)}
  .int-status.coming{background:rgba(148,163,184,.10);color:var(--slate)}
  .int-status .sdot{width:5px;height:5px;border-radius:50%;background:currentColor;box-shadow:0 0 4px currentColor}
  .int-status.live .sdot{animation:int-blink 2s ease-in-out infinite}
  .int-card-title{font-size:13px;font-weight:800;letter-spacing:-.01em;line-height:1.25;color:var(--text);margin:0}
  .int-card-cat{font-size:9.5px;font-weight:700;letter-spacing:.08em;color:var(--muted-2);
    text-transform:uppercase;margin-bottom:-2px}
  .int-card-desc{font-size:11.5px;color:var(--muted);line-height:1.5;flex:1;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .int-card-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;
    padding-top:8px;border-top:1px solid var(--line);margin-top:2px}
  .int-card-dir{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;
    color:var(--muted-2);font-family:ui-monospace,Menlo,monospace}
  .int-card-dir .arr{font-size:11px;color:var(--muted)}
  .int-card-open{font-size:10.5px;font-weight:800;color:var(--muted);display:inline-flex;
    align-items:center;gap:4px;transition:.15s}
  .int-card:hover .int-card-open{color:var(--purple-2)}
  .int-card:hover .int-card-open .arrow{transform:translateX(3px)}
  .int-card-open .arrow{transition:transform .15s;display:inline-block}
  .int-ticker{margin-top:24px;padding:14px 18px;border-radius:14px;background:rgba(0,0,0,.4);
    border:1px solid var(--line);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
    font-size:11px;color:var(--muted);overflow:hidden;position:relative;line-height:1.7}
  .int-ticker .tt-head{display:flex;align-items:center;gap:8px;margin-bottom:8px;color:var(--muted-2);
    font-weight:800;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-family:inherit}
  .int-ticker .tt-head .d{width:6px;height:6px;border-radius:50%;background:var(--emerald);
    box-shadow:0 0 8px var(--emerald);animation:int-blink 2s ease-in-out infinite}
  .int-ticker .tt-line{display:flex;gap:8px;padding:2px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .int-ticker .tt-time{color:var(--muted-2);flex-shrink:0;min-width:56px}
  .int-ticker .tt-src{color:var(--purple-2);flex-shrink:0;min-width:76px}
  .int-ticker .tt-msg{color:var(--muted);overflow:hidden;text-overflow:ellipsis}
  .int-ticker .tt-ok{color:var(--emerald-2)}
  .int-ticker .tt-warn{color:var(--amber-2)}
  .imodal{position:fixed;inset:0;background:rgba(5,10,20,.75);
    -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);z-index:100;
    display:flex;align-items:flex-start;justify-content:center;padding:5vh 16px;overflow-y:auto}
  .imodal-shell{width:min(900px,100%);background:var(--panel-2);border:1px solid var(--line);
    border-radius:24px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6);animation:pop .2s ease}
  .imodal-head{display:flex;align-items:flex-start;gap:16px;padding:22px 26px;
    border-bottom:1px solid var(--line);position:sticky;top:0;
    background:rgba(8,8,10,.96);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);z-index:5}
  .imodal-icon{width:56px;height:56px;border-radius:16px;overflow:hidden;flex:0 0 56px;
    display:block;box-shadow:0 3px 12px rgba(0,0,0,.4),inset 0 0 0 1px rgba(255,255,255,.08)}
  .imodal-icon svg{width:100%;height:100%;display:block}
  .imodal-head-body{flex:1;min-width:0}
  .imodal-eyebrow{display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap}
  .imodal-eyebrow .cat{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:var(--muted-2);font-weight:800}
  .imodal-title{font-size:22px;font-weight:800;letter-spacing:-.02em;margin:0;line-height:1.2}
  .imodal-sub{font-size:12.5px;color:var(--muted);margin-top:4px;line-height:1.5;max-width:560px}
  .imodal-body{padding:24px 26px 28px}
  .imodal-section-title{font-size:11px;text-transform:uppercase;letter-spacing:.12em;
    color:var(--muted-2);font-weight:800;margin:0 0 12px;display:flex;align-items:center;gap:6px}
  .imodal-section-title .badge{font-size:9.5px;padding:1px 6px;border-radius:4px;
    background:rgba(168,85,247,.14);color:var(--purple-2);letter-spacing:.04em;font-weight:800}
  .imodal-grid{display:grid;grid-template-columns:1fr;gap:22px}
  @media(min-width:800px){.imodal-grid{grid-template-columns:1fr 1fr}}
  .imodal-kv-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px}
  .imodal-kv{border-radius:11px;background:rgba(255,255,255,.02);border:1px solid var(--line);padding:11px 13px}
  .imodal-kv .l{font-size:9.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted-2);font-weight:700;margin-bottom:3px}
  .imodal-kv .v{font-size:12.5px;font-weight:700;line-height:1.3;color:var(--text)}
  .sync-list{display:flex;flex-direction:column;gap:6px;margin-bottom:18px}
  .sync-item{display:flex;align-items:flex-start;gap:9px;padding:8px 11px;border-radius:9px;
    background:rgba(255,255,255,.02);border:1px solid var(--line);font-size:11.5px;line-height:1.45}
  .sync-item .check{width:16px;height:16px;border-radius:5px;display:grid;place-items:center;
    background:rgba(52,211,153,.14);color:var(--emerald-2);font-size:10px;flex:0 0 16px;margin-top:1px;font-weight:900}
  .entity-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}
  .entity-chip{font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:999px;
    background:rgba(168,85,247,.10);border:1px solid rgba(168,85,247,.28);color:var(--purple-2)}
  .api-sample{border-radius:12px;background:#050505;border:1px solid var(--line);padding:14px;
    font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.65;
    color:#cbd5e1;overflow-x:auto;position:relative;white-space:pre}
  .api-sample .k{color:var(--blue-2)}
  .api-sample .s{color:var(--emerald-2)}
  .api-sample .c{color:var(--muted-2)}
  .api-sample .n{color:var(--amber-2)}
  .imodal-actions{display:flex;gap:10px;margin-top:22px;padding-top:18px;
    border-top:1px solid var(--line);flex-wrap:wrap;align-items:center}
  .imodal-actions .connect{display:inline-flex;align-items:center;justify-content:center;gap:6px;
    height:40px;padding:0 22px;border-radius:999px;background:linear-gradient(90deg,var(--purple),var(--blue));
    color:#fff;font-size:12.5px;font-weight:800;transition:.15s;box-shadow:0 0 22px rgba(168,85,247,.30)}
  .imodal-actions .connect:hover{filter:brightness(1.1);box-shadow:0 0 32px rgba(168,85,247,.45)}
  .imodal-actions .docs{display:inline-flex;align-items:center;justify-content:center;gap:6px;
    height:40px;padding:0 18px;border-radius:999px;background:rgba(255,255,255,.03);
    border:1px solid var(--line);color:#cbd5e1;font-size:12.5px;font-weight:700;transition:.15s}
  .imodal-actions .docs:hover{background:rgba(255,255,255,.07)}
  .imodal-actions .close{margin-left:auto;font-size:12px;color:var(--muted);
    padding:8px 12px;border-radius:8px;transition:.15s}
  .imodal-actions .close:hover{background:rgba(255,255,255,.05);color:var(--text)}
  .final-cta{max-width:760px;margin:0 auto;padding:0 20px 100px;text-align:center}
  .final-cta .eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;
    text-transform:uppercase;letter-spacing:.14em;color:var(--muted-2);font-weight:800;margin-bottom:16px}
  .final-cta h2{font-size:clamp(28px,4vw,44px);font-weight:900;letter-spacing:-.03em;margin:0 0 16px;line-height:1.05}
  .final-cta h2 .grad{background:linear-gradient(90deg,var(--blue-2),var(--purple-2));
    -webkit-background-clip:text;background-clip:text;color:transparent}
  .final-cta p{font-size:14px;color:var(--muted);max-width:480px;margin:0 auto 32px;line-height:1.6}
  .final-row{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
  @media(min-width:640px){.final-row{flex-direction:row}}
  .btn-primary-lg{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:48px;
    padding:0 32px;border-radius:999px;background:linear-gradient(90deg,var(--blue),var(--purple));
    color:#fff;font-size:14px;font-weight:800;transition:.2s;box-shadow:0 0 24px rgba(168,85,247,.35)}
  .btn-primary-lg:hover{filter:brightness(1.1);box-shadow:0 0 36px rgba(168,85,247,.55)}
  .btn-secondary-lg{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:48px;
    padding:0 28px;border-radius:999px;background:rgba(255,255,255,.03);
    border:1px solid var(--line);color:#cbd5e1;font-size:14px;font-weight:700;transition:.18s}
  .btn-secondary-lg:hover{background:rgba(255,255,255,.07)}
  footer{border-top:1px solid var(--line);padding:32px 20px}
  .footer-inner{max-width:1180px;margin:0 auto;display:flex;flex-direction:column;align-items:center;
    justify-content:space-between;gap:16px;font-size:11px;color:var(--muted-2)}
  @media(min-width:640px){.footer-inner{flex-direction:row}}
  .footer-brand{display:flex;align-items:center;gap:8px}
  .footer-brand .mark{width:20px;height:20px;border-radius:6px;
    background:linear-gradient(135deg,var(--blue),var(--purple));color:#04121f;
    display:grid;place-items:center;font-weight:900;font-size:10px}
  .footer-links{display:flex;gap:20px}
  .footer-links a:hover{color:#cbd5e1}
  .toasts{position:fixed;bottom:20px;right:20px;display:flex;flex-direction:column;gap:8px;z-index:200;pointer-events:none}
  .toast{background:#0f172a;color:#e8eefc;padding:10px 14px;border-radius:10px;font-size:12px;
    border-left:3px solid var(--purple);box-shadow:0 8px 24px rgba(0,0,0,.5);max-width:340px;
    display:flex;gap:9px;align-items:center;animation:slideIn .22s ease;pointer-events:auto}
  .toast.ok{border-left-color:var(--emerald)}
  .toast.warn{border-left-color:var(--amber)}
  @keyframes slideIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
  @media(prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;transition-duration:.001ms!important}}
`;

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */
const esc = (s: unknown): string =>
  String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

const catLabel = (cat: IntCategory): string =>
  INT_CATEGORIES.find(c => c.id === cat)?.label ?? 'Other';

const dirLabel = (dir: IntDirection): string =>
  dir === '→' ? 'Outbound' : dir === '←' ? 'Inbound' : 'Bi-directional';

const dirIcon = (dir: IntDirection) => <span className="arr">{dir}</span>;

const iconBg = (id: SolutionId): string =>
  id === 'broker' ? 'rgba(96,165,250,.10)' : id === 'forwarder' ? 'rgba(52,211,153,.10)' : 'rgba(168,85,247,.10)';
const iconColor = (id: SolutionId): string =>
  id === 'broker' ? '#93c5fd' : id === 'forwarder' ? '#6ee7b7' : '#c084fc';

const compIcon = (v: CompValue) => {
  if (v === 'yes') return <span className="comp-check yes">● Full</span>;
  if (v === 'partial') return <span className="comp-check partial">◐ Partial</span>;
  return <span className="comp-check no">○ Not included</span>;
};

function renderApiSample(intg: Integration): string {
  const samples: Record<IntCategory, string> = {
    erp: `<span class="c"># Sync a purchase order into ${esc(intg.name)}</span>
<span class="k">curl</span> -X POST https://api.tradeops.io<span class="s">/v1/integrations/${intg.id}/pos</span> \\
  -H <span class="s">"Authorization: Bearer $TRADEOPS_KEY"</span> \\
  -H <span class="s">"Content-Type: application/json"</span> \\
  -d <span class="s">'{ "po": "PO-2026-88213", "customer": "ACC-4471", "lines": [...] }'</span>`,
    accounting: `<span class="c"># Push an invoice to ${esc(intg.name)}</span>
<span class="k">curl</span> -X POST https://api.tradeops.io<span class="s">/v1/integrations/${intg.id}/invoices</span> \\
  -H <span class="s">"Authorization: Bearer $TRADEOPS_KEY"</span> \\
  -H <span class="s">"Content-Type: application/json"</span> \\
  -d <span class="s">'{ "invoice": "INV-4471", "total": 12400.00, "currency": "MYR" }'</span>`,
    carrier: `<span class="c"># Create a booking with ${esc(intg.name)}</span>
<span class="k">curl</span> -X POST https://api.tradeops.io<span class="s">/v1/integrations/${intg.id}/bookings</span> \\
  -H <span class="s">"Authorization: Bearer $TRADEOPS_KEY"</span> \\
  -H <span class="s">"Content-Type: application/json"</span> \\
  -d <span class="s">'{ "pol": "CNSHA", "pod": "MYPKG", "containers": ["MSKU4471823"] }'</span>`,
    customs: `<span class="c"># Lodge a declaration with ${esc(intg.name)}</span>
<span class="k">curl</span> -X POST https://api.tradeops.io<span class="s">/v1/integrations/${intg.id}/declarations</span> \\
  -H <span class="s">"Authorization: Bearer $TRADEOPS_KEY"</span> \\
  -H <span class="s">"Content-Type: application/json"</span> \\
  -d <span class="s">'{ "form": "C1", "importer": "ROI-118742", "lines": [...] }'</span>`,
    banking: `<span class="c"># Publish an RWA offering to ${esc(intg.name)}</span>
<span class="k">curl</span> -X POST https://api.tradeops.io<span class="s">/v1/integrations/${intg.id}/offerings</span> \\
  -H <span class="s">"Authorization: Bearer $TRADEOPS_KEY"</span> \\
  -H <span class="s">"Content-Type: application/json"</span> \\
  -d <span class="s">'{ "collateral": "FG-2026-0044", "value": 4530000, "ltv": 0.65 }'</span>`,
    ecommerce: `<span class="c"># Pull orders from ${esc(intg.name)}</span>
<span class="k">curl</span> -X POST https://api.tradeops.io<span class="s">/v1/integrations/${intg.id}/orders</span> \\
  -H <span class="s">"Authorization: Bearer $TRADEOPS_KEY"</span> \\
  -H <span class="s">"Content-Type: application/json"</span> \\
  -d <span class="s">'{ "since": "2026-10-18T00:00:00Z", "limit": 100 }'</span>`,
    docs: `<span class="c"># Send a document via ${esc(intg.name)}</span>
<span class="k">curl</span> -X POST https://api.tradeops.io<span class="s">/v1/integrations/${intg.id}/messages</span> \\
  -H <span class="s">"Authorization: Bearer $TRADEOPS_KEY"</span> \\
  -H <span class="s">"Content-Type: application/json"</span> \\
  -d <span class="s">'{ "channel": "#ops", "document": "INV-4471.pdf" }'</span>`,
  };
  return samples[intg.cat] || samples.docs;
}

/* ══════════════════════════════════════════════════════════
   COUNT-UP HOOK
   ══════════════════════════════════════════════════════════ */
function useCountUp(target: number, opts: { decimals?: number; suffix?: string; start?: boolean } = {}): string {
  const { decimals = 0, suffix = '', start = true } = opts;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    let startTs: number | null = null;
    const step = (ts: number) => {
      if (startTs === null) startTs = ts;
      const p = Math.min(1, (ts - startTs) / 1400);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, start]);

  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
}

/* ══════════════════════════════════════════════════════════
   SOLUTION CARD
   ══════════════════════════════════════════════════════════ */
function SolutionCard({ sol, onClick }: { sol: Solution; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  };
  return (
    <button ref={ref} className={`sol-card ${sol.id}`} onClick={onClick} onMouseMove={onMove}>
      <div className={`sol-icon ${sol.id}`}>{sol.icon}</div>
      <h3 className="sol-title">{sol.title}</h3>
      <p className="sol-desc">{sol.shortDesc}</p>
      <div className="sol-chips">
        {sol.modules.slice(0, 3).map((m, i) => (
          <span key={i} className="sol-chip">{m.t.split(' ')[0]}</span>
        ))}
      </div>
      <div className="sol-cta">Explore solution <span className="arrow">→</span></div>
      <div className="sol-metrics">
        {sol.metrics.map((m, i) => (
          <div key={i} className={`sol-metric ${sol.id}`}>
            <div className="v">{m.v}</div>
            <div className="l">{m.l}</div>
          </div>
        ))}
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   INTEGRATION CARD (SVG logo via dangerouslySetInnerHTML)
   ══════════════════════════════════════════════════════════ */
function IntegrationCard({ intg, onClick }: { intg: Integration; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  };
  return (
    <button ref={ref} className="int-card" onClick={onClick} onMouseMove={onMove}>
      <div className="int-card-head">
        <div className="int-card-icon" dangerouslySetInnerHTML={{ __html: LOGOS[intg.id] || '' }} />
        <span className={`int-status ${intg.status}`}>
          <span className="sdot" />
          {intg.status === 'live' ? 'Live' : intg.status === 'beta' ? 'Beta' : 'Coming'}
        </span>
      </div>
      <div className="int-card-cat">{catLabel(intg.cat)}</div>
      <h3 className="int-card-title">{intg.name}</h3>
      <p className="int-card-desc">{intg.desc}</p>
      <div className="int-card-foot">
        <span className="int-card-dir">{dirIcon(intg.direction)} {dirLabel(intg.direction)}</span>
        <span className="int-card-open">Details <span className="arrow">→</span></span>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   SOLUTION MODAL
   ══════════════════════════════════════════════════════════ */
function SolutionModal({ sol, onClose }: { sol: Solution; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <div className="modal" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-shell">
        <div className="modal-head">
          <div className="modal-icon" style={{ background: iconBg(sol.id), color: iconColor(sol.id) }}>{sol.icon}</div>
          <div className="modal-head-body">
            <div className="modal-eyebrow">Solution pod · {sol.metrics[0]?.v} {sol.metrics[0]?.l.toLowerCase()}</div>
            <h2 className="modal-title">{sol.title}</h2>
            <p className="modal-sub">{sol.tagline}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-grid">
            <div>
              <div className="modal-metrics">
                {sol.metrics.map((m, i) => (
                  <div key={i} className={`mm ${sol.id}`}>
                    <div className="v">{m.v}</div>
                    <div className="l">{m.l}</div>
                  </div>
                ))}
              </div>
              <h3 className="modal-section-title">What you get</h3>
              <div className="modules">
                {sol.modules.map((m, i) => (
                  <div key={i} className={`module ${sol.id}`}>
                    <div className="module-ico">{m.ico}</div>
                    <div className="module-body">
                      <div className="module-title">{m.t}</div>
                      <div className="module-desc">{m.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="modal-section-title">Lifecycle</h3>
              <div className="workflow-list">
                {sol.workflow.map((s, i) => (
                  <div key={i} className="wf-step">
                    <div className="wf-step-num">{i + 1}</div>
                    <div className="wf-step-body">
                      <div className="wf-step-title">{s.t}</div>
                      <div className="wf-step-desc">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`case-study ${sol.id}`}>
                <p className="quote">&quot;{sol.case.quote}&quot;</p>
                <div className="author">
                  <div className="avatar">{sol.case.initial}</div>
                  <span>{sol.case.author}</span>
                </div>
              </div>
              <div style={{
                fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginTop: 20,
                padding: 14, borderRadius: 12, background: 'rgba(255,255,255,.02)',
                border: '1px solid var(--line)',
              }}>{sol.extra}</div>
            </div>
          </div>
          <div className="modal-actions">
            <a href="/register" className={`btn-solid ${sol.id}`}>
              Start with {sol.title.replace('For ', '')} →
            </a>
            <a href="/login" className="btn-ghost">Book a walkthrough</a>
            <button className="btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   INTEGRATION MODAL
   ══════════════════════════════════════════════════════════ */
function IntegrationModal({ intg, onClose, onToast }: { intg: Integration; onClose: () => void; onToast: (msg: string, kind?: 'ok' | 'warn') => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  const notes = intg.status === 'live'
    ? 'Production-ready. Connectors are monitored 24/7 with automatic failover and reconciliation reports.'
    : intg.status === 'beta'
      ? 'Beta connector — functional and battle-tested with early customers. Expect minor field-mapping changes.'
      : 'Coming soon. Join the waitlist and we will reach out when the connector is available.';

  return (
    <div className="imodal" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="imodal-shell">
        <div className="imodal-head">
          <div className="imodal-icon" dangerouslySetInnerHTML={{ __html: LOGOS[intg.id] || '' }} />
          <div className="imodal-head-body">
            <div className="imodal-eyebrow">
              <span className="cat">{catLabel(intg.cat)}</span>
              <span className={`int-status ${intg.status}`}>
                <span className="sdot" />
                {intg.status === 'live' ? 'Live' : intg.status === 'beta' ? 'Beta' : 'Coming'}
              </span>
            </div>
            <h2 className="imodal-title">{intg.name}</h2>
            <p className="imodal-sub">{intg.long}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="imodal-body">
          <div className="imodal-grid">
            <div>
              <h3 className="imodal-section-title">Configuration</h3>
              <div className="imodal-kv-grid">
                <div className="imodal-kv"><div className="l">Status</div><div className="v" style={{ textTransform: 'capitalize' }}>{intg.status}</div></div>
                <div className="imodal-kv"><div className="l">Data direction</div><div className="v">{dirIcon(intg.direction)} {dirLabel(intg.direction)}</div></div>
                <div className="imodal-kv"><div className="l">Setup time</div><div className="v">{intg.setup}</div></div>
                <div className="imodal-kv"><div className="l">Auth method</div><div className="v">{intg.auth}</div></div>
              </div>
              <h3 className="imodal-section-title">What syncs</h3>
              <div className="sync-list">
                {intg.capabilities.map((c, i) => (
                  <div key={i} className="sync-item"><span className="check">✓</span><span>{c}</span></div>
                ))}
              </div>
              <h3 className="imodal-section-title">Supported entities</h3>
              <div className="entity-chips">
                {intg.entities.map((e, i) => <span key={i} className="entity-chip">{e}</span>)}
              </div>
            </div>
            <div>
              <h3 className="imodal-section-title">API example <span className="badge">curl</span></h3>
              <div className="api-sample" dangerouslySetInnerHTML={{ __html: renderApiSample(intg) }} />
              <h3 className="imodal-section-title" style={{ marginTop: 20 }}>Notes</h3>
              <div style={{
                fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6, padding: 12,
                borderRadius: 10, background: 'rgba(255,255,255,.02)', border: '1px solid var(--line)',
              }}>{notes}</div>
            </div>
          </div>
          <div className="imodal-actions">
            <button className="connect" onClick={() => {
              onToast(intg.status === 'coming' ? `Added ${intg.name} to waitlist.` : `${intg.name} connector ready — API key generated.`);
              onClose();
            }}>
              {intg.status === 'coming' ? 'Join waitlist →' : `Connect ${intg.name}`}
            </button>
            <a href={`/docs/integrations/${intg.id}`} className="docs">View docs</a>
            <button className="close" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TOP BAR
   ══════════════════════════════════════════════════════════ */
function TopBar() {
  return (
    <header className="topbar">
      <a href="/" className="brand" aria-label="TradeOps home">
        <span className="brand-mark">T</span>
        <span className="brand-name">TradeOps<small>Solutions</small></span>
      </a>
      <nav className="nav">
        <a href="#solutions">Solutions</a>
        <a href="#comparison">Compare</a>
        <a href="#integrations">Integrations</a>
        <a href="#ecosystem">Ecosystem</a>
      </nav>
      <div className="header-actions">
        <a href="/login" className="signin">Sign in</a>
        <a href="/register" className="btn-ghost-sm">Get started →</a>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════════ */
function Hero({ started }: { started: boolean }) {
  const v1 = useCountUp(1, { start: started });
  const v3 = useCountUp(3, { start: started });
  const v27 = useCountUp(27, { start: started });
  const v999 = useCountUp(99.9, { start: started, decimals: 1, suffix: '%' });

  return (
    <section className="hero">
      <div className="badge">
        <span>⚡</span><span>Unified Trade OS</span>
        <span className="divider" />
        <span className="live"><span className="pulse" />Gateway live</span>
      </div>
      <h1 className="h1">Built for <span className="grad">Every Entity</span></h1>
      <p className="lede">
        Whether you are clearing goods, moving them across oceans, or manufacturing them,
        TradeOps is the operating system for your operations.
      </p>
      <div className="hero-stats">
        <div className="hero-stat"><div className="v">{v1}</div><div className="l">Platform · All entities</div></div>
        <div className="hero-stat"><div className="v">{v3}</div><div className="l">Specialised pods</div></div>
        <div className="hero-stat"><div className="v">{v27}</div><div className="l">Native integrations</div></div>
        <div className="hero-stat"><div className="v">{v999}</div><div className="l">Platform uptime</div></div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   COMPARISON SECTION
   ══════════════════════════════════════════════════════════ */
function ComparisonSection() {
  return (
    <section className="comparison" id="comparison">
      <h2>One platform. Three different lenses.</h2>
      <p className="sub">Every entity shares the same underlying data layer, compliance engine, and AI copilot.</p>
      <div className="comp-shell">
        <table className="comp-table">
          <thead>
            <tr>
              <th style={{ minWidth: 200 }}>Capability</th>
              <th className="broker" style={{ minWidth: 160 }}>🧑‍💼 Brokers</th>
              <th className="forwarder" style={{ minWidth: 160 }}>🚛 Forwarders</th>
              <th className="manufacturer" style={{ minWidth: 160 }}>🏭 Manufacturers</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((r, i) => (
              <tr key={i}>
                <td>{r.cap}</td>
                <td>{compIcon(r.broker)}</td>
                <td>{compIcon(r.forwarder)}</td>
                <td>{compIcon(r.manufacturer)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   LIVE TICKER
   ══════════════════════════════════════════════════════════ */
function LiveTicker() {
  const [lines, setLines] = useState<TickerLine[]>([]);
  const idxRef = useRef(0);

  const push = useCallback(() => {
    const ev = TICKER_EVENTS[idxRef.current % TICKER_EVENTS.length];
    if (!ev) return;
    idxRef.current += 1;
    setLines(prev => [
      { time: new Date().toLocaleTimeString('en-GB'), src: ev.src, msg: ev.msg, cls: ev.cls },
      ...prev,
    ].slice(0, 4));
  }, []);

  useEffect(() => {
    push();
    const id = window.setInterval(push, 3800);
    return () => window.clearInterval(id);
  }, [push]);

  return (
    <div className="int-ticker" aria-live="polite">
      <div className="tt-head"><span className="d" /><span>Live webhook stream</span></div>
      <div>
        {lines.map((l, i) => (
          <div key={i} className="tt-line">
            <span className="tt-time">{l.time}</span>
            <span className="tt-src">{l.src}</span>
            <span className={`tt-msg ${l.cls}`}>{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ECOSYSTEM + FINAL CTA + FOOTER
   ══════════════════════════════════════════════════════════ */
function EcosystemSection() {
  return (
    <section className="ecosystem" id="ecosystem">
      <div className="eco-shell">
        <h2 className="title">One shared backbone</h2>
        <p className="sub">Whichever pod you start with, you&apos;re plugged into the same core.</p>
        <div className="eco-grid">
          <div className="eco-item"><span className="ico">🆔</span><div className="t">Unified identity</div><div className="d">One account, every entity — no duplicate KYC.</div></div>
          <div className="eco-item"><span className="ico">🔗</span><div className="t">Shared data layer</div><div className="d">Jobs, declarations, batches, tokens — one ledger.</div></div>
          <div className="eco-item"><span className="ico">⚖️</span><div className="t">Compliance rails</div><div className="d">CBAM, ATIGA, UBL, MyInvois — built in.</div></div>
          <div className="eco-item"><span className="ico">✦</span><div className="t">Agentic copilot</div><div className="d">Same AI across every pod — trained on your flows.</div></div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="eyebrow">🎯 Pick your starting pod</div>
      <h2>Start with the pod that <span className="grad">fits your day</span>.</h2>
      <p>No migrations, no integrations. Bring your entity — the shared backbone will do the rest.</p>
      <div className="final-row">
        <a href="/register" className="btn-primary-lg">Create workspace →</a>
        <a href="/login" className="btn-secondary-lg">Book a walkthrough</a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand"><span className="mark">T</span>TradeOps · 2026</div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
export default function SolutionsPage() {
  const [activeSolution, setActiveSolution] = useState<Solution | null>(null);
  const [activeIntegration, setActiveIntegration] = useState<Integration | null>(null);
  const [intFilter, setIntFilter] = useState<'all' | IntCategory>('all');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [heroStarted, setHeroStarted] = useState(false);

  const toastSeq = useRef(0);
  const pushToast = useCallback((msg: string, kind: 'ok' | 'warn' = 'ok') => {
    const id = ++toastSeq.current;
    setToasts(t => [...t, { id, msg, kind }]);
    window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3400);
  }, []);

  // Kick off hero count-ups shortly after mount
  useEffect(() => {
    const t = window.setTimeout(() => setHeroStarted(true), 300);
    return () => window.clearTimeout(t);
  }, []);

  // Escape closes whichever modal is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (activeIntegration) setActiveIntegration(null);
      else if (activeSolution) setActiveSolution(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeSolution, activeIntegration]);

  const health = useMemo(() => ({
    live: INTEGRATIONS.filter(i => i.status === 'live').length,
    beta: INTEGRATIONS.filter(i => i.status === 'beta').length,
    coming: INTEGRATIONS.filter(i => i.status === 'coming').length,
  }), []);

  const filteredIntegrations = useMemo(
    () => intFilter === 'all' ? INTEGRATIONS : INTEGRATIONS.filter(i => i.cat === intFilter),
    [intFilter]
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="atmos" aria-hidden="true">
        <div className="dotgrid" />
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      </div>

      <div className="page">
        <TopBar />

        <Hero started={heroStarted} />

        {/* ══════ SOLUTIONS ══════ */}
        <section className="solutions" id="solutions">
          <div className="solutions-grid">
            {SOLUTIONS.map(sol => (
              <SolutionCard key={sol.id} sol={sol} onClick={() => setActiveSolution(sol)} />
            ))}
          </div>
        </section>

        <ComparisonSection />

        {/* ══════ INTEGRATIONS ══════ */}
        <section className="integrations" id="integrations">
          <div className="int-head">
            <div className="eyebrow">🔌 Integrations</div>
            <h2>Plug into the systems <span className="grad">you already run</span>.</h2>
            <p>
              {INTEGRATIONS.length} first-class integrations across ERP, accounting, carriers, customs,
              banking, e-commerce and communications — with bi-directional sync, webhooks, and a shared event bus.
            </p>
            <div className="int-health">
              <span className="pill live">
                <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 6px currentColor' }} />
                <span>{health.live} live</span>
              </span>
              <span className="pill beta"><span>{health.beta} beta</span></span>
              <span className="pill coming"><span>{health.coming} coming soon</span></span>
              <div className="sync">
                <span className="dot" />
                <span>All sync endpoints healthy · 1.2M calls this week</span>
              </div>
            </div>
          </div>

          <div className="int-filters">
            {INT_CATEGORIES.map(c => {
              const count = c.id === 'all' ? INTEGRATIONS.length : INTEGRATIONS.filter(i => i.cat === c.id).length;
              return (
                <button
                  key={c.id}
                  className={`int-filter ${c.id === intFilter ? 'active' : ''}`}
                  onClick={() => setIntFilter(c.id)}
                >
                  {c.label}<span className="count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="int-grid">
            {filteredIntegrations.map(intg => (
              <IntegrationCard key={intg.id} intg={intg} onClick={() => setActiveIntegration(intg)} />
            ))}
          </div>

          <LiveTicker />
        </section>

        <EcosystemSection />
        <FinalCTA />
        <Footer />
      </div>

      {/* ══════ MODALS ══════ */}
      {activeSolution && (
        <SolutionModal sol={activeSolution} onClose={() => setActiveSolution(null)} />
      )}
      {activeIntegration && (
        <IntegrationModal
          intg={activeIntegration}
          onClose={() => setActiveIntegration(null)}
          onToast={pushToast}
        />
      )}

      {/* ══════ TOASTS ══════ */}
      <div className="toasts">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.kind}`}>
            {(t.kind === 'warn' ? '⚠ ' : '✓ ') + t.msg}
          </div>
        ))}
      </div>
    </>
  );
}