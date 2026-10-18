import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* ══════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════ */
type Theme = 'auto' | 'light' | 'dark';
type ToastKind = 'ok' | 'warn' | 'err';
type RailTab = 'copilot' | 'classify' | 'checks' | 'audit';
type ViewKey =
  | 'studio' | 'jobs' | 'taskboard' | 'charges' | 'milestones' | 'sustainability'
  | 'queue' | 'drafts' | 'submitted' | 'einvoice' | 'tariff' | 'rulings'
  | 'fta' | 'restricted' | 'importers' | 'products';

type DocTypeKey =
  | 'booking' | 'si' | 'vgm' | 'invoice' | 'packing' | 'coo'
  | 'bol' | 'manifest' | 'arrival' | 'permit' | 'do_' | 'freightInv';

interface Toast { id: number; msg: string; kind: ToastKind; }
interface HsEntry { code: string; desc: string; duty: number; kw: string[]; notes: string[]; }
interface Ruling { ref: string; subject: string; code: string; }
interface FtaAgreement { id: string; name: string; members: string[]; threshold: number; }
interface Importer { name: string; reg: string; status: string; }
interface DocTypeInfo { label: string; cls: string; required: boolean; stage: number; }
interface StageInfo { id: number; key: string; name: string; icon: string; }
interface Task { id: string; stage: number; title: string; owner: string; due: string; done: boolean; }
interface Charge { code: string; desc: string; qty: number; unit: string; buyRate: number; sellRate: number; currency: string; }
interface ChargePreset { code: string; desc: string; unit: string; currency: string; buy: number; sell: number; }
interface Milestone { key: string; label: string; planned: string; actual: string; }
interface Line { id: number; desc: string; code: string; origin: string; qty: number; val: number; rate: number; }
interface Doc {
  id: number; name: string; type: DocTypeKey; blob: Blob; url: string;
  pages: number; source: 'attached' | 'sample'; size: number; added: string;
}
interface AuditEvent { text: string; time: string; }
interface ClassResult extends HsEntry { hits: number; conf: number; }
interface JobHeader {
  jobNo: string; direction: string; mode: string; booking: string; custRef: string;
  shipper: string; consignee: string; notify: string; carrier: string;
  vessel: string; pol: string; pod: string; delivery: string;
  etd: string; eta: string; atd: string; ata: string;
  ctr: string; ctrType: string;
  pkgs: number; kg: number; cbm: number; chg: number;
  sales: string; ops: string;
}
interface DeclHeader {
  importer: string; defOrigin: string; port: string; incoterm: string;
  currency: string; fxRate: number; taxRate: number; declDate: string; otherCharges: number;
}
interface CopMsg { role: 'bot' | 'user'; html: string; }
interface CheckItem { s: 'pass' | 'warn' | 'fail' | 'info'; t: string; d: string; }
interface CarbonResult {
  mode: string; origin: string; distance: number; tonnes: number;
  kg: number; tCO2e: number; cost: number; factor: number; intensity: number;
}
interface RiskResult { score: number; band: 'low' | 'mid' | 'high'; reasons: string[]; confidence: number; }
interface EInvCheck { label: string; ok: boolean; detail: string; }
interface EInvResult { checks: EInvCheck[]; pct: number; missing: string[]; ok: number; total: number; }
interface ChargesTotals { buyMYR: number; sellMYR: number; gp: number; margin: number; }
interface PdfRow { text?: string; style?: string; }
interface PaletteItem { group: string; icon: string; label: string; hint: string; run: () => void; }

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */
const HS_DB: HsEntry[] = [
  { code:'8471.30.00', desc:'Portable automatic data processing machines, weight ≤ 10 kg (laptops, tablets)', duty:0, kw:['laptop','notebook','macbook','tablet','portable computer','data processing'], notes:[] },
  { code:'8517.13.00', desc:'Smartphones and other telephones for cellular networks', duty:0, kw:['smartphone','mobile phone','cellular','iphone','handset','phone'], notes:[] },
  { code:'8518.30.00', desc:'Headphones and earphones, whether or not combined with a microphone', duty:0, kw:['headphone','earphone','earbud','headset','bluetooth headphone'], notes:[] },
  { code:'8517.62.00', desc:'Machines for the reception, conversion and transmission of data (routers, switches)', duty:0, kw:['router','modem','network switch','access point','network equipment'], notes:['Encryption-capable network equipment may require a dual-use export/import permit.'] },
  { code:'8504.40.00', desc:'Static converters (power adapters, inverters, UPS)', duty:5, kw:['adapter','charger','converter','inverter','power supply','transformer'], notes:[] },
  { code:'8544.42.00', desc:'Electric conductors ≤ 1000 V, fitted with connectors', duty:5, kw:['cable','conductor','connector','usb cable','charging cable','wire'], notes:[] },
  { code:'6109.10.00', desc:'T-shirts, singlets and vests, knitted or crocheted, of cotton', duty:10, kw:['t-shirt','tshirt','tee shirt','singlet','vest','cotton shirt','knitted'], notes:['Textile labelling requirements apply (fibre content, care, origin).'] },
  { code:'0901.21.00', desc:'Coffee, roasted, not decaffeinated', duty:5, kw:['coffee','roasted coffee','coffee bean','espresso'], notes:['Food safety import permit and Halal certification may be required.'] },
  { code:'3004.90.00', desc:'Medicaments, put up in measured doses for retail sale', duty:0, kw:['medicine','medicament','pharmaceutical','drug','capsule','syrup'], notes:['Pharmaceutical products require a valid import licence from the Drug Authority.'] },
  { code:'3304.99.00', desc:'Beauty or skin-care preparations, other than medicaments', duty:10, kw:['cosmetic','skincare','skin care','cream','lotion','serum','beauty product'], notes:['Cosmetics require notification with the National Pharmaceutical Regulatory Agency.'] },
  { code:'9403.60.00', desc:'Other wooden furniture', duty:10, kw:['furniture','wooden','wood table','chair','desk','cabinet','shelf'], notes:['Timber products may require a phytosanitary / legality certificate.'] },
  { code:'3926.90.00', desc:'Other articles of plastics', duty:10, kw:['plastic','plastics','pvc','acrylic','moulded plastic','polymer'], notes:[] },
  { code:'8708.29.00', desc:'Other parts and accessories of motor vehicle bodies', duty:10, kw:['bumper','car part','vehicle body','automotive part','bracket','body panel'], notes:['Automotive parts may require type approval certification.'] },
  { code:'9503.00.00', desc:'Tricycles, scooters, dolls, toys and puzzles', duty:0, kw:['toy','toys','doll','puzzle','tricycle','board game'], notes:['Toys must comply with mandatory safety standards (MS ISO 8124).'] },
  { code:'4202.92.00', desc:'Travelling bags, sports bags and similar containers, of textile materials', duty:15, kw:['bag','backpack','handbag','luggage','pouch','tote'], notes:[] },
  { code:'7308.90.00', desc:'Other structures and parts of structures, of iron or steel', duty:10, kw:['steel structure','iron','beam','scaffold','tower','steel frame'], notes:['CBAM-relevant good: embedded emissions reporting applies to EU-bound shipments from 2026.'] },
];

const RULINGS: Ruling[] = [
  { ref:'BTI-2025-1187', subject:'Wireless earbuds with charging case', code:'8518.30.00' },
  { ref:'BTI-2025-0942', subject:'Foldable tablet with detachable keyboard', code:'8471.30.00' },
  { ref:'BTI-2024-2210', subject:'Cotton knitted promotional t-shirts', code:'6109.10.00' },
  { ref:'BTI-2024-1873', subject:'USB-C braided charging cable, 2 m', code:'8544.42.00' },
  { ref:'BTI-2024-1552', subject:'Roasted arabica coffee beans, retail packs', code:'0901.21.00' },
  { ref:'BTI-2023-0981', subject:'Moulded plastic storage crates', code:'3926.90.00' },
];

const FTA_AGREEMENTS: FtaAgreement[] = [
  { id:'ATIGA', name:'ASEAN Trade in Goods Agreement', members:['SG','TH','VN','ID','MY','PH','BN','KH','LA','MM'], threshold:40 },
  { id:'RCEP',  name:'Regional Comprehensive Economic Partnership', members:['CN','JP','KR','AU','SG','TH','VN','ID','MY','PH','NZ'], threshold:40 },
  { id:'MJEPA', name:'Malaysia–Japan Economic Partnership Agreement', members:['JP'], threshold:40 },
  { id:'MAFTA', name:'Malaysia–Australia Free Trade Agreement', members:['AU'], threshold:40 },
  { id:'AIFTA', name:'ASEAN–India Free Trade Area', members:['IN'], threshold:35 },
];

const DEFAULT_IMPORTERS: Importer[] = [
  { name:'Northwind Electronics Sdn Bhd', reg:'ROI-118742', status:'Active' },
  { name:'Selatan Textiles Pte Ltd', reg:'ROI-220319', status:'Active' },
  { name:'Asia Pacific Components Bhd', reg:'ROI-301884', status:'Active · bonded warehouse' },
];

const STAGES: StageInfo[] = [
  { id:1,  key:'booking', name:'Booking',          icon:'📋' },
  { id:2,  key:'docs',    name:'Documentation',    icon:'📄' },
  { id:3,  key:'export',  name:'Export Clearance', icon:'🛃' },
  { id:4,  key:'origin',  name:'Origin Handling',  icon:'📦' },
  { id:5,  key:'transit', name:'In Transit',       icon:'🚢' },
  { id:6,  key:'arrival', name:'Arrival',          icon:'⚓' },
  { id:7,  key:'import',  name:'Import Clearance', icon:'🛃' },
  { id:8,  key:'delivery',name:'Delivery',         icon:'🚚' },
  { id:9,  key:'billing', name:'Billing',          icon:'💰' },
  { id:10, key:'closed',  name:'Closed',           icon:'✓' },
];

const DEFAULT_TASKS = [
  { stage:1, title:'Confirm booking with carrier / airline',        owner:'Ops',     days:1 },
  { stage:1, title:'Issue booking confirmation to customer',        owner:'Ops',     days:1 },
  { stage:1, title:'Collect shipper & consignee details',           owner:'Ops',     days:1 },
  { stage:2, title:'Collect commercial invoice & packing list',     owner:'Docs',    days:2 },
  { stage:2, title:'Submit shipping instructions to carrier',       owner:'Docs',    days:3 },
  { stage:2, title:'Submit VGM declaration',                        owner:'Docs',    days:4 },
  { stage:2, title:'Prepare certificate of origin (if FTA)',        owner:'Docs',    days:4 },
  { stage:3, title:'Lodge export declaration (origin)',             owner:'Customs', days:4 },
  { stage:3, title:'Obtain export release / gate pass',             owner:'Ops',     days:5 },
  { stage:4, title:'Arrange haulage to port / airport',             owner:'Ops',     days:5 },
  { stage:4, title:'Verify container seal & VGM consistency',       owner:'Ops',     days:5 },
  { stage:5, title:'Confirm vessel departure / flight uplift',      owner:'Ops',     days:6 },
  { stage:5, title:'Send departure notice to customer',             owner:'Ops',     days:6 },
  { stage:6, title:'Receive arrival notice from carrier',           owner:'Ops',     days:14 },
  { stage:6, title:'Submit manifest / pre-alert to broker',         owner:'Docs',    days:14 },
  { stage:7, title:'Lodge import declaration',                      owner:'Customs', days:15 },
  { stage:7, title:'Obtain customs release / duty payment',         owner:'Customs', days:15 },
  { stage:7, title:'Obtain delivery order from carrier',            owner:'Ops',     days:15 },
  { stage:8, title:'Arrange final-mile delivery',                   owner:'Ops',     days:16 },
  { stage:8, title:'Collect POD & customer confirmation',           owner:'Ops',     days:17 },
  { stage:9, title:'Issue freight invoice to customer',             owner:'Finance', days:18 },
  { stage:9, title:'Record supplier invoices & disbursements',      owner:'Finance', days:18 },
  { stage:10,title:'Archive job documents & close file',            owner:'Ops',     days:21 },
];

const CHARGE_PRESETS: ChargePreset[] = [
  { code:'OFR', desc:'Ocean / Air Freight',   unit:'ctr',  currency:'USD', buy:2800, sell:3400 },
  { code:'THC', desc:'Terminal Handling',     unit:'ctr',  currency:'MYR', buy:450,  sell:550  },
  { code:'DOC', desc:'Documentation Fee',     unit:'set',  currency:'MYR', buy:80,   sell:150  },
  { code:'CUS', desc:'Customs Brokerage',     unit:'decl', currency:'MYR', buy:180,  sell:350  },
  { code:'HAU', desc:'Haulage (port ↔ door)', unit:'trip', currency:'MYR', buy:600,  sell:850  },
  { code:'WHS', desc:'Warehouse Storage',     unit:'day',  currency:'MYR', buy:120,  sell:200  },
  { code:'INS', desc:'Cargo Insurance',       unit:'pol',  currency:'MYR', buy:80,   sell:140  },
  { code:'DLV', desc:'Final Mile Delivery',   unit:'trip', currency:'MYR', buy:220,  sell:380  },
];

const MILESTONE_TEMPLATES = [
  { key:'booking',   label:'Booking confirmed' },
  { key:'si',        label:'Shipping instructions submitted' },
  { key:'vgm',       label:'VGM submitted' },
  { key:'loaded',    label:'Container loaded / cargo uplifted' },
  { key:'departed',  label:'Vessel / flight departed' },
  { key:'arrived',   label:'Vessel / flight arrived' },
  { key:'discharge', label:'Discharged at destination' },
  { key:'cleared',   label:'Customs cleared' },
  { key:'delivered', label:'Delivered to consignee' },
  { key:'closed',    label:'Job closed & invoiced' },
];

const DOC_TYPES: Record<DocTypeKey, DocTypeInfo> = {
  booking:   { label:'Booking Confirmation', cls:'bol',    required:true,  stage:1 },
  si:        { label:'Shipping Instructions', cls:'pack',  required:true,  stage:2 },
  vgm:       { label:'VGM Declaration',       cls:'pack',  required:false, stage:2 },
  invoice:   { label:'Commercial Invoice',    cls:'inv',   required:true,  stage:2 },
  packing:   { label:'Packing List',          cls:'pack',  required:true,  stage:2 },
  coo:       { label:'Certificate of Origin', cls:'coo',   required:false, stage:2 },
  bol:       { label:'Bill of Lading / AWB',  cls:'bol',   required:true,  stage:5 },
  manifest:  { label:'Cargo Manifest',        cls:'pack',  required:false, stage:6 },
  arrival:   { label:'Arrival Notice',        cls:'bol',   required:false, stage:6 },
  permit:    { label:'Import Permit',         cls:'permit',required:false, stage:7 },
  do_:       { label:'Delivery Order',        cls:'permit',required:false, stage:7 },
  freightInv:{ label:'Freight Invoice',       cls:'inv',   required:false, stage:9 },
};

const ORIGINS = ['CN','SG','JP','US','DE','IN','TH','VN','ID','AU','GB','KR'];
const GLEC: Record<string, number> = { 'Sea FCL':0.016, 'Sea LCL':0.019, 'Air Freight':0.602, 'Road':0.105, 'Rail':0.028 };
const PORT_DIST: Record<string, number> = { CN:2800, SG:350, JP:5300, US:15000, DE:12000, IN:2800, TH:900, VN:1200, ID:1100, AU:5500, GB:12500, KR:4500, MY:50 };
const CARBON_PRICE = 50;
const CBAM_CODES = ['7208','7209','7210','7211','7212','7219','7220','7221','7222','7223','7229','7601','7604','7605','7606','7607','7608','7609','2523','3102','3105','2804','7308'];

const K_UI = 'brokerdesk.ui.v4';
const K_DRAFTS = 'brokerdesk.drafts.v4';
const K_SUBMITTED = 'brokerdesk.submitted.v4';
const K_IMPORTERS = 'brokerdesk.importers.v4';
const K_PRODUCTS = 'brokerdesk.products.v4';
const K_JOB = 'brokerdesk.job.v4';
const K_THEME = 'brokerdesk.theme.v4';

const CHECK_ICON: Record<CheckItem['s'], string> = { pass:'✓', warn:'!', fail:'✕', info:'i' };

/* ══════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════ */
const CSS = `
  :root{
    --navy:#0e1a2b; --navy-2:#16263d; --navy-3:#1e3350;
    --accent:#2f6bff; --accent-2:#00c2b2; --ai:#8b5cf6;
    --carbon:#16a34a; --risk:#f97316;
    --bg:#eef1f7; --card:#ffffff; --line:#e2e8f0;
    --text:#0f172a; --muted:#64748b;
    --ok:#10b981; --warn:#f59e0b; --danger:#ef4444;
    --radius:10px;
    --shadow:0 1px 2px rgba(15,23,42,.06),0 4px 14px rgba(15,23,42,.06);
    font-synthesis:none; color-scheme:light;
  }
  [data-theme="dark"]{
    --navy:#070f1a; --navy-2:#0c1626; --navy-3:#13233a;
    --accent:#4d82ff; --accent-2:#22d3c5; --ai:#a78bfa;
    --carbon:#22c55e; --risk:#fb923c;
    --bg:#070c15; --card:#0e1826; --line:#1c2b41;
    --text:#e6edf7; --muted:#8fa3bf;
    --ok:#22c55e; --warn:#fbbf24; --danger:#f87171;
    --shadow:0 1px 2px rgba(0,0,0,.5),0 8px 24px rgba(0,0,0,.4);
    color-scheme:dark;
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{
    margin:0; background:var(--bg); color:var(--text);
    font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    font-size:13.5px; -webkit-font-smoothing:antialiased;
    transition:background .2s, color .2s;
  }
  button,input,select,textarea{font-family:inherit;font-size:inherit;color:inherit}
  button{cursor:pointer}
  :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
  .app{
    --sb-w:224px; --rail-w:388px;
    display:grid;
    grid-template-columns:var(--sb-w) 1fr var(--rail-w);
    grid-template-rows:56px 1fr;
    height:100vh;
    transition:grid-template-columns .2s cubic-bezier(.4,0,.2,1);
  }
  .app.sb-collapsed{--sb-w:58px}
  .app.rail-collapsed{--rail-w:56px}
  .topbar{grid-column:1/-1;display:flex;align-items:center;gap:12px;
    background:var(--navy);color:#e8eefc;padding:0 14px;border-bottom:1px solid #0a1320;z-index:30}
  .sidebar{background:var(--navy);color:#aebbd2;padding:46px 10px 14px;overflow-y:auto;
    position:relative;transition:padding .2s}
  .main{overflow-y:auto;padding:16px 18px 96px}
  .rail{background:var(--card);border-left:1px solid var(--line);display:flex;flex-direction:column;overflow:hidden}
  .brand{display:flex;align-items:center;gap:9px;font-weight:700;letter-spacing:.2px;color:#fff;flex:0 0 auto}
  .brand .mark{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;font-size:14px;
    background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#04121f;font-weight:800}
  .brand small{display:block;font-weight:400;font-size:10px;color:#7d8fae;letter-spacing:.4px}
  .search-trigger{flex:1;max-width:440px;display:flex;align-items:center;gap:8px;
    background:#1b2c45;border:1px solid #2a3f5e;border-radius:8px;padding:7px 10px;
    color:#8ea4c4;font-size:12.5px;text-align:left;transition:.12s}
  .search-trigger:hover{border-color:#3b5880;color:#dbe6f7}
  .search-trigger svg{opacity:.7;flex:0 0 13px}
  .search-trigger span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .search-trigger kbd{font-family:ui-monospace,Menlo,monospace;font-size:10px;background:#0f1b2b;
    border:1px solid #2a3f5e;border-radius:5px;padding:1px 5px;color:#8ea4c4;flex:0 0 auto}
  .spacer{flex:1}
  .presence{display:flex;align-items:center;margin-right:2px}
  .presence .p{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;
    font-size:10px;font-weight:800;color:#fff;border:2px solid var(--navy);margin-left:-7px;
    box-shadow:0 0 0 1px rgba(0,0,0,.2)}
  .presence .p:first-child{margin-left:0}
  .presence .p.p1{background:#f97316}
  .presence .p.p2{background:#10b981}
  .presence .p.p3{background:#8b5cf6}
  .badge-env{font-size:10.5px;padding:3px 8px;border-radius:99px;background:#14324a;color:#5eead4;border:1px solid #1d4f5e;white-space:nowrap}
  .icon-btn{width:32px;height:32px;border-radius:9px;border:1px solid #2a3f5e;background:#16263d;
    color:#a9b8cf;display:grid;place-items:center;transition:.12s;position:relative}
  .icon-btn:hover{background:#1e3350;color:#fff;border-color:#3b5880}
  .icon-btn .dot-badge{position:absolute;top:-4px;right:-4px;min-width:16px;height:16px;border-radius:99px;
    background:var(--danger);color:#fff;font-size:9px;font-weight:800;display:grid;place-items:center;padding:0 4px;
    border:2px solid var(--navy)}
  .user{display:flex;align-items:center;gap:8px;font-size:12px;color:#c7d4e8;white-space:nowrap}
  .avatar{width:28px;height:28px;border-radius:50%;background:#27405f;display:grid;place-items:center;font-weight:600;color:#cfe0ff}
  .notif-wrap{position:relative}
  .notif-menu{position:absolute;top:calc(100% + 8px);right:0;width:340px;background:var(--card);
    border:1px solid var(--line);border-radius:12px;box-shadow:0 18px 44px rgba(0,0,0,.3);overflow:hidden;
    display:none;z-index:60}
  .notif-menu.open{display:block}
  .notif-menu .nm-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;
    border-bottom:1px solid var(--line);font-size:12px;font-weight:650;color:var(--text)}
  .notif-item{padding:10px 12px;border-bottom:1px solid var(--line);font-size:12px;display:flex;gap:9px;cursor:pointer}
  .notif-item:hover{background:rgba(47,107,255,.06)}
  .notif-item .ni-ico{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;flex:0 0 24px;
    font-size:11px;color:#fff;background:var(--accent)}
  .notif-item.warn .ni-ico{background:var(--warn)}
  .notif-item.ok .ni-ico{background:var(--ok)}
  .notif-item .ni-body{flex:1;min-width:0}
  .notif-item b{display:block;color:var(--text);font-weight:600;margin-bottom:1px}
  .notif-item small{color:var(--muted);font-size:10.5px}
  .sb-toggle{position:absolute;top:10px;right:10px;width:26px;height:26px;border-radius:8px;
    border:1px solid #2a3f5e;background:#16263d;color:#a9b8cf;display:grid;place-items:center;
    font-size:13px;line-height:1;transition:.15s;z-index:5}
  .sb-toggle:hover{background:#1e3350;color:#fff;border-color:#3b5880}
  .app.sb-collapsed .sidebar{padding:46px 6px 14px}
  .app.sb-collapsed .sb-toggle{right:calc(50% - 13px);transform:rotate(180deg)}
  .navgroup{margin-bottom:16px}
  .navgroup h4{margin:0 0 6px 10px;font-size:10px;letter-spacing:.9px;text-transform:uppercase;color:#5d7391;
    white-space:nowrap;overflow:hidden}
  .navitem{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;font-size:12.8px;
    color:#a9b8cf;cursor:pointer;border:1px solid transparent;user-select:none;transition:.12s}
  .navitem:hover{background:#16263d;color:#e2ecfb}
  .navitem.active{background:#1d3350;color:#fff;border-color:#27436b}
  .navitem .dot{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.55;flex:0 0 6px}
  .navitem .ini{display:none;width:24px;height:24px;border-radius:7px;background:#1b2c45;
    place-items:center;font-size:11px;font-weight:800;color:#cfe0ff;flex:0 0 24px}
  .navitem.active .ini{background:var(--accent);color:#fff}
  .navitem .lbl{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .navitem .badge{font-size:9.5px;font-weight:800;background:var(--accent);color:#fff;border-radius:99px;
    padding:1px 6px;margin-left:auto}
  .app.sb-collapsed .navgroup h4,
  .app.sb-collapsed .navitem .lbl,
  .app.sb-collapsed .navitem .dot,
  .app.sb-collapsed .navitem .badge{display:none}
  .app.sb-collapsed .navgroup{margin-bottom:8px}
  .app.sb-collapsed .navitem{justify-content:center;padding:6px 0}
  .app.sb-collapsed .navitem .ini{display:grid}
  .card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:14px}
  .card-head{display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid var(--line);flex-wrap:wrap}
  .card-head h3{margin:0;font-size:13px;font-weight:650;letter-spacing:.1px}
  .card-head .sub{font-size:11.5px;color:var(--muted)}
  .card-body{padding:14px}
  .bento{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:14px}
  .bento-tile{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 14px;
    display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow);position:relative;overflow:hidden;min-height:98px;
    transition:.15s}
  .bento-tile:hover{border-color:color-mix(in srgb, var(--accent) 40%, var(--line))}
  .bento-tile .bt-label{font-size:10px;letter-spacing:.7px;text-transform:uppercase;color:var(--muted);font-weight:650;
    display:flex;align-items:center;gap:5px}
  .bento-tile .bt-val{font-size:22px;font-weight:750;letter-spacing:-.6px;color:var(--text);
    font-variant-numeric:tabular-nums;line-height:1.1}
  .bento-tile .bt-sub{font-size:10.5px;color:var(--muted);margin-top:auto}
  .bento-tile .spark{position:absolute;right:10px;bottom:8px;width:64px;height:24px;opacity:.85}
  .bento-tile .ring{position:absolute;right:10px;top:10px;width:38px;height:38px}
  @media(max-width:1600px){.bento{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:800px){.bento{grid-template-columns:repeat(2,1fr)}}
  .insights{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
  .insights .card{margin-bottom:0}
  @media(max-width:1500px){.insights{grid-template-columns:1fr}}
  .metric-row{display:flex;gap:18px;margin-bottom:10px}
  .metric{display:flex;flex-direction:column;gap:1px}
  .metric-label{font-size:9.5px;letter-spacing:.6px;text-transform:uppercase;color:var(--muted);font-weight:650}
  .metric-val{font-size:16px;font-weight:750;color:var(--text);font-variant-numeric:tabular-nums}
  .metric-val.sm{font-size:13px}
  .meter{height:6px;border-radius:99px;background:var(--line);overflow:hidden;margin:8px 0 6px}
  .meter i{display:block;height:100%;border-radius:99px;background:var(--accent);transition:width .3s}
  .meter.carbon i{background:var(--carbon)}
  .meter.risk i{background:var(--risk)}
  .meter.ein i{background:var(--accent-2)}
  .metric-foot{font-size:10.5px;color:var(--muted);line-height:1.5}
  .risk-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
  .risk-score{font-size:26px;font-weight:800;letter-spacing:-1px;line-height:1}
  .risk-band{font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;letter-spacing:.4px;text-transform:uppercase}
  .risk-band.low{background:rgba(16,185,129,.15);color:var(--ok)}
  .risk-band.mid{background:rgba(245,158,11,.15);color:var(--warn)}
  .risk-band.high{background:rgba(239,68,68,.15);color:var(--danger)}
  .risk-reasons{list-style:none;padding:0;margin:0;font-size:11.5px;color:var(--muted);display:flex;flex-direction:column;gap:4px}
  .risk-reasons li{padding-left:14px;position:relative;line-height:1.4}
  .risk-reasons li::before{content:'•';position:absolute;left:2px;color:var(--risk);font-weight:900}
  .ein-head{display:flex;align-items:baseline;gap:6px;margin-bottom:4px}
  .ein-pct{font-size:24px;font-weight:800;letter-spacing:-.6px;color:var(--text)}
  .ein-head span{font-size:11.5px;color:var(--muted)}
  .grid{display:grid;gap:12px}
  .g4{grid-template-columns:repeat(4,1fr)}
  .g3{grid-template-columns:repeat(3,1fr)}
  .g2{grid-template-columns:repeat(2,1fr)}
  @media(max-width:1400px){.g4{grid-template-columns:repeat(2,1fr)}}
  .field{display:flex;flex-direction:column;gap:5px;min-width:0}
  .field label{font-size:10.5px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--muted)}
  .field input,.field select{padding:7px 9px;border:1px solid var(--line);border-radius:8px;background:var(--card);outline:none;width:100%}
  .field input:focus,.field select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(47,107,255,.14)}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:8px;
    border:1px solid var(--line);background:var(--card);font-weight:600;font-size:12.5px;color:var(--text);transition:.12s;text-decoration:none}
  .btn:hover{border-color:color-mix(in srgb, var(--accent) 35%, var(--line))}
  .btn-primary{background:var(--accent);border-color:var(--accent);color:#fff}
  .btn-primary:hover{filter:brightness(1.08)}
  .btn-ghost{background:transparent;border-color:transparent;color:var(--muted);padding:5px 8px}
  .btn-ghost:hover{background:rgba(47,107,255,.08);color:var(--text)}
  .btn-sm{padding:4px 9px;font-size:11.5px;border-radius:7px}
  .btn-danger:hover{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.4);color:var(--danger)}
  .btn:disabled{opacity:.45;cursor:not-allowed}
  .btn-ai{background:linear-gradient(135deg, var(--ai), var(--accent));border-color:transparent;color:#fff}
  .btn-ai:hover{filter:brightness(1.08)}
  .tablewrap{overflow-x:auto}
  table{width:100%;border-collapse:separate;border-spacing:0;min-width:920px}
  thead th{position:sticky;top:0;background:color-mix(in srgb, var(--card) 88%, var(--bg));text-align:left;font-size:10.5px;letter-spacing:.6px;
    text-transform:uppercase;color:var(--muted);font-weight:650;padding:9px 10px;border-bottom:1px solid var(--line);white-space:nowrap}
  tbody td{padding:7px 10px;border-bottom:1px solid color-mix(in srgb, var(--line) 60%, transparent);vertical-align:top}
  tbody tr:hover{background:color-mix(in srgb, var(--accent) 3%, transparent)}
  tbody tr.selected{background:color-mix(in srgb, var(--accent) 8%, transparent);box-shadow:inset 3px 0 0 var(--accent)}
  td input,td select{width:100%;padding:6px 8px;border:1px solid transparent;background:transparent;border-radius:7px;outline:none}
  td input:hover,td select:hover{border-color:var(--line);background:var(--card)}
  td input:focus,td select:focus{border-color:var(--accent);background:var(--card);box-shadow:0 0 0 3px rgba(47,107,255,.12)}
  .col-idx{width:34px;color:var(--muted);font-variant-numeric:tabular-nums;padding-top:13px!important}
  .col-desc{min-width:230px}
  .col-code{width:130px}
  .col-code input{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.4px}
  .col-origin{width:110px}
  .col-num{width:88px}
  .col-num input{text-align:right;font-variant-numeric:tabular-nums}
  .col-duty{width:112px}
  .col-act{width:118px;text-align:right}
  .duty-rate{display:flex;align-items:center;gap:3px;justify-content:flex-end}
  .duty-rate input{width:52px;text-align:right;font-variant-numeric:tabular-nums}
  .duty-amt{text-align:right;font-size:11.5px;color:var(--muted);font-variant-numeric:tabular-nums;margin-top:2px}
  .rowtools{display:flex;gap:2px;justify-content:flex-end}
  .code-chip{font-family:ui-monospace,Menlo,monospace;font-size:11px;background:rgba(47,107,255,.1);color:var(--accent);
    padding:2px 6px;border-radius:5px;display:inline-block}
  @keyframes flash{0%{background:rgba(47,107,255,.18)}100%{background:transparent}}
  tr.flash td{animation:flash 1.1s ease}
  .mini{width:100%;border-collapse:collapse;min-width:0}
  .mini thead th{position:static;background:color-mix(in srgb, var(--card) 88%, var(--bg));font-size:10.5px;letter-spacing:.5px;text-transform:uppercase;
    color:var(--muted);padding:8px 10px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}
  .mini td{padding:8px 10px;border-bottom:1px solid color-mix(in srgb, var(--line) 60%, transparent);font-size:12px;vertical-align:middle}
  .mini tr:hover td{background:color-mix(in srgb, var(--accent) 3%, transparent)}
  .mini .mono{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;color:var(--accent);white-space:nowrap}
  .stepper{display:flex;align-items:flex-start;gap:0;overflow-x:auto;padding:6px 0 4px}
  .step{flex:1;min-width:82px;display:flex;flex-direction:column;align-items:center;position:relative;
    cursor:pointer;padding:0 3px;user-select:none}
  .step::before{content:'';position:absolute;top:13px;left:0;right:50%;height:2px;background:var(--line);z-index:0}
  .step:first-child::before{display:none}
  .step::after{content:'';position:absolute;top:13px;left:50%;right:0;height:2px;background:var(--line);z-index:0}
  .step:last-child::after{display:none}
  .step.done::before,.step.done::after,.step.active::before{background:var(--accent)}
  .step-dot{width:28px;height:28px;border-radius:50%;background:var(--card);border:2px solid var(--line);
    display:grid;place-items:center;font-size:11px;font-weight:700;color:var(--muted);z-index:1;transition:.15s}
  .step.done .step-dot{background:var(--ok);border-color:var(--ok);color:#fff}
  .step.active .step-dot{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 0 0 4px rgba(47,107,255,.18)}
  .step.blocked .step-dot{background:var(--danger);border-color:var(--danger);color:#fff}
  .step-label{font-size:10.5px;font-weight:600;color:var(--muted);margin-top:6px;text-align:center;line-height:1.25}
  .step.active .step-label{color:var(--accent)}
  .step.done .step-label{color:var(--text)}
  .step-count{font-size:9.5px;color:var(--muted);margin-top:2px;font-variant-numeric:tabular-nums}
  .step:hover .step-dot{border-color:var(--accent)}
  .stage-badge{font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:99px;
    background:rgba(47,107,255,.12);color:var(--accent);border:1px solid rgba(47,107,255,.3);white-space:nowrap}
  .stage-badge.done{background:rgba(16,185,129,.12);color:var(--ok);border-color:rgba(16,185,129,.3)}
  .task{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid color-mix(in srgb, var(--line) 60%, transparent)}
  .task:last-child{border-bottom:0}
  .task input[type=checkbox]{margin-top:2px;width:16px;height:16px;accent-color:var(--accent);cursor:pointer;flex:0 0 16px}
  .task-body{flex:1;min-width:0}
  .task-title{font-size:12.5px;font-weight:600;color:var(--text);line-height:1.4}
  .task.done .task-title{text-decoration:line-through;color:var(--muted);font-weight:500}
  .task-meta{font-size:11px;color:var(--muted);margin-top:3px;display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  .task-meta select,.task-meta input[type=date]{padding:2px 6px;border:1px solid transparent;background:transparent;
    border-radius:6px;font-size:11px;outline:none;color:var(--muted)}
  .task-meta select:hover,.task-meta input[type=date]:hover{border-color:var(--line);background:var(--card)}
  .task-meta .overdue{color:var(--danger);font-weight:700}
  .task-flag{font-size:9.5px;font-weight:700;padding:1px 6px;border-radius:99px;letter-spacing:.3px;text-transform:uppercase}
  .task-flag.hot{background:rgba(245,158,11,.15);color:var(--warn)}
  .charges-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:14px;border-top:1px solid var(--line);
    background:color-mix(in srgb, var(--card) 92%, var(--bg))}
  @media(max-width:900px){.charges-summary{grid-template-columns:repeat(2,1fr)}}
  .cs{display:flex;flex-direction:column;gap:2px}
  .cs-label{font-size:10.5px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);font-weight:600}
  .cs-val{font-size:16px;font-weight:700;color:var(--text);font-variant-numeric:tabular-nums}
  .cs-val.gp{color:var(--ok)}
  .cs-val.loss{color:var(--danger)}
  .ms-list{position:relative;padding-left:22px}
  .ms-list::before{content:'';position:absolute;left:7px;top:12px;bottom:12px;width:2px;background:var(--line)}
  .ms{position:relative;padding:0 0 16px;display:flex;flex-direction:column;gap:2px}
  .ms::before{content:'';position:absolute;left:-22px;top:4px;width:16px;height:16px;border-radius:50%;
    background:var(--card);border:2px solid var(--line);z-index:1}
  .ms.done::before{background:var(--ok);border-color:var(--ok)}
  .ms.overdue::before{background:var(--card);border-color:var(--danger)}
  .ms-title{font-size:12.5px;font-weight:650;color:var(--text)}
  .ms-meta{font-size:11px;color:var(--muted);display:flex;gap:14px;flex-wrap:wrap}
  .ms-meta b{color:var(--text);font-weight:600}
  .totals{display:flex;flex-direction:column;gap:8px;padding:14px}
  .trow{display:flex;justify-content:space-between;font-size:12.8px;color:var(--muted);align-items:center;gap:12px}
  .trow span:last-child{font-variant-numeric:tabular-nums;font-weight:600;color:var(--text);white-space:nowrap}
  .trow.grand{border-top:1px dashed var(--line);padding-top:10px;margin-top:4px;font-size:15px;color:var(--text);font-weight:700}
  .trow.grand span:last-child{color:var(--accent);font-size:17px}
  .trow .mini-input{width:96px;padding:4px 8px;border:1px solid var(--line);border-radius:7px;background:var(--card);
    text-align:right;outline:none;font-variant-numeric:tabular-nums}
  .trow .cur{font-size:10.5px;color:var(--muted);font-weight:500}
  .tabs{display:flex;align-items:stretch;border-bottom:1px solid var(--line);background:color-mix(in srgb, var(--card) 92%, var(--bg))}
  .tab{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:11px 4px;text-align:center;
    font-size:11px;font-weight:600;color:var(--muted);border-bottom:2px solid transparent;background:none;
    border-top:0;border-left:0;border-right:0;white-space:nowrap;overflow:hidden}
  .tab:hover{color:var(--text);background:rgba(47,107,255,.05)}
  .tab.active{color:var(--accent);border-bottom-color:var(--accent);background:var(--card)}
  .ticon{font-size:12px;line-height:1}
  .rail-toggle{flex:0 0 30px;border:0;border-left:1px solid var(--line);background:transparent;color:var(--muted);
    font-size:12px;line-height:1;transition:.15s}
  .rail-toggle:hover{background:rgba(47,107,255,.05);color:var(--text)}
  .tabpane{display:none;padding:14px;overflow-y:auto;flex:1}
  .tabpane.active{display:block}
  .app.rail-collapsed .tabs{flex-direction:column;border-bottom:0}
  .app.rail-collapsed .tab{flex:0 0 auto;padding:13px 0;border-bottom:0;border-left:2px solid transparent}
  .app.rail-collapsed .tab.active{border-left-color:var(--accent);background:var(--card)}
  .app.rail-collapsed .tlbl{display:none}
  .app.rail-collapsed .rail-toggle{flex:0 0 30px;border-left:0;border-top:1px solid var(--line);
    width:100%;transform:rotate(180deg)}
  .app.rail-collapsed .tabpane{display:none!important}
  .hint{font-size:11.5px;color:var(--muted);line-height:1.5;margin:0 0 10px}
  .result{border:1px solid var(--line);border-radius:9px;padding:10px;margin-bottom:9px;background:var(--card);transition:.12s}
  .result:hover{border-color:color-mix(in srgb, var(--accent) 40%, var(--line))}
  .result .r-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
  .result .r-code{font-family:ui-monospace,Menlo,monospace;font-weight:700;font-size:13px;color:var(--text)}
  .result .r-desc{font-size:11.5px;color:var(--muted);margin:5px 0 7px;line-height:1.45}
  .result .r-meta{display:flex;gap:12px;font-size:11px;color:var(--muted);flex-wrap:wrap}
  .conf{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:700;color:var(--ok);white-space:nowrap}
  .conf.low{color:var(--warn)}
  .bar{width:52px;height:5px;border-radius:99px;background:var(--line);overflow:hidden}
  .bar i{display:block;height:100%;background:var(--ok);border-radius:99px}
  .conf.low .bar i{background:var(--warn)}
  .empty{text-align:center;color:var(--muted);font-size:12px;padding:26px 10px;line-height:1.6}
  .empty .big{font-size:26px;display:block;margin-bottom:8px;opacity:.35}
  .check{display:flex;gap:9px;padding:9px 0;border-bottom:1px solid color-mix(in srgb, var(--line) 60%, transparent);font-size:12.2px;line-height:1.45}
  .check:last-child{border-bottom:0}
  .check .ico{width:16px;height:16px;border-radius:50%;flex:0 0 16px;display:grid;place-items:center;
    font-size:10px;font-weight:800;color:#fff;margin-top:1px}
  .ico.pass{background:var(--ok)} .ico.warn{background:var(--warn)} .ico.fail{background:var(--danger)} .ico.info{background:#94a3b8}
  .check b{display:block;font-weight:650;color:var(--text);margin-bottom:1px}
  .check small{color:var(--muted);font-size:11.3px}
  .audit{position:relative;padding-left:16px}
  .audit:before{content:"";position:absolute;left:4px;top:6px;bottom:6px;width:1px;background:var(--line)}
  .aevent{position:relative;padding:0 0 13px 0;font-size:12px;line-height:1.45}
  .aevent:before{content:"";position:absolute;left:-16px;top:5px;width:9px;height:9px;border-radius:50%;
    background:var(--card);border:2px solid var(--accent)}
  .aevent time{display:block;font-size:10.5px;color:var(--muted);margin-top:2px}
  .cop-wrap{display:flex;flex-direction:column;height:100%;min-height:0}
  .cop-head{display:flex;align-items:center;gap:8px;padding:8px 10px;margin-bottom:8px;
    background:linear-gradient(135deg, rgba(139,92,246,.12), rgba(47,107,255,.08));
    border:1px solid rgba(139,92,246,.25);border-radius:10px}
  .cop-head .cop-ico{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--ai),var(--accent));
    display:grid;place-items:center;color:#fff;font-size:13px;flex:0 0 26px}
  .cop-head div{flex:1;min-width:0}
  .cop-head b{display:block;font-size:12px;color:var(--text)}
  .cop-head small{font-size:10.5px;color:var(--muted)}
  .cop-chat{display:flex;flex-direction:column;gap:8px;flex:1;overflow-y:auto;padding:2px 0 8px;min-height:120px;max-height:340px}
  .cop-msg{max-width:92%;padding:8px 11px;border-radius:12px;font-size:12.2px;line-height:1.45}
  .cop-msg.bot{background:color-mix(in srgb, var(--card) 88%, var(--bg));color:var(--text);
    border:1px solid var(--line);border-bottom-left-radius:4px;align-self:flex-start}
  .cop-msg.user{background:var(--accent);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
  .cop-sugg{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
  .cop-chip{font-size:11px;padding:4px 9px;border-radius:99px;border:1px solid var(--line);background:var(--card);color:var(--muted);cursor:pointer}
  .cop-chip:hover{border-color:var(--ai);color:var(--ai)}
  .cop-input{display:flex;gap:6px;border-top:1px solid var(--line);padding-top:10px}
  .cop-input input{flex:1;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--card);outline:none;font-size:12.5px}
  .cop-input input:focus{border-color:var(--ai);box-shadow:0 0 0 3px rgba(139,92,246,.14)}
  .cop-input button{padding:0 14px;border-radius:8px;border:0;background:linear-gradient(135deg,var(--ai),var(--accent));color:#fff;font-weight:700}
  .doc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
  .doc-card{position:relative;border:1px solid var(--line);border-radius:10px;padding:10px;background:var(--card);
    display:flex;gap:10px;align-items:flex-start;transition:.14s;cursor:pointer}
  .doc-card:hover{border-color:color-mix(in srgb, var(--accent) 40%, var(--line));transform:translateY(-1px);
    box-shadow:0 6px 20px rgba(0,0,0,.12)}
  .doc-thumb{width:40px;height:50px;border-radius:6px;flex:0 0 40px;display:grid;place-items:center;
    font-size:9.5px;font-weight:800;letter-spacing:.5px;border:1px solid #fca5a5;
    background:linear-gradient(160deg,#fee2e2,#fecaca);color:#b91c1c}
  .doc-card.inv .doc-thumb{background:linear-gradient(160deg,#dcfce7,#bbf7d0);border-color:#86efac;color:#15803d}
  .doc-card.pack .doc-thumb{background:linear-gradient(160deg,#dbeafe,#bfdbfe);border-color:#93c5fd;color:#1d4ed8}
  .doc-card.bol .doc-thumb{background:linear-gradient(160deg,#fef3c7,#fde68a);border-color:#fcd34d;color:#a16207}
  .doc-card.permit .doc-thumb{background:linear-gradient(160deg,#ede9fe,#ddd6fe);border-color:#c4b5fd;color:#6d28d9}
  .doc-card.coo .doc-thumb{background:linear-gradient(160deg,#cffafe,#a5f3fc);border-color:#67e8f9;color:#0e7490}
  .doc-info{min-width:0;flex:1}
  .doc-name{font-size:12px;font-weight:650;line-height:1.3;word-break:break-word;color:var(--text)}
  .doc-meta{font-size:10.5px;color:var(--muted);margin-top:3px}
  .doc-badge{display:inline-block;font-size:9.5px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;
    padding:1px 6px;border-radius:99px;background:rgba(47,107,255,.12);color:var(--accent);margin-top:6px}
  .doc-x{position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:6px;border:0;background:transparent;
    color:var(--muted);font-size:11px;line-height:1;display:grid;place-items:center;opacity:0;transition:.12s}
  .doc-card:hover .doc-x{opacity:1}
  .doc-x:hover{background:rgba(239,68,68,.12);color:var(--danger)}
  .dropzone{border:1.5px dashed var(--line);border-radius:10px;padding:16px;text-align:center;color:var(--muted);
    font-size:12px;background:color-mix(in srgb, var(--card) 92%, var(--bg));transition:.15s;cursor:pointer;margin-top:12px;line-height:1.6}
  .dropzone b{color:var(--accent)}
  .dropzone.drag{border-color:var(--accent);background:rgba(47,107,255,.08);color:var(--accent)}
  .doc-req{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
  .req-pill{font-size:10.5px;font-weight:600;padding:3px 8px;border-radius:99px;border:1px solid var(--line);
    background:var(--card);color:var(--muted)}
  .req-pill.ok{background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.35);color:var(--ok)}
  .req-pill.no{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3);color:var(--danger)}
  .actionbar{position:fixed;bottom:0;left:0;right:0;height:60px;background:var(--card);border-top:1px solid var(--line);
    display:flex;align-items:center;gap:10px;padding:0 20px;box-shadow:0 -4px 16px rgba(0,0,0,.1);z-index:25;
    flex-wrap:nowrap;overflow-x:auto}
  .actionbar .stat{font-size:12px;color:var(--muted);white-space:nowrap}
  .actionbar .stat b{color:var(--text)}
  #toasts{position:fixed;bottom:74px;right:18px;display:flex;flex-direction:column;gap:8px;z-index:90}
  .toast{background:#0f172a;color:#e8eefc;padding:10px 14px;border-radius:9px;font-size:12.5px;
    box-shadow:0 8px 24px rgba(15,23,42,.3);display:flex;gap:9px;align-items:center;
    animation:slidein .22s ease;max-width:340px;line-height:1.4}
  .toast.ok{border-left:3px solid var(--ok)} .toast.warn{border-left:3px solid var(--warn)} .toast.err{border-left:3px solid var(--danger)}
  @keyframes slidein{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
  .modal{position:fixed;inset:0;background:rgba(5,10,20,.66);backdrop-filter:blur(4px);z-index:80;display:none;
    align-items:center;justify-content:center;padding:24px}
  .modal.open{display:flex}
  .modal-shell{background:var(--card);border-radius:14px;width:min(1120px,100%);height:min(880px,100%);
    display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.5);
    animation:pop .18s ease;border:1px solid var(--line)}
  .modal-shell.sm{width:min(780px,100%);height:auto;max-height:min(820px,100%)}
  @keyframes pop{from{opacity:0;transform:scale(.975)}to{opacity:1;transform:none}}
  .modal-bar{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--line);
    background:color-mix(in srgb, var(--card) 92%, var(--bg));flex-wrap:wrap}
  .modal-bar .mtitle{font-size:13px;font-weight:650}
  .modal-bar .mmeta{font-size:11px;color:var(--muted)}
  .modal-body{flex:1;overflow:auto;background:var(--bg)}
  .modal-body.pad{padding:16px;background:var(--card)}
  #pdfFrame{width:100%;height:100%;border:0;display:block;background:#525659}
  .info-block{font-size:12.5px;line-height:1.6;color:var(--text)}
  .info-block h4{margin:16px 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:var(--muted)}
  .info-block h4:first-child{margin-top:0}
  pre.json{background:color-mix(in srgb, var(--card) 85%, var(--bg));border:1px solid var(--line);border-radius:8px;
    padding:12px;font-family:ui-monospace,Menlo,monospace;font-size:11px;line-height:1.5;max-height:420px;overflow:auto;color:var(--text)}
  .cmdk{position:fixed;inset:0;background:rgba(5,10,20,.55);backdrop-filter:blur(6px);z-index:100;
    display:none;align-items:flex-start;justify-content:center;padding:12vh 24px 24px}
  .cmdk.open{display:flex}
  .cmdk-shell{width:min(680px,100%);background:var(--card);border:1px solid var(--line);border-radius:16px;
    box-shadow:0 30px 80px rgba(0,0,0,.5);overflow:hidden;animation:pop .16s ease}
  .cmdk-head{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line)}
  .cmdk-head svg{opacity:.55}
  .cmdk-head input{flex:1;border:0;background:transparent;outline:none;font-size:14px;color:var(--text);padding:2px 0}
  .cmdk-head kbd{font-family:ui-monospace,Menlo,monospace;font-size:10px;background:color-mix(in srgb, var(--card) 85%, var(--bg));
    border:1px solid var(--line);border-radius:5px;padding:2px 6px;color:var(--muted)}
  .cmdk-list{max-height:52vh;overflow-y:auto;padding:6px}
  .cmdk-group{padding:6px 8px 4px;font-size:10px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:var(--muted)}
  .cmdk-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:9px;cursor:pointer;font-size:12.8px;color:var(--text)}
  .cmdk-item .ci{width:22px;height:22px;border-radius:7px;background:color-mix(in srgb, var(--card) 80%, var(--bg));
    display:grid;place-items:center;font-size:11px;flex:0 0 22px;color:var(--muted)}
  .cmdk-item .cl{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .cmdk-item .ch{font-size:10.5px;color:var(--muted);white-space:nowrap}
  .cmdk-item.hover,.cmdk-item:hover{background:rgba(47,107,255,.12)}
  .cmdk-item.hover .ci{background:var(--accent);color:#fff}
  .cmdk-foot{display:flex;gap:14px;padding:9px 14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--muted);
    background:color-mix(in srgb, var(--card) 92%, var(--bg))}
  .cmdk-foot kbd{font-family:ui-monospace,Menlo,monospace;font-size:10px;background:var(--card);
    border:1px solid var(--line);border-radius:4px;padding:0 4px;color:var(--muted)}
  .cmdk-empty{padding:22px;text-align:center;color:var(--muted);font-size:12px}
  .view-head{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;flex-wrap:wrap}
  .view-head h2{margin:0;font-size:17px;font-weight:700;letter-spacing:-.2px}
  .view-head p{margin:4px 0 0;font-size:12px;color:var(--muted);line-height:1.5;max-width:640px}
  .view-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
  .view-toolbar input[type=search],.view-toolbar input[type=text],.view-toolbar select{
    padding:7px 10px;border:1px solid var(--line);border-radius:8px;background:var(--card);outline:none;font-size:12.5px}
  .view-toolbar input:focus,.view-toolbar select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(47,107,255,.12)}
  .stat-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
  .chip{font-size:11.5px;font-weight:600;padding:5px 11px;border-radius:99px;background:var(--card);
    border:1px solid var(--line);color:var(--muted)}
  .chip b{color:var(--text)}
  .chip.ok{background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.35);color:var(--ok)}
  .chip.ok b{color:var(--ok)}
  .chip.warn{background:rgba(245,158,11,.12);border-color:rgba(245,158,11,.35);color:var(--warn)}
  .chip.warn b{color:var(--warn)}
  .chip.err{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3);color:var(--danger)}
  .chip.info{background:rgba(47,107,255,.1);border-color:rgba(47,107,255,.3);color:var(--accent)}
  .verdict{padding:11px 13px;border-radius:9px;font-size:12.5px;line-height:1.55;border:1px solid}
  .verdict.ok{background:rgba(16,185,129,.1);border-color:rgba(16,185,129,.35);color:var(--ok)}
  .verdict.warn{background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.35);color:var(--warn)}
  .verdict.err{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3);color:var(--danger)}
  .row-note{font-size:11.5px;color:var(--muted);line-height:1.4}
  .board{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
  .board-col{background:color-mix(in srgb, var(--card) 92%, var(--bg));border:1px solid var(--line);border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:6px;min-height:100px}
  .board-col h5{margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--muted);display:flex;justify-content:space-between;align-items:center}
  .board-card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:8px 9px;font-size:11.5px;line-height:1.35;cursor:pointer;transition:.12s}
  .board-card:hover{border-color:color-mix(in srgb, var(--accent) 40%, var(--line));box-shadow:0 2px 8px rgba(0,0,0,.1)}
  .board-card.done{opacity:.6;text-decoration:line-through}
  .board-card small{display:block;color:var(--muted);font-size:10.5px;margin-top:3px}
  [data-theme="dark"] input[type=date]::-webkit-calendar-picker-indicator{filter:invert(.8)}
  [data-theme="dark"] ::-webkit-scrollbar-thumb{background:#2a3d57}
  ::-webkit-scrollbar{width:9px;height:9px}
  ::-webkit-scrollbar-thumb{background:#c7d2e0;border-radius:9px;border:2px solid transparent;background-clip:content-box}
  ::-webkit-scrollbar-thumb:hover{background:#a8b6c9;background-clip:content-box}
  @media(prefers-reduced-motion:reduce){
    *{animation-duration:.001ms!important;transition-duration:.001ms!important}
  }
`;

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */
const num = (v: unknown): number => { const n = parseFloat(String(v)); return isFinite(n) ? n : 0; };
function fmtCur(n: number, c: string): string {
  try { return new Intl.NumberFormat('en-MY', { style:'currency', currency:c, minimumFractionDigits:2 }).format(n || 0); }
  catch { return c + ' ' + (n || 0).toFixed(2); }
}
function fmtMYR(n: number): string {
  try { return new Intl.NumberFormat('en-MY', { style:'currency', currency:'MYR', minimumFractionDigits:2 }).format(n || 0); }
  catch { return 'MYR ' + (n || 0).toFixed(2); }
}
function codeFmt(v: string): string {
  const d = String(v).replace(/[^0-9]/g, '').slice(0, 10);
  if (d.length <= 4) return d;
  if (d.length <= 6) return d.slice(0,4) + '.' + d.slice(4);
  if (d.length <= 8) return d.slice(0,4) + '.' + d.slice(4,6) + '.' + d.slice(6);
  return d.slice(0,4) + '.' + d.slice(4,6) + '.' + d.slice(6,8) + '.' + d.slice(8);
}
function kb(bytes: number): string {
  if (!bytes) return '0 KB';
  return bytes < 1024*1024 ? Math.max(1, Math.round(bytes/1024)) + ' KB' : (bytes/1048576).toFixed(1) + ' MB';
}
function nowTime(): string { return new Date().toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' }); }
function todayISO(): string { return new Date().toISOString().slice(0, 10); }
function dateAdd(iso: string, days: number): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function dateShort(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short' });
}
function escapeHtml(s: unknown): string {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c] as string));
}
function readStore<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; }
  catch { return fallback; }
}
function writeStore(key: string, value: unknown): boolean {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}
const declNumFrom = (s: string): string => s.replace(/[^0-9]/g, '') || '2026004418';
const padR = (s: string | number, n: number) => String(s).slice(0, n).padEnd(n, ' ');
const ccyRate = (c: string) => c === 'MYR' ? 1 : c === 'USD' ? 4.4 : c === 'EUR' ? 4.7 : c === 'SGD' ? 3.3 : 1;
const chargeProfit = (c: Charge) => (num(c.sellRate) - num(c.buyRate)) * num(c.qty);

/* ══════════════════════════════════════════════════════════
   PDF GENERATOR
   ══════════════════════════════════════════════════════════ */
function buildPDF(title: string, subtitle: string, rows: PdfRow[]): Blob {
  const esc = (s: unknown) => String(s)
    .replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, '');
  const ops: string[] = [];
  ops.push('BT /F2 18 Tf 54 786 Td (' + esc(title) + ') Tj ET');
  ops.push('BT /F1 10 Tf 54 766 Td (' + esc(subtitle) + ') Tj ET');
  ops.push('0.86 0.90 0.96 RG 1 w 54 754 m 541 754 l S');
  let y = 730;
  rows.forEach(r => {
    if (r && r.style === 'gap') { y -= 12; return; }
    const text = typeof r === 'string' ? r : (r.text ?? '');
    const style = r.style || 'body';
    let font = 'F1', size = 10.5, x = 54;
    if (style === 'h') { font = 'F2'; size = 11; }
    if (style === 'mono') { font = 'F3'; size = 9; }
    if (style === 'right') { x = 372; }
    if (y < 56) y = 56;
    ops.push('BT /' + font + ' ' + size + ' Tf ' + x + ' ' + y + ' Td (' + esc(text) + ') Tj ET');
    y -= (style === 'mono' ? 14 : 17);
  });
  ops.push('BT /F1 8 Tf 54 40 Td (' + esc('BrokerDesk 2026 - demonstration document') + ') Tj ET');
  const stream = ops.join('\n');
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> /Contents 4 0 R >>',
    '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offs: number[] = [];
  objs.forEach((o, i) => { offs.push(pdf.length); pdf += (i+1) + ' 0 obj\n' + o + '\nendobj\n'; });
  const xref = pdf.length;
  pdf += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n';
  offs.forEach(o => { pdf += String(o).padStart(10, '0') + ' 00000 n \n'; });
  pdf += 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
  return new Blob([pdf], { type:'application/pdf' });
}

/* ══════════════════════════════════════════════════════════
   PURE COMPUTATIONS
   ══════════════════════════════════════════════════════════ */
function classify(text: string): ClassResult[] {
  const q = (text || '').toLowerCase().trim();
  if (!q) return [];
  return HS_DB.map(item => {
    let hits = 0, max = 0;
    item.kw.forEach(k => {
      const weight = k.includes(' ') ? 2 : 1;
      max += weight;
      if (q.includes(k)) hits += weight;
    });
    const conf = max ? Math.min(97, Math.round((hits / max) * 100) + 20) : 0;
    return { ...item, hits, conf };
  }).filter(r => r.hits > 0).sort((a, b) => b.conf - a.conf).slice(0, 5);
}

function computeCarbon(job: JobHeader, decl: DeclHeader): CarbonResult {
  const factor = GLEC[job.mode] || GLEC['Sea FCL'];
  const distance = PORT_DIST[decl.defOrigin] || 3000;
  const tonnes = Math.max(0.01, num(job.kg) / 1000 || 1);
  const kg = tonnes * distance * factor;
  const tCO2e = kg / 1000;
  const cost = tCO2e * CARBON_PRICE;
  const intensity = (kg / (tonnes * distance || 1)) * 1000;
  return { mode: job.mode, origin: decl.defOrigin, distance, tonnes, kg, tCO2e, cost, factor, intensity };
}

function computeRisk(job: JobHeader, decl: DeclHeader, lines: Line[], docs: Doc[], tasks: Task[], stage: number): RiskResult {
  let score = 12;
  const reasons: string[] = [];
  const today = new Date(new Date().toDateString());
  if (!job.booking) { score += 12; reasons.push('No carrier booking reference captured'); }
  if (job.atd && job.etd && new Date(job.atd) > new Date(job.etd)) { score += 18; reasons.push('Departed after planned ETD'); }
  if (!job.atd && job.etd && new Date(job.etd) < today) { score += 14; reasons.push('ETD passed without recorded departure'); }
  if (!job.ata && job.eta && new Date(job.eta) < today) { score += 12; reasons.push('ETA passed without recorded arrival'); }
  const present = new Set(docs.map(d => d.type));
  const missingReq = (Object.entries(DOC_TYPES) as [DocTypeKey, DocTypeInfo][]).filter(([k, v]) => v.required && !present.has(k));
  if (missingReq.length) { score += missingReq.length * 6; reasons.push(missingReq.length + ' required document(s) missing'); }
  const openStageTasks = tasks.filter(t => t.stage === stage && !t.done).length;
  if (openStageTasks) { score += Math.min(18, openStageTasks * 4); reasons.push(openStageTasks + ' open task(s) on current stage'); }
  const unclassified = lines.filter(i => !i.code).length;
  if (unclassified) { score += unclassified * 4; reasons.push(unclassified + ' line(s) unclassified'); }
  if (!job.pol || !job.pod) { score += 6; reasons.push('Routing incomplete'); }
  score = Math.min(95, Math.round(score));
  const band: 'low' | 'mid' | 'high' = score < 30 ? 'low' : score < 60 ? 'mid' : 'high';
  const confidence = Math.min(95, 60 + docs.length * 4 + tasks.filter(t => t.done).length * 2);
  if (!reasons.length) reasons.push('All key indicators within tolerance');
  return { score, band, reasons, confidence };
}

function computeEInvoice(decl: DeclHeader, lines: Line[], job: JobHeader): EInvResult {
  const checks: EInvCheck[] = [];
  const add = (label: string, ok: boolean, detail: string) => checks.push({ label, ok, detail });
  add('Supplier TIN', true, 'C2584563200');
  add('Buyer TIN', !!decl.importer, decl.importer ? 'Matched in registry' : 'Required');
  add('Invoice date', !!decl.declDate, decl.declDate || 'Missing');
  add('Currency code', !!decl.currency, decl.currency);
  add('Line items', lines.length > 0, lines.length + ' line(s)');
  add('HS classification codes', lines.every(i => i.code && i.code.replace(/[^0-9]/g, '').length >= 6), 'Every line carries a tariff code');
  add('Tax scheme (SST)', decl.taxRate >= 0, 'SST ' + decl.taxRate + '%');
  add('Buyer address', !!(job.consignee || decl.importer), 'Present');
  add('Digital signature', true, 'Simulated — signed with RA key');
  const ok = checks.filter(c => c.ok).length;
  const pct = Math.round((ok / checks.length) * 100);
  const missing = checks.filter(c => !c.ok).map(c => c.label);
  return { checks, pct, missing, ok, total: checks.length };
}

function chargesTotals(charges: Charge[]): ChargesTotals {
  let buyMYR = 0, sellMYR = 0;
  charges.forEach(c => {
    const r = ccyRate(c.currency);
    buyMYR += num(c.buyRate) * num(c.qty) * r;
    sellMYR += num(c.sellRate) * num(c.qty) * r;
  });
  const gp = sellMYR - buyMYR;
  const margin = sellMYR > 0 ? (gp / sellMYR) * 100 : 0;
  return { buyMYR, sellMYR, gp, margin };
}

function computeChecks(
  lines: Line[], docs: Doc[], decl: DeclHeader, tasks: Task[],
  charges: Charge[], stage: number, ein: EInvResult,
): CheckItem[] {
  const checks: CheckItem[] = [];
  checks.push(lines.length
    ? { s:'pass', t:'Line items present', d:`${lines.length} line item(s) captured.` }
    : { s:'fail', t:'No line items', d:'At least one line item is required to lodge a declaration.' });
  const missingCode = lines.filter(l => !l.code.trim());
  checks.push(missingCode.length
    ? { s:'fail', t:'HS code missing', d:`${missingCode.length} line(s) have no HS code assigned.` }
    : { s:'pass', t:'HS codes assigned', d:'All lines carry a tariff classification.' });
  const badCode = lines.filter(l => { const d = l.code.replace(/[^0-9]/g, ''); return d.length > 0 && d.length < 8; });
  if (badCode.length) checks.push({ s:'warn', t:'Short tariff codes', d:`${badCode.length} line(s) use fewer than 8 digits. Confirm the national subheading.` });
  const zeroVal = lines.filter(l => l.val <= 0);
  checks.push(zeroVal.length
    ? { s:'warn', t:'Zero / missing value', d:`${zeroVal.length} line(s) have a unit value of 0. Verify the customs value basis.` }
    : { s:'pass', t:'Customs value declared', d:'All lines carry a positive unit value.' });
  const noOrigin = lines.filter(l => !l.origin);
  checks.push(noOrigin.length
    ? { s:'fail', t:'Origin not declared', d:'Preferential treatment cannot be assessed without country of origin.' }
    : { s:'pass', t:'Origin declared', d:'All lines carry a country of origin.' });
  const flagged: { code: string; note: string }[] = [];
  lines.forEach(l => {
    const entry = HS_DB.find(h => h.code === l.code.trim());
    if (entry && entry.notes.length) flagged.push({ code: entry.code, note: entry.notes[0] });
  });
  checks.push(flagged.length
    ? { s:'warn', t:'Permit / standards check required', d: flagged.map(f => `${f.code} — ${escapeHtml(f.note)}`).join('<br>') }
    : { s:'pass', t:'No permit triggers detected', d:'No restricted or standards-controlled goods identified.' });
  const ftaCandidates = lines.filter(l => ['CN','JP','KR','AU','VN','SG','TH','ID','IN'].includes(l.origin) && l.rate > 0);
  if (ftaCandidates.length) checks.push({ s:'info', t:'Preferential duty opportunity', d:`${ftaCandidates.length} line(s) originate in FTA partner countries but carry a non-zero duty rate. Check origin criteria.` });
  const present = new Set(docs.map(d => d.type));
  const missingDocs = (Object.entries(DOC_TYPES) as [DocTypeKey, DocTypeInfo][]).filter(([k, v]) => v.required && !present.has(k)).map(([, v]) => v.label);
  checks.push(missingDocs.length
    ? { s:'fail', t:'Required documents missing', d:'Attach: ' + missingDocs.join(', ') + '.' }
    : { s:'pass', t:'Supporting documents complete', d:'Booking, SI, invoice, packing list and transport document are attached.' });
  const stageOpen = tasks.filter(t => t.stage === stage && !t.done).length;
  checks.push({ s: stageOpen ? 'warn' : 'pass', t:'Current stage tasks', d: stageOpen ? `${stageOpen} open task(s) on stage "${STAGES[stage-1].name}".` : `All tasks on stage "${STAGES[stage-1].name}" are complete.` });
  const negativeProfit = charges.filter(c => chargeProfit(c) < 0);
  if (negativeProfit.length) checks.push({ s:'warn', t:'Negative margin charge(s)', d:`${negativeProfit.length} charge(s) are priced below buy rate. Review before invoicing.` });
  const headerOk = decl.importer && decl.incoterm && decl.declDate && decl.port;
  checks.push(headerOk
    ? { s:'pass', t:'Declaration header complete', d:'Importer, port, Incoterm and declaration date captured.' }
    : { s:'fail', t:'Declaration header incomplete', d:'Importer, port, Incoterm and declaration date are mandatory.' });
  const fx = decl.fxRate;
  if (decl.currency !== 'MYR' && (!fx || fx === 1))
    checks.push({ s:'warn', t:'Exchange rate looks unconverted', d:'Declaration currency is not MYR but the exchange rate is 1.0000. Confirm the rate applied.' });
  if (ein.missing.length) checks.push({ s:'info', t:'e-Invoice fields pending', d:'MyInvois readiness at ' + ein.pct + '%. Missing: ' + ein.missing.join(', ') + '.' });
  return checks;
}

/* ══════════════════════════════════════════════════════════
   SMALL UTILITIES
   ══════════════════════════════════════════════════════════ */
function NumInput({ value, onChange, className, step, min, style, placeholder }: {
  value: number; onChange: (n: number) => void; className?: string; step?: number; min?: number; style?: React.CSSProperties; placeholder?: string;
}) {
  const [text, setText] = useState<string>(value === 0 ? '' : String(value));
  const focused = useRef(false);
  useEffect(() => { if (!focused.current) setText(value === 0 ? '' : String(value)); }, [value]);
  return (
    <input type="number" min={min} step={step} className={className} style={style} placeholder={placeholder}
      value={text}
      onChange={e => { setText(e.target.value); onChange(num(e.target.value)); }}
      onFocus={() => { focused.current = true; }}
      onBlur={() => { focused.current = false; setText(value === 0 ? '' : String(value)); }} />
  );
}

/* ══════════════════════════════════════════════════════════
   SAMPLE DOC ROW BUILDERS
   ══════════════════════════════════════════════════════════ */
function sampleBookingRows(job: JobHeader, decl: DeclHeader): PdfRow[] {
  return [
    { text:'BOOKING CONFIRMATION', style:'h' },
    'Booking Ref   : ' + (job.booking || 'BKG-2026-' + declNumFrom(job.jobNo).slice(-4)),
    'Carrier       : ' + (job.carrier || 'Maersk Line'),
    'Vessel / Voy  : ' + (job.vessel || 'MV OCEAN HARVEST / 014E'),
    'Port of Load  : ' + (job.pol || 'Yantian, CN'),
    'Port of Disch : ' + (job.pod || 'Port Klang, MY'),
    'ETD           : ' + (job.etd || todayISO()),
    'ETA           : ' + (job.eta || dateAdd(todayISO(), 12)),
  ];
}
function sampleSIRows(job: JobHeader, decl: DeclHeader): PdfRow[] {
  return [
    { text:'SHIPPING INSTRUCTIONS', style:'h' },
    'Job           : ' + job.jobNo,
    'Shipper       : ' + (job.shipper || 'Shenzhen Yuanhe Trading Co., Ltd'),
    'Consignee     : ' + (job.consignee || decl.importer),
    { text:'', style:'gap' },
    'Cargo details per attached packing list.',
    'Freight terms : ' + decl.incoterm,
  ];
}
function sampleInvoiceRows(lines: Line[], decl: DeclHeader, job: JobHeader): PdfRow[] {
  const cur = decl.currency;
  const rows: PdfRow[] = [
    { text:'COMMERCIAL INVOICE', style:'h' },
    'Invoice No : INV-' + declNumFrom(job.jobNo),
    'Invoice Date: ' + (decl.declDate || todayISO()),
    'Seller      : ' + (job.shipper || 'Shenzhen Yuanhe Trading Co., Ltd, CN'),
    'Buyer       : ' + decl.importer,
    'Terms       : ' + decl.incoterm + '    Currency: ' + cur,
    { text:'', style:'gap' },
    { text:'NO  DESCRIPTION                                  QTY    UNIT        AMOUNT', style:'mono' },
  ];
  let total = 0;
  const items = lines.length ? lines : [{ id:0, desc:'Sample goods', code:'', origin:'CN', qty:1, val:100, rate:0 }];
  items.forEach((it, i) => {
    const amt = it.qty * it.val; total += amt;
    rows.push({ text: padR(i+1, 2) + '  ' + padR(it.desc, 44) + '  ' + padR(it.qty, 5) + '  ' + padR(it.val.toFixed(2), 9) + '  ' + amt.toFixed(2), style:'mono' });
  });
  rows.push({ text:'', style:'gap' });
  rows.push({ text:'TOTAL INVOICE VALUE: ' + cur + ' ' + total.toFixed(2), style:'h' });
  return rows;
}
function samplePackingRows(lines: Line[], decl: DeclHeader, job: JobHeader): PdfRow[] {
  const rows: PdfRow[] = [
    { text:'PACKING LIST', style:'h' },
    'Packing List No: PL-' + declNumFrom(job.jobNo),
    'Shipper        : ' + (job.shipper || 'Shenzhen Yuanhe Trading Co., Ltd, CN'),
    'Consignee      : ' + decl.importer,
    'Port of Loading: ' + (job.pol || 'Yantian, CN'),
    'Port of Disch. : ' + (job.pod || decl.port),
    { text:'', style:'gap' },
    { text:'NO  DESCRIPTION                                  CTNS   QTY    N.W.(KG)', style:'mono' },
  ];
  const items = lines.length ? lines : [{ id:0, desc:'Sample goods', code:'', origin:'CN', qty:1, val:100, rate:0 }];
  items.forEach((it, i) => {
    const ctns = Math.max(1, Math.round(it.qty / 50));
    const nw = (it.qty * 0.35).toFixed(1);
    rows.push({ text: padR(i+1, 2) + '  ' + padR(it.desc, 44) + '  ' + padR(ctns, 5) + '  ' + padR(it.qty, 6) + '  ' + padR(nw, 8), style:'mono' });
  });
  return rows;
}
function sampleBolRows(job: JobHeader, decl: DeclHeader): PdfRow[] {
  return [
    { text:'BILL OF LADING', style:'h' },
    'B/L No        : ' + (job.ctr || 'MYPKG-88213'),
    'Carrier       : ' + (job.carrier || 'Pacific Meridian Line Pte Ltd'),
    'Vessel / Voy  : ' + (job.vessel || 'MV OCEAN HARVEST / 014E'),
    'Port of Load  : ' + (job.pol || 'Yantian, CN'),
    'Port of Disch : ' + (job.pod || decl.port),
    'Container No  : ' + (job.ctr || 'MSKU 4471823') + ' / ' + job.ctrType,
    { text:'', style:'gap' },
    'SHIPPED ON BOARD in apparent good order and condition.',
  ];
}
function sampleCooRows(decl: DeclHeader, job: JobHeader): PdfRow[] {
  return [
    { text:'CERTIFICATE OF ORIGIN', style:'h' },
    'Certificate No: COO-' + declNumFrom(job.jobNo),
    'Exporter      : ' + (job.shipper || 'Shenzhen Yuanhe Trading Co., Ltd'),
    'Consignee     : ' + decl.importer,
    'Country of Origin: ' + decl.defOrigin,
    'Country of Destination: MALAYSIA',
    { text:'', style:'gap' },
    'Preferential scheme: ATIGA / RCEP (as applicable)',
  ];
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════════════════ */
export default function App() {
  /* ---------- Theme ---------- */
  const [theme, setTheme] = useState<Theme>(() => readStore(K_THEME, 'auto') as Theme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const compute = () => {
      const resolved = theme === 'auto'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      setResolvedTheme(resolved);
      document.documentElement.setAttribute('data-theme', resolved);
    };
    compute();
    writeStore(K_THEME, theme);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'auto') compute(); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const resolved = resolvedTheme;
      return resolved === 'dark' ? 'light' : 'dark';
    });
  }, [resolvedTheme]);

  /* ---------- UI collapse ---------- */
  const [sbCollapsed, setSbCollapsed] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  useEffect(() => {
    const ui = readStore<{ sb?: boolean; rail?: boolean }>(K_UI, {});
    setSbCollapsed(!!ui.sb);
    setRailCollapsed(!!ui.rail);
  }, []);
  useEffect(() => { writeStore(K_UI, { sb: sbCollapsed, rail: railCollapsed }); }, [sbCollapsed, railCollapsed]);

  /* ---------- Navigation ---------- */
  const [view, setView] = useState<ViewKey>('studio');
  const [railTab, setRailTab] = useState<RailTab>('copilot');

  /* ---------- Toasts ---------- */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastSeq = useRef(0);
  const pushToast = useCallback((msg: string, kind: ToastKind = 'ok') => {
    const id = ++toastSeq.current;
    setToasts(t => [...t, { id, msg, kind }]);
    window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3400);
  }, []);

  /* ---------- Audit ---------- */
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const logAudit = useCallback((text: string) => {
    setAudit(a => [{ text, time: nowTime() }, ...a]);
  }, []);

  /* ---------- Job header ---------- */
  const [job, setJobState] = useState<JobHeader>(() => ({
    jobNo: 'JOB-2026-004418',
    direction: 'Import',
    mode: 'Sea FCL',
    booking: 'BKG-2026-' + String(Math.floor(1000 + Math.random() * 8999)),
    custRef: '',
    shipper: 'Shenzhen Yuanhe Trading Co., Ltd',
    consignee: '',
    notify: '',
    carrier: 'Maersk Line',
    vessel: 'MV OCEAN HARVEST / 014E',
    pol: 'Yantian, CN',
    pod: 'Port Klang, MY',
    delivery: 'Kuala Lumpur',
    etd: dateAdd(todayISO(), 2),
    eta: dateAdd(todayISO(), 14),
    atd: '',
    ata: '',
    ctr: 'MSKU 4471823',
    ctrType: '40HC',
    pkgs: 2450,
    kg: 18420,
    cbm: 58.4,
    chg: 18420,
    sales: 'Aisyah Rahman',
    ops: 'Daniel Tan',
  }));
  const setJob = useCallback((patch: Partial<JobHeader>) => setJobState(prev => ({ ...prev, ...patch })), []);

  /* ---------- Declaration header ---------- */
  const [decl, setDeclState] = useState<DeclHeader>({
    importer: 'Northwind Electronics Sdn Bhd',
    defOrigin: 'CN',
    port: 'Port Klang (West) — MYPKG',
    incoterm: 'CIF',
    currency: 'MYR',
    fxRate: 1,
    taxRate: 10,
    declDate: todayISO(),
    otherCharges: 0,
  });
  const setDecl = useCallback((patch: Partial<DeclHeader>) => setDeclState(prev => ({ ...prev, ...patch })), []);

  /* ---------- Stage ---------- */
  const [stage, setStageState] = useState<number>(() => {
    const saved = readStore<{ job?: { stage: number } } | null>(K_JOB, null);
    return saved?.job?.stage ?? 1;
  });

  /* ---------- Tasks / Charges / Milestones ---------- */
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = readStore<{ tasks?: Task[] } | null>(K_JOB, null);
    if (saved?.tasks?.length) return saved.tasks;
    return DEFAULT_TASKS.map((t, i) => ({
      id: 'T' + (i + 1),
      stage: t.stage,
      title: t.title,
      owner: t.owner,
      due: dateAdd(todayISO(), t.days),
      done: false,
    }));
  });
  const [charges, setCharges] = useState<Charge[]>(() => {
    const saved = readStore<{ charges?: Charge[] } | null>(K_JOB, null);
    if (saved?.charges?.length) return saved.charges;
    return [
      { code:'OFR', desc:'Ocean / Air Freight', qty:1, unit:'ctr',  buyRate:2800, sellRate:3400, currency:'USD' },
      { code:'THC', desc:'Terminal Handling',   qty:1, unit:'ctr',  buyRate:450,  sellRate:550,  currency:'MYR' },
      { code:'CUS', desc:'Customs Brokerage',   qty:1, unit:'decl', buyRate:180,  sellRate:350,  currency:'MYR' },
    ];
  });
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = readStore<{ milestones?: Milestone[] } | null>(K_JOB, null);
    if (saved?.milestones?.length) return saved.milestones;
    return MILESTONE_TEMPLATES.map(m => ({ key: m.key, label: m.label, planned: '', actual: '' }));
  });

  /* ---------- Lines / Docs ---------- */
  const [lines, setLines] = useState<Line[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [flashId, setFlashId] = useState<number | null>(null);
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const lineSeq = useRef(0);
  const docSeq = useRef(0);
  const flashTimer = useRef<number | null>(null);

  /* ---------- Classification ---------- */
  const [classifyInput, setClassifyInput] = useState('');
  const [classifyStatus, setClassifyStatus] = useState<'idle' | 'loading' | 'no-input' | 'no-match' | 'done'>('idle');
  const [classifyResults, setClassifyResults] = useState<ClassResult[]>([]);

  /* ---------- Copilot ---------- */
  const [copMsgs, setCopMsgs] = useState<CopMsg[]>([{
    role: 'bot',
    html: 'Hi — I\'m your <b>Shipment Copilot</b>. I can classify lines, check compliance, advance stages, estimate carbon and delay risk, or prepare the e-invoice. Try <i>autopilot</i> or ask <i>what\'s blocking lodging?</i>',
  }]);
  const [copInput, setCopInput] = useState('');

  /* ---------- Command palette ---------- */
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [paletteIdx, setPaletteIdx] = useState(0);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  /* ---------- Notifications ---------- */
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifUnread, setNotifUnread] = useState(3);

  /* ---------- Modals ---------- */
  const [viewerDoc, setViewerDoc] = useState<Doc | null>(null);
  const [info, setInfo] = useState<{ title: string; body: React.ReactNode } | null>(null);

  /* ---------- Persisted job load ---------- */
  useEffect(() => {
    const saved = readStore<{
      job?: JobHeader; header?: Partial<JobHeader>; items?: Line[];
      charges?: Charge[]; tasks?: Task[]; milestones?: Milestone[];
    } | null>(K_JOB, null);
    if (!saved) return;
    if (saved.job) setJobState(prev => ({ ...prev, ...saved.job }));
    if (saved.header) setJobState(prev => ({ ...prev, ...(saved.header as Partial<JobHeader>) }));
    if (saved.items) {
      const newLines: Line[] = saved.items.map(it => ({ ...it, id: ++lineSeq.current }));
      setLines(newLines);
    }
    logAudit('Previous job restored from local storage.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Persistence ---------- */
  const persistJob = useCallback(() => {
    writeStore(K_JOB, { job: { ...job, stage }, header: job, tasks, charges, milestones, items: lines });
  }, [job, stage, tasks, charges, milestones, lines]);

  const lastSaveRef = useRef<string>('');
  useEffect(() => {
    const snapshot = JSON.stringify({ job, stage, tasks, charges, milestones, lines });
    if (snapshot !== lastSaveRef.current) {
      lastSaveRef.current = snapshot;
      writeStore(K_JOB, { job: { ...job, stage }, header: job, tasks, charges, milestones, items: lines });
    }
  }, [job, stage, tasks, charges, milestones, lines]);

  /* ---------- Derived values ---------- */
  const carbon = useMemo(() => computeCarbon(job, decl), [job, decl]);
  const risk = useMemo(() => computeRisk(job, decl, lines, docs, tasks, stage), [job, decl, lines, docs, tasks, stage]);
  const ein = useMemo(() => computeEInvoice(decl, lines, job), [decl, lines, job]);
  const chargesTot = useMemo(() => chargesTotals(charges), [charges]);
  const checks = useMemo(() => computeChecks(lines, docs, decl, tasks, charges, stage, ein), [lines, docs, decl, tasks, charges, stage, ein]);
  const fails = checks.filter(c => c.s === 'fail').length;

  const totals = useMemo(() => {
    const fx = num(decl.fxRate) || 1;
    let totalValue = 0, totalDutyMYR = 0;
    lines.forEach(l => {
      const lv = l.qty * l.val;
      totalValue += lv;
      totalDutyMYR += lv * fx * l.rate / 100;
    });
    const valueMYR = totalValue * fx;
    const tax = (valueMYR + totalDutyMYR) * decl.taxRate / 100;
    const other = decl.otherCharges;
    const grand = valueMYR + totalDutyMYR + tax + other;
    return { totalValue, totalDutyMYR, valueMYR, tax, other, grand, fx };
  }, [lines, decl]);

  const unclassifiedCount = lines.filter(l => !l.code).length;

  /* ---------- Line operations ---------- */
  const addLine = useCallback((data: Partial<Line> = {}) => {
    const id = ++lineSeq.current;
    setLines(ls => [...ls, {
      id,
      desc: data.desc ?? '',
      code: data.code ?? '',
      origin: data.origin ?? decl.defOrigin,
      qty: data.qty ?? 1,
      val: data.val ?? 0,
      rate: data.rate ?? 0,
    }]);
    return id;
  }, [decl.defOrigin]);

  const updateLine = useCallback((id: number, patch: Partial<Line>) => {
    setLines(ls => ls.map(l => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const removeLine = useCallback((id: number) => {
    setLines(ls => ls.filter(l => l.id !== id));
    setActiveId(a => (a === id ? null : a));
    logAudit('Line item removed.');
  }, [logAudit]);

  const duplicateLine = useCallback((id: number) => {
    setLines(ls => {
      const src = ls.find(l => l.id === id);
      if (!src) return ls;
      const newId = ++lineSeq.current;
      return [...ls, { ...src, id: newId }];
    });
    logAudit('Line duplicated.');
    pushToast('Line duplicated.');
  }, [logAudit, pushToast]);

  const selectLine = useCallback((id: number) => {
    setActiveId(id);
    const line = lines.find(l => l.id === id);
    if (line) setClassifyInput(line.desc);
  }, [lines]);

  const applyCodeToLine = useCallback((id: number, code: string, rate: number, source?: string) => {
    setLines(ls => {
      const line = ls.find(l => l.id === id);
      if (!line) { pushToast('That line no longer exists.', 'warn'); return ls; }
      const idx = ls.indexOf(line) + 1;
      logAudit(`Applied HS <b>${code}</b> (${rate}% duty) to line ${idx}${source ? ` — ${source}` : ''}.`);
      return ls.map(l => l.id === id ? { ...l, code, rate } : l);
    });
    setFlashId(id);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlashId(null), 1100);
  }, [logAudit, pushToast]);

  /* ---------- Docs ---------- */
  const addDoc = useCallback(({ name, type, blob, pages = 1, source = 'attached' }: {
    name: string; type: DocTypeKey; blob: Blob; pages?: number; source?: 'attached' | 'sample';
  }) => {
    const id = ++docSeq.current;
    const url = URL.createObjectURL(blob);
    setDocs(ds => [...ds, { id, name, type, blob, url, pages, source, size: blob.size, added: nowTime() }]);
    logAudit(`Document attached: <b>${escapeHtml(name)}</b> (${DOC_TYPES[type].label}).`);
  }, [logAudit]);

  const removeDoc = useCallback((id: number) => {
    setDocs(ds => {
      const d = ds.find(x => x.id === id);
      if (!d) return ds;
      try { URL.revokeObjectURL(d.url); } catch { /* noop */ }
      logAudit(`Document removed: <b>${escapeHtml(d.name)}</b>.`);
      return ds.filter(x => x.id !== id);
    });
    pushToast('Document removed.', 'warn');
  }, [logAudit, pushToast]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!arr.length) return;
    let added = 0;
    arr.forEach(f => {
      const isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
      if (!isPdf) { pushToast(`"${f.name}" is not a PDF — skipped.`, 'err'); return; }
      const guess: DocTypeKey = /book/i.test(f.name) ? 'booking'
        : /\bsi\b|shipping.?instr/i.test(f.name) ? 'si'
        : /vgm/i.test(f.name) ? 'vgm'
        : /inv/i.test(f.name) ? 'invoice'
        : /pack/i.test(f.name) ? 'packing'
        : /(bol|b\/l|awb|lading)/i.test(f.name) ? 'bol'
        : /manifest/i.test(f.name) ? 'manifest'
        : /arriv/i.test(f.name) ? 'arrival'
        : /permit|licen/i.test(f.name) ? 'permit'
        : /(do|delivery.?order)/i.test(f.name) ? 'do_'
        : /coo|origin/i.test(f.name) ? 'coo'
        : /freight/i.test(f.name) ? 'freightInv' : 'invoice';
      addDoc({ name: f.name, type: guess, blob: f, pages: 1, source: 'attached' });
      added++;
    });
    if (added) pushToast(`${added} PDF document(s) attached.`);
  }, [addDoc, pushToast]);

  const loadSampleDocs = useCallback(() => {
    const n = job.jobNo;
    const items: { name: string; type: DocTypeKey; rows: PdfRow[] }[] = [
      { name: 'Booking_' + n + '.pdf', type: 'booking', rows: sampleBookingRows(job, decl) },
      { name: 'SI_' + n + '.pdf', type: 'si', rows: sampleSIRows(job, decl) },
      { name: 'Invoice_INV-' + declNumFrom(job.jobNo).slice(-6) + '.pdf', type: 'invoice', rows: sampleInvoiceRows(lines, decl, job) },
      { name: 'PackingList_PL-' + declNumFrom(job.jobNo).slice(-6) + '.pdf', type: 'packing', rows: samplePackingRows(lines, decl, job) },
      { name: 'BillOfLading_' + (job.ctr || 'MYPKG-88213') + '.pdf', type: 'bol', rows: sampleBolRows(job, decl) },
      { name: 'CertificateOfOrigin_COO-' + declNumFrom(job.jobNo).slice(-6) + '.pdf', type: 'coo', rows: sampleCooRows(decl, job) },
    ];
    items.forEach(d => {
      const blob = buildPDF(d.name.replace(/\.pdf$/i, '').replace(/_/g, ' '), 'Shipment ' + n + '  |  ' + (job.shipper || 'Exporter'), d.rows);
      addDoc({ name: d.name, type: d.type, blob, pages: 1, source: 'sample' });
    });
    pushToast('Sample forwarder document set generated (6 PDFs).');
    logAudit('Sample document set generated for job <b>' + n + '</b>.');
  }, [job, decl, lines, addDoc, pushToast, logAudit]);

  /* ---------- Classification ---------- */
  const runClassification = useCallback((textOverride?: string) => {
    const text = textOverride !== undefined ? textOverride : classifyInput;
    if (!text.trim()) { setClassifyResults([]); setClassifyStatus('no-input'); return; }
    setClassifyStatus('loading');
    window.setTimeout(() => {
      const res = classify(text);
      setClassifyResults(res);
      if (!res.length) {
        setClassifyStatus('no-match');
        logAudit(`Classification attempted — <b>no match</b> for "${escapeHtml(text.slice(0, 60))}"`);
        pushToast('No match found. Manual classification required.', 'warn');
      } else {
        setClassifyStatus('done');
        logAudit(`AI classification run — ${res.length} candidate code(s) returned for "${escapeHtml(text.slice(0, 50))}"`);
      }
    }, 320);
  }, [classifyInput, logAudit, pushToast]);

  const applyClassifyResult = useCallback((r: ClassResult) => {
    if (activeId == null) { pushToast('Select a line item first.', 'warn'); return; }
    applyCodeToLine(activeId, r.code, r.duty, 'AI confidence ' + r.conf + '%');
    pushToast(`Applied ${r.code}.`);
    r.notes.forEach(n => pushToast(n, 'warn'));
  }, [activeId, applyCodeToLine, pushToast]);

  const autoClassifyAll = useCallback(() => {
    if (!lines.length) { pushToast('Add at least one line first.', 'warn'); return; }
    let applied = 0, unmatched = 0;
    const updates: { id: number; code: string; rate: number }[] = [];
    lines.forEach(l => {
      if (!l.desc.trim()) { unmatched++; return; }
      const best = classify(l.desc)[0];
      if (!best) { unmatched++; return; }
      updates.push({ id: l.id, code: best.code, rate: best.duty });
      applied++;
    });
    setLines(ls => ls.map(l => {
      const u = updates.find(x => x.id === l.id);
      return u ? { ...l, code: u.code, rate: u.rate } : l;
    }));
    logAudit(`Auto-classification sweep completed — ${applied} line(s) classified, ${unmatched} unmatched.`);
    if (applied) pushToast(`${applied} line(s) auto-classified.`);
    if (unmatched) pushToast(`${unmatched} line(s) could not be matched — review manually.`, 'warn');
  }, [lines, logAudit, pushToast]);

  /* ---------- Stage ---------- */
  const setStage = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(STAGES.length, n));
    const prev = stage;
    setStageState(clamped);
    if (prev !== clamped) logAudit(`Stage changed from <b>${STAGES[prev-1].name}</b> to <b>${STAGES[clamped-1].name}</b>.`);
  }, [stage, logAudit]);

  const advanceStage = useCallback(() => {
    const stageTasks = tasks.filter(t => t.stage === stage);
    const incomplete = stageTasks.filter(t => !t.done);
    if (incomplete.length && !window.confirm(`${incomplete.length} task(s) on "${STAGES[stage-1].name}" are still open. Advance anyway?`)) return;
    if (stage >= STAGES.length) { pushToast('Job already at final stage.', 'warn'); return; }
    setStage(stage + 1);
    pushToast('Advanced to ' + STAGES[stage].name + '.');
  }, [tasks, stage, setStage, pushToast]);

  /* ---------- Sample lines ---------- */
  const loadSample = useCallback(() => {
    if (sampleLoaded) { pushToast('Sample already loaded.', 'warn'); return; }
    const samples: Partial<Line>[] = [
      { desc:'Wireless Bluetooth headphones with charging case', code:'8518.30.00', origin:'CN', qty:500,  val:42.50,  rate:0 },
      { desc:"Men's cotton knitted t-shirts, short sleeve",      code:'6109.10.00', origin:'VN', qty:1200, val:18.90,  rate:10 },
      { desc:'Laptop computer, 14 inch, 1.3 kg, 16GB RAM',       code:'8471.30.00', origin:'CN', qty:75,   val:3150.00, rate:0 },
      { desc:'USB-C charging cable 2m, with connectors',         code:'8544.42.00', origin:'CN', qty:2000, val:6.20,   rate:5 },
    ];
    samples.forEach(s => addLine(s));
    setSampleLoaded(true);
    logAudit('Sample declaration loaded (4 lines).');
    pushToast('Sample declaration loaded.');
  }, [sampleLoaded, addLine, logAudit, pushToast]);

  /* ---------- Save / restore draft ---------- */
  const saveDraft = useCallback(() => {
    const draft = {
      id: job.jobNo + '-' + Date.now().toString(36).toUpperCase().slice(-4),
      declNo: 'DRF-' + declNumFrom(job.jobNo),
      savedAt: new Date().toISOString(),
      importer: decl.importer,
      customer: job.consignee || decl.importer,
      total: fmtMYR(totals.grand),
      sell: fmtMYR(chargesTot.sellMYR),
      lineCount: lines.length,
      stage,
      job: { ...job, stage },
      header: { ...job, ...decl },
      items: lines,
      tasks, charges, milestones,
      docs: docs.map(d => ({ name: d.name, type: d.type, pages: d.pages, size: d.size, source: d.source })),
    };
    const list = readStore<unknown[]>(K_DRAFTS, []);
    list.unshift(draft);
    if (!writeStore(K_DRAFTS, list.slice(0, 25))) { pushToast('Could not save — storage unavailable.', 'err'); return; }
    logAudit(`Job saved as draft <b>${draft.id}</b> (${draft.lineCount} lines).`);
    pushToast('Job saved as draft.');
  }, [job, decl, totals, chargesTot, lines, stage, tasks, charges, milestones, docs, logAudit, pushToast]);

  /* ---------- Lodge ---------- */
  const lodge = useCallback(() => {
    setRailTab('checks');
    if (fails) { pushToast(`Cannot lodge — ${fails} blocking issue(s).`, 'err'); return; }
    if (!lines.length) { pushToast('Cannot lodge an empty declaration.', 'err'); return; }
    const mrn = 'MRN-' + new Date().getFullYear() + '-' + String(Math.floor(10000000 + Math.random() * 89999999));
    const record = {
      mrn, declNo: 'DRF-' + declNumFrom(job.jobNo),
      submittedAt: new Date().toISOString(),
      importer: decl.importer, port: decl.port, currency: decl.currency,
      total: fmtMYR(totals.grand), items: lines, docs: docs.map(d => d.name),
      mode: job.mode, direction: job.direction, pol: job.pol, pod: job.pod,
    };
    const list = readStore<unknown[]>(K_SUBMITTED, []);
    list.unshift(record);
    writeStore(K_SUBMITTED, list.slice(0, 50));
    setMilestones(ms => ms.map(m => m.key === 'cleared' && !m.actual ? { ...m, actual: todayISO() } : m));
    logAudit(`Job <b>${job.jobNo}</b> lodged — <b>${mrn}</b> issued.`);
    pushToast('Declaration lodged. MRN ' + mrn + ' issued.', 'ok');
  }, [fails, lines, job, decl, totals, docs, logAudit, pushToast]);

  /* ---------- Export ---------- */
  const exportDeclaration = useCallback(() => {
    const fx = num(decl.fxRate) || 1;
    const payload = {
      job: { ...job, stage },
      declarationNo: 'DRF-' + declNumFrom(job.jobNo),
      stage,
      header: { ...decl },
      items: lines.map(i => ({ ...i, dutyAmountMYR: i.qty * i.val * fx * i.rate / 100 })),
      charges, tasks, milestones,
      carbon, risk, einvoice: { pct: ein.pct },
      totals: {
        customsValue: fmtCur(totals.totalValue, decl.currency),
        customsValueMYR: fmtMYR(totals.valueMYR),
        duty: fmtMYR(totals.totalDutyMYR),
        tax: fmtMYR(totals.tax),
        otherCharges: fmtMYR(totals.other),
        payable: fmtMYR(totals.grand),
      },
      documents: docs.map(d => ({ name: d.name, type: d.type, pages: d.pages, size: d.size })),
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = job.jobNo + '.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    logAudit('Job exported as JSON.'); pushToast('Job exported.');
  }, [job, stage, decl, lines, charges, tasks, milestones, carbon, risk, ein, totals, docs, logAudit, pushToast]);

  /* ---------- Clear ---------- */
  const clearAll = useCallback(() => {
    if (!window.confirm('Clear all line items and attached documents from this job?')) return;
    docs.forEach(d => { try { URL.revokeObjectURL(d.url); } catch { /* noop */ } });
    setLines([]); setActiveId(null); setSampleLoaded(false);
    setDocs([]);
    setClassifyResults([]); setClassifyStatus('idle');
    logAudit('Declaration cleared.'); pushToast('All lines and documents cleared.', 'warn');
  }, [docs, logAudit, pushToast]);

  /* ---------- Copilot respond ---------- */
  const copSay = useCallback((role: 'bot' | 'user', html: string) => {
    setCopMsgs(prev => [...prev, { role, html }]);
  }, []);

  const runAutopilot = useCallback(() => {
    copSay('bot', '✦ <b>Autopilot engaged.</b> Running multi-step agent…');
    window.setTimeout(() => {
      const before = lines.filter(i => !i.code).length;
      autoClassifyAll();
      const present = new Set(docs.map(d => d.type));
      const missing = (Object.entries(DOC_TYPES) as [DocTypeKey, DocTypeInfo][]).filter(([k, v]) => v.required && !present.has(k));
      const stageTasks = tasks.filter(t => t.stage === stage && !t.done);
      const failsNow = fails;
      copSay('bot', `✓ Classified <b>${before}</b> line(s)<br>
        ✓ ${missing.length ? missing.length + ' required doc(s) still missing' : 'All required docs present'}<br>
        ✓ ${stageTasks.length ? stageTasks.length + ' open task(s) on this stage' : 'Stage tasks complete'}<br>
        ${failsNow ? '⚠ ' + failsNow + ' blocking issue(s) remain' : '✓ No blocking issues — ready to lodge'}`);
    }, 600);
  }, [lines, docs, tasks, stage, fails, autoClassifyAll, copSay]);

  const copilotRespond = useCallback((text: string) => {
    const t = text.toLowerCase().trim();
    if (!t) return;
    copSay('user', escapeHtml(text));
    window.setTimeout(() => {
      if (/autopilot|agent|do everything|run all/.test(t)) { runAutopilot(); return; }
      if (/classify all|auto.?classify|classify every/.test(t)) { autoClassifyAll(); copSay('bot', 'Ran auto-classification across every line.'); return; }
      if (/advance|next stage/.test(t)) { advanceStage(); return; }
      if (/block|lodge|ready|validat/.test(t)) {
        setRailTab('checks');
        copSay('bot', fails ? `Found <b>${fails}</b> blocking issue(s) — see the Checks tab.` : 'No blocking issues. Declaration is ready to lodge. ✓');
        return;
      }
      if (/carbon|co2|sustainab|emission/.test(t)) {
        copSay('bot', `Estimated <b>${carbon.tCO2e.toFixed(2)} tCO₂e</b> for this shipment (${carbon.mode}, ${carbon.distance.toLocaleString()} km). At $${CARBON_PRICE}/t internal carbon price that's ≈ <b>$${carbon.cost.toFixed(0)}</b>.`);
        return;
      }
      if (/risk|delay|eta/.test(t)) {
        copSay('bot', `Delay risk is <b>${risk.score}/100</b> (${risk.band}). Drivers: ${risk.reasons.slice(0, 2).join('; ')}.`);
        return;
      }
      if (/invoice|myinvois|einvoice|e-invoice/.test(t)) {
        copSay('bot', `e-Invoice readiness: <b>${ein.pct}%</b>. ${ein.missing.length ? 'Missing: ' + ein.missing.join(', ') : 'All required fields present — ready to submit.'}`);
        return;
      }
      if (/theme|dark/.test(t)) { toggleTheme(); copSay('bot', 'Toggled the interface theme.'); return; }
      if (/stage|progress/.test(t)) {
        const done = tasks.filter(x => x.done).length, total = tasks.length;
        copSay('bot', `Currently at stage <b>${stage} — ${STAGES[stage-1].name}</b>. Overall progress: ${done}/${total} tasks complete.`);
        return;
      }
      if (/^save/.test(t)) { saveDraft(); copSay('bot', 'Saved the job draft.'); return; }
      if (/^export/.test(t)) { exportDeclaration(); copSay('bot', 'Exported the job JSON.'); return; }
      copSay('bot', 'I can classify lines, check compliance, advance stages, estimate carbon and risk, prepare the e-invoice, or add charges. Try <i>autopilot</i>, <i>what is blocking lodging?</i> or <i>carbon footprint</i>.');
    }, 300);
  }, [runAutopilot, autoClassifyAll, advanceStage, fails, carbon, risk, ein, tasks, stage, toggleTheme, saveDraft, exportDeclaration, copSay]);

  /* ---------- Command palette ---------- */
  const paletteItems = useMemo<PaletteItem[]>(() => {
    const items: PaletteItem[] = [];
    const add = (group: string, icon: string, label: string, hint: string, run: () => void) => items.push({ group, icon, label, hint, run });
    add('Actions', '✦', 'Run Autopilot (agent)', 'classify · validate · advance', runAutopilot);
    add('Actions', '⚡', 'Auto-classify all lines', '', autoClassifyAll);
    add('Actions', '→', 'Advance to next stage', '', advanceStage);
    add('Actions', '⚖', 'Validate declaration', '', () => setRailTab('checks'));
    add('Actions', '💾', 'Save job draft', '⌘S', saveDraft);
    add('Actions', '⤓', 'Export job JSON', '', exportDeclaration);
    add('Actions', '🌓', 'Toggle theme', '', toggleTheme);
    add('Actions', '⟨', 'Toggle sidebar', '⌘B', () => setSbCollapsed(s => !s));
    add('Actions', '⟩', 'Toggle right panel', '', () => setRailCollapsed(s => !s));

    const views: [ViewKey, string][] = [
      ['studio','Job Workspace'], ['jobs','Shipment Jobs'], ['taskboard','Task Board'],
      ['charges','Charges & Billing'], ['milestones','Milestones'], ['sustainability','Sustainability'],
      ['queue','Classification Queue'], ['drafts','Drafts'], ['submitted','Submitted / MRN'],
      ['einvoice','e-Invoice'], ['tariff','Tariff Schedule'], ['rulings','Rulings'],
      ['fta','FTA Origin'], ['restricted','Restricted Goods'], ['importers','Importers'], ['products','Products'],
    ];
    views.forEach(([k, label]) => add('Navigate', '↗', label, 'Open view', () => setView(k)));

    const q = paletteQuery.toLowerCase().trim();
    if (q.length >= 2) {
      const digits = q.replace(/[^0-9]/g, '');
      HS_DB.filter(h =>
        (digits.length >= 2 && h.code.replace(/[^0-9]/g, '').includes(digits)) ||
        (h.desc + ' ' + h.kw.join(' ')).toLowerCase().includes(q)
      ).slice(0, 6).forEach(h => add('Tariff', '⌗', h.code + ' — ' + h.desc.slice(0, 60), h.duty + '% duty', () => {
        setInfo({
          title: 'Tariff detail · ' + h.code,
          body: (
            <div className="info-block">
              <div className="code-chip" style={{ fontSize: 14, padding:'4px 10px' }}>{h.code}</div>
              <h4>Description</h4><div>{h.desc}</div>
              <h4>Duty rate</h4><div><b>{h.duty}%</b> (MFN applied rate — verify current gazette)</div>
              <h4>Compliance notes</h4>
              <div>{h.notes.length ? h.notes.map((n, i) => <div key={i}>⚠ {n}</div>) : '✓ No restrictions or permit triggers recorded.'}</div>
              <h4>Keywords</h4>
              <div>{h.kw.map(k => <span key={k} className="code-chip" style={{ marginRight: 5 }}>{k}</span>)}</div>
              <div style={{ marginTop: 16, display:'flex', gap: 8 }}>
                <button className="btn btn-sm btn-primary" onClick={() => {
                  if (activeId == null) { pushToast('Select a line item in the studio first.', 'warn'); return; }
                  applyCodeToLine(activeId, h.code, h.duty, 'search');
                  pushToast('Applied ' + h.code + '.'); setInfo(null); setView('studio');
                }}>Apply to selected line</button>
                <button className="btn btn-sm" onClick={() => {
                  if (navigator.clipboard) navigator.clipboard.writeText(h.code).then(
                    () => pushToast('Code copied.'), () => pushToast('Copy failed.', 'warn'));
                }}>Copy code</button>
              </div>
            </div>
          ),
        });
      }));
    }
    const filtered = !q ? items : items.filter(i => (i.label + ' ' + (i.hint || '')).toLowerCase().includes(q));
    return filtered;
  }, [paletteQuery, runAutopilot, autoClassifyAll, advanceStage, saveDraft, exportDeclaration, toggleTheme, activeId, applyCodeToLine, pushToast]);

  const paletteGrouped = useMemo(() => {
    const groups: Record<string, PaletteItem[]> = {};
    paletteItems.forEach(i => { (groups[i.group] = groups[i.group] || []).push(i); });
    return groups;
  }, [paletteItems]);

  const paletteFlat = useMemo(() => paletteItems, [paletteItems]);

  useEffect(() => {
    if (paletteOpen) {
      setPaletteQuery(''); setPaletteIdx(0);
      setTimeout(() => paletteInputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  const runPaletteItem = (item: PaletteItem) => {
    setPaletteOpen(false);
    setTimeout(item.run, 10);
  };

  /* ---------- Keyboard shortcuts ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      if (e.key === 'Escape') {
        if (paletteOpen) { setPaletteOpen(false); return; }
        if (viewerDoc) { setViewerDoc(null); return; }
        if (info) { setInfo(null); return; }
        setNotifOpen(false);
      }
      if (meta && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen(o => !o); }
      if (meta && e.key.toLowerCase() === 'b') { e.preventDefault(); setSbCollapsed(s => !s); }
      if (meta && e.key.toLowerCase() === 's') { e.preventDefault(); saveDraft(); persistJob(); }
      if (meta && e.shiftKey && e.key.toLowerCase() === 'l') { e.preventDefault(); toggleTheme(); }
      if (meta && e.key === 'Enter') { e.preventDefault(); runClassification(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [paletteOpen, viewerDoc, info, saveDraft, persistJob, toggleTheme, runClassification]);

  /* ---------- Init audit ---------- */
  useEffect(() => {
    logAudit('Session opened. Job <b>' + job.jobNo + '</b> at stage <b>' + STAGES[stage-1].name + '</b>.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => pushToast('Tip: ⌘K opens the command palette · ⌘⇧L toggles dark mode.', 'ok'), 900);
    return () => window.clearTimeout(t);
  }, [pushToast]);

  /* ---------- Render ---------- */
  const importerOptions = useMemo(() => {
    const custom = readStore<Importer[]>(K_IMPORTERS, []);
    const names = [...DEFAULT_IMPORTERS.map(i => i.name), ...custom.map(i => i.name)];
    if (decl.importer && !names.includes(decl.importer)) names.push(decl.importer);
    return names;
  }, [decl.importer]);

  return (
    <>
      <style>{CSS}</style>
      <div className={`app ${sbCollapsed ? 'sb-collapsed' : ''} ${railCollapsed ? 'rail-collapsed' : ''}`}>
        {/* ══════════ TOP BAR ══════════ */}
        <header className="topbar">
          <div className="brand">
            <div className="mark">B</div>
            <div>BrokerDesk<small>FORWARDER · 2026</small></div>
          </div>
          <button className="search-trigger" onClick={() => setPaletteOpen(true)} aria-label="Open command palette">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
            </svg>
            <span>Search tariffs, run commands…</span>
            <kbd>⌘K</kbd>
          </button>
          <div className="spacer" />
          <div className="presence" aria-label="Collaborators present">
            <span className="p p1" title="Aisyah · Sales">AR</span>
            <span className="p p2" title="Daniel · Ops">DT</span>
            <span className="p p3" title="Mei · Customs">ML</span>
          </div>
          <span className="badge-env">● LIVE · Gateway OK</span>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode" title="Toggle theme (⌘⇧L)">
            {resolvedTheme === 'dark'
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" /></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>}
          </button>
          <div className="notif-wrap">
            <button className="icon-btn" aria-label="Notifications" onClick={() => setNotifOpen(o => !o)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 21a2 2 0 004 0" />
              </svg>
              {notifUnread > 0 && <span className="dot-badge">{notifUnread}</span>}
            </button>
            <div className={`notif-menu ${notifOpen ? 'open' : ''}`}>
              <div className="nm-head"><span>Notifications</span>
                <button className="btn btn-ghost btn-sm" onClick={() => { setNotifUnread(0); pushToast('Notifications marked as read.'); }}>Mark all read</button>
              </div>
              <div className="notif-item warn"><div className="ni-ico">!</div><div className="ni-body"><b>VGM cut-off in 6 hours</b><small>Container {job.ctr || 'MSKU 4471823'} · {decl.port}</small></div></div>
              <div className="notif-item ok"><div className="ni-ico">✓</div><div className="ni-body"><b>Carrier booking confirmed</b><small>{job.carrier} · {job.booking}</small></div></div>
              <div className="notif-item"><div className="ni-ico">⏱</div><div className="ni-body"><b>ETA updated by carrier</b><small>+1 day · now {dateShort(job.eta)}</small></div></div>
              <div className="notif-item"><div className="ni-ico">⚡</div><div className="ni-body"><b>{unclassifiedCount} line(s) unclassified</b><small>Copilot · run auto-classify</small></div></div>
            </div>
          </div>
          <div className="user"><div className="avatar">RA</div> R. Ahmed · Lic. 4471</div>
        </header>

        {/* ══════════ SIDEBAR ══════════ */}
        <aside className="sidebar">
          <button className="sb-toggle" onClick={() => setSbCollapsed(s => !s)}
            title={`${sbCollapsed ? 'Expand' : 'Collapse'} sidebar (Ctrl+B)`}>{sbCollapsed ? '⟩' : '⟨'}</button>
          <NavGroup title="Shipment Job" items={[
            { key:'studio', label:'Job Workspace', ini:'J' },
            { key:'jobs', label:'Shipment Jobs', ini:'S' },
            { key:'taskboard', label:'Task Board', ini:'T' },
            { key:'charges', label:'Charges & Billing', ini:'₵' },
            { key:'milestones', label:'Milestones', ini:'⏱' },
            { key:'sustainability', label:'Sustainability', ini:'🌿' },
          ]} view={view} setView={setView} />
          <NavGroup title="Customs" items={[
            { key:'queue', label:'Classification Queue', ini:'Q', badge: unclassifiedCount },
            { key:'drafts', label:'Draft Declarations', ini:'D' },
            { key:'submitted', label:'Submitted / MRN', ini:'M' },
            { key:'einvoice', label:'e-Invoice (MyInvois)', ini:'e' },
          ]} view={view} setView={setView} />
          <NavGroup title="Reference" items={[
            { key:'tariff', label:'Tariff Schedule', ini:'T' },
            { key:'rulings', label:'Rulings & BTIs', ini:'R' },
            { key:'fta', label:'FTA Origin Rules', ini:'F' },
            { key:'restricted', label:'Restricted Goods', ini:'!' },
          ]} view={view} setView={setView} />
          <NavGroup title="Clients" items={[
            { key:'importers', label:'Importer Registry', ini:'I' },
            { key:'products', label:'Product Master', ini:'P' },
          ]} view={view} setView={setView} />
        </aside>

        {/* ══════════ MAIN ══════════ */}
        <main className="main">
          {view === 'studio' ? (
            <StudioView
              job={job} setJob={setJob}
              decl={decl} setDecl={setDecl}
              stage={stage} setStage={setStage} advanceStage={advanceStage}
              tasks={tasks} setTasks={setTasks}
              charges={charges} setCharges={setCharges}
              milestones={milestones} setMilestones={setMilestones}
              lines={lines} addLine={addLine} updateLine={updateLine} removeLine={removeLine} duplicateLine={duplicateLine}
              activeId={activeId} flashId={flashId} selectLine={selectLine}
              docs={docs} addDoc={addDoc} removeDoc={removeDoc} handleFiles={handleFiles} loadSampleDocs={loadSampleDocs}
              onOpenDoc={d => { setViewerDoc(d); logAudit(`Previewed document <b>${escapeHtml(d.name)}</b>.`); }}
              autoClassifyAll={autoClassifyAll} loadSample={loadSample}
              totals={totals} carbon={carbon} risk={risk} ein={ein} chargesTot={chargesTot}
              importerOptions={importerOptions}
              onAiLine={id => {
                const line = lines.find(l => l.id === id);
                if (!line) return;
                setActiveId(id); setClassifyInput(line.desc);
                setRailTab('classify'); setRailCollapsed(false);
                runClassification(line.desc);
              }}
              onCarbonDetail={() => setView('sustainability')}
              onRiskDetail={() => {
                setInfo({
                  title: 'Predictive delay risk',
                  body: (
                    <div className="info-block">
                      <h4>Score</h4>
                      <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 8 }}>
                        <span style={{ fontSize: 32, fontWeight: 800, color: risk.band === 'low' ? 'var(--ok)' : risk.band === 'mid' ? 'var(--warn)' : 'var(--danger)' }}>{risk.score}</span>
                        <span className={`risk-band ${risk.band}`} style={{ fontSize: 11, padding:'4px 10px' }}>{risk.band.toUpperCase()} RISK</span>
                      </div>
                      <div className="meter risk"><i style={{ width: risk.score + '%' }} /></div>
                      <h4>Drivers</h4>
                      <ul>{risk.reasons.map((x, i) => <li key={i}>{x}</li>)}</ul>
                      <h4>Model confidence</h4><div>{risk.confidence}% (based on data completeness)</div>
                      <p style={{ marginTop: 14, color:'var(--muted)', fontSize: 11.5 }}>Heuristic estimate — not a carrier-provided prediction.</p>
                    </div>
                  ),
                });
              }}
              onEinDetail={() => setView('einvoice')}
              onOpenPreset={() => {
                setInfo({
                  title: 'Quick add charge',
                  body: (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap: 8 }}>
                      {CHARGE_PRESETS.map((p, i) => (
                        <button key={i} className="btn" style={{ justifyContent:'space-between', textAlign:'left', padding:'8px 10px' }}
                          onClick={() => {
                            setCharges(cs => [...cs, { code:p.code, desc:p.desc, qty:1, unit:p.unit, buyRate:p.buy, sellRate:p.sell, currency:p.currency }]);
                            setInfo(null); pushToast('Added ' + p.code + '.');
                          }}>
                          <span><b>{p.code}</b> · {p.desc}</span>
                          <span style={{ color:'var(--muted)', fontSize: 11 }}>{p.currency}</span>
                        </button>
                      ))}
                    </div>
                  ),
                });
              }}
              onAddCharge={() => setCharges(cs => [...cs, { code:'NEW', desc:'New charge', qty:1, unit:'unit', buyRate:0, sellRate:0, currency:'MYR' }])}
              onLogAudit={logAudit}
            />
          ) : (
            <AltView
              view={view}
              job={job} decl={decl} stage={stage} tasks={tasks} setTasks={setTasks}
              lines={lines} addLine={addLine} activeId={activeId} selectLine={selectLine}
              applyCodeToLine={applyCodeToLine}
              docs={docs} handleFiles={handleFiles} loadSampleDocs={loadSampleDocs}
              onOpenDoc={d => { setViewerDoc(d); logAudit(`Previewed document <b>${escapeHtml(d.name)}</b>.`); }}
              charges={charges} setCharges={setCharges}
              milestones={milestones} setMilestones={setMilestones}
              carbon={carbon} risk={risk} ein={ein} chargesTot={chargesTot} totals={totals}
              setView={setView} setStage={setStage} setRailTab={setRailTab}
              saveDraft={saveDraft} restoreDraft={setStage}
              autoClassifyAll={autoClassifyAll}
              pushToast={pushToast} logAudit={logAudit}
              setInfo={setInfo}
              onUseImporter={(name) => {
                setDeclState(prev => ({ ...prev, importer: name }));
                setJobState(prev => ({ ...prev, consignee: prev.consignee || name }));
                pushToast('Importer set on declaration.'); setView('studio');
              }}
              goStudio={() => setView('studio')}
            />
          )}
        </main>

        {/* ══════════ RIGHT RAIL ══════════ */}
        <aside className="rail">
          <div className="tabs">
            <button className={`tab ${railTab === 'copilot' ? 'active' : ''}`} onClick={() => { if (railCollapsed) setRailCollapsed(false); setRailTab('copilot'); }} title="AI Copilot"><span className="ticon">✦</span><span className="tlbl">Copilot</span></button>
            <button className={`tab ${railTab === 'classify' ? 'active' : ''}`} onClick={() => { if (railCollapsed) setRailCollapsed(false); setRailTab('classify'); }} title="AI Classify"><span className="ticon">⚡</span><span className="tlbl">Classify</span></button>
            <button className={`tab ${railTab === 'checks' ? 'active' : ''}`} onClick={() => { if (railCollapsed) setRailCollapsed(false); setRailTab('checks'); }} title="Compliance"><span className="ticon">⚖</span><span className="tlbl">Checks</span></button>
            <button className={`tab ${railTab === 'audit' ? 'active' : ''}`} onClick={() => { if (railCollapsed) setRailCollapsed(false); setRailTab('audit'); }} title="Audit Trail"><span className="ticon">⏱</span><span className="tlbl">Audit</span></button>
            <button className="rail-toggle" onClick={() => setRailCollapsed(s => !s)} title="Collapse / expand panel">⟩</button>
          </div>

          {railTab === 'copilot' && (
            <div className="tabpane active">
              <div className="cop-wrap">
                <div className="cop-head">
                  <div className="cop-ico">✦</div>
                  <div><b>Shipment Copilot</b><small>Agentic · can execute actions</small></div>
                  <button className="btn btn-sm btn-ai" onClick={runAutopilot}>Autopilot</button>
                </div>
                <div className="cop-chat">
                  {copMsgs.map((m, i) => (
                    <div key={i} className={`cop-msg ${m.role}`} dangerouslySetInnerHTML={{ __html: m.html }} />
                  ))}
                </div>
                <div className="cop-sugg">
                  {[
                    { k:'autopilot', v:'Run autopilot' },
                    { k:"what's blocking lodging?", v:"What's blocking?" },
                    { k:'carbon footprint', v:'Carbon' },
                    { k:'delay risk', v:'Risk' },
                    { k:'e-invoice status', v:'e-Invoice' },
                  ].map(c => (
                    <span key={c.k} className="cop-chip" onClick={() => copilotRespond(c.k)}>{c.v}</span>
                  ))}
                </div>
                <div className="cop-input">
                  <input value={copInput} onChange={e => setCopInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const v = copInput; if (!v.trim()) return; setCopInput(''); copilotRespond(v); } }}
                    placeholder="Ask Copilot…  e.g. classify all" autoComplete="off" />
                  <button onClick={() => { const v = copInput; if (!v.trim()) return; setCopInput(''); copilotRespond(v); }} aria-label="Send">→</button>
                </div>
              </div>
            </div>
          )}

          {railTab === 'classify' && (
            <div className="tabpane active">
              <p className="hint">Select a line, then run classification. Results are scored against the national tariff schedule and prior rulings. <b>Always verify before lodging.</b></p>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Description to classify</label>
                <textarea rows={2} value={classifyInput} onChange={e => setClassifyInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runClassification(); } }}
                  style={{ padding:'8px 9px', border:'1px solid var(--line)', borderRadius: 8, background:'var(--card)', outline:'none', resize:'vertical', fontSize: 12.5 }}
                  placeholder="e.g. Wireless Bluetooth headphones with charging case" />
              </div>
              <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={() => runClassification()}>⚡ Run AI Classification</button>
              <div style={{ marginTop: 14 }}>
                {classifyStatus === 'idle' && <div className="empty"><span className="big">⌕</span>No classification run yet.</div>}
                {classifyStatus === 'no-input' && <div className="empty"><span className="big">⌕</span>Enter a product description first.</div>}
                {classifyStatus === 'loading' && <div className="empty" style={{ padding: 16 }}>Analysing description…</div>}
                {classifyStatus === 'no-match' && (
                  <div className="empty"><span className="big">⚠</span>No confident match found.<br /><small>Escalate to a licensed classifier or request an advance ruling.</small></div>
                )}
                {classifyStatus === 'done' && classifyResults.map((r, i) => {
                  const low = r.conf < 60;
                  return (
                    <div className="result" key={r.code + i}>
                      <div className="r-top">
                        <div className="r-code">{r.code}</div>
                        <div className={`conf ${low ? 'low' : ''}`}>{r.conf}%<span className="bar"><i style={{ width: r.conf + '%' }} /></span></div>
                      </div>
                      <div className="r-desc">{r.desc}</div>
                      <div className="r-meta"><span>Duty <b>{r.duty}%</b></span><span>{r.notes.length ? '⚠ ' + r.notes.length + ' compliance note(s)' : '✓ No flags'}</span></div>
                      <div style={{ marginTop: 9, display:'flex', gap: 7 }}>
                        <button className="btn btn-sm btn-primary" onClick={() => applyClassifyResult(r)}>Apply to line</button>
                        <button className="btn btn-sm" onClick={() => { logAudit(`Code <b>${r.code}</b> flagged for senior review.`); pushToast('Flagged for senior classifier review.', 'warn'); }}>Flag for review</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {railTab === 'checks' && (
            <div className="tabpane active">
              <p className="hint">Pre-lodgement validation. All <b>fail</b> items must be resolved before submission.</p>
              <div>
                {checks.map((c, i) => (
                  <div className="check" key={i}>
                    <div className={`ico ${c.s}`}>{CHECK_ICON[c.s]}</div>
                    <div><b>{c.t}</b><small dangerouslySetInnerHTML={{ __html: c.d }} /></div>
                  </div>
                ))}
              </div>
              <button className="btn" style={{ width:'100%', justifyContent:'center', marginTop: 12 }}
                onClick={() => { const f = fails; pushToast(f ? `${f} blocking issue(s) found.` : 'All validation checks passed.', f ? 'err' : 'ok'); }}>
                ↻ Re-run Validation
              </button>
            </div>
          )}

          {railTab === 'audit' && (
            <div className="tabpane active">
              <p className="hint">Every classification decision and edit is timestamped for post-entry audit defence.</p>
              <div className="audit">
                {audit.length
                  ? audit.slice(0, 80).map((a, i) => (
                    <div className="aevent" key={i}>
                      <span dangerouslySetInnerHTML={{ __html: a.text }} />
                      <time>{a.time}</time>
                    </div>
                  ))
                  : <div className="empty" style={{ padding: 14 }}>No activity recorded yet.</div>}
              </div>
            </div>
          )}
        </aside>

        {/* ══════════ ACTION BAR ══════════ */}
        <div className="actionbar">
          <span className="stat">Job: <b>{job.jobNo}</b></span>
          <span className="stat">· Stage: <b>{stage} / {STAGES.length}</b></span>
          <span className="stat">· Lines: <b>{lines.length}</b></span>
          <span className="stat">· Docs: <b>{docs.length}</b></span>
          <span className="stat">· Payable: <b>{fmtMYR(totals.grand)}</b></span>
          <span className="stat">· Sell: <b>{fmtMYR(chargesTot.sellMYR)}</b></span>
          <div className="spacer" />
          <button className="btn btn-sm" onClick={exportDeclaration} title="Export job JSON">⤓ Export</button>
          <button className="btn btn-danger btn-sm" onClick={clearAll}>Clear All</button>
          <button className="btn btn-sm" onClick={() => { saveDraft(); persistJob(); }}>Save Job</button>
          <button className="btn btn-sm btn-primary" onClick={lodge}>Validate &amp; Lodge →</button>
        </div>

        {/* ══════════ COMMAND PALETTE ══════════ */}
        {paletteOpen && (
          <div className="cmdk open" role="dialog" aria-modal="true"
            onClick={e => { if (e.target === e.currentTarget) setPaletteOpen(false); }}>
            <div className="cmdk-shell">
              <div className="cmdk-head">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
                </svg>
                <input ref={paletteInputRef} value={paletteQuery}
                  onChange={e => { setPaletteQuery(e.target.value); setPaletteIdx(0); }}
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); setPaletteIdx(i => Math.min(paletteFlat.length - 1, i + 1)); }
                    else if (e.key === 'ArrowUp') { e.preventDefault(); setPaletteIdx(i => Math.max(0, i - 1)); }
                    else if (e.key === 'Enter') { e.preventDefault(); const item = paletteFlat[paletteIdx]; if (item) runPaletteItem(item); }
                    else if (e.key === 'Escape') setPaletteOpen(false);
                  }}
                  placeholder="Type a command, view, or tariff code…" autoComplete="off" />
                <kbd>esc</kbd>
              </div>
              <div className="cmdk-list">
                {paletteFlat.length === 0 ? (
                  <div className="cmdk-empty">No matches. Try "classify", "carbon", "8471".</div>
                ) : (
                  ['Actions','Navigate','Tariff'].map(group => {
                    const items = paletteGrouped[group];
                    if (!items || !items.length) return null;
                    return (
                      <React.Fragment key={group}>
                        <div className="cmdk-group">{group}</div>
                        {items.map(item => {
                          const idx = paletteFlat.indexOf(item);
                          return (
                            <div key={item.label + idx} className={`cmdk-item ${idx === paletteIdx ? 'hover' : ''}`}
                              onMouseEnter={() => setPaletteIdx(idx)}
                              onClick={() => runPaletteItem(item)}>
                              <span className="ci">{item.icon}</span>
                              <span className="cl">{item.label}</span>
                              <span className="ch">{item.hint}</span>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    );
                  })
                )}
              </div>
              <div className="cmdk-foot">
                <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                <span><kbd>↵</kbd> run</span>
                <span><kbd>⌘K</kbd> toggle</span>
                <span style={{ marginLeft:'auto' }}>BrokerDesk 2026</span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ PDF VIEWER MODAL ══════════ */}
        {viewerDoc && (
          <div className="modal open" onClick={e => { if (e.target === e.currentTarget) setViewerDoc(null); }}>
            <div className="modal-shell">
              <div className="modal-bar">
                <div>
                  <div className="mtitle">{viewerDoc.name}</div>
                  <div className="mmeta">{DOC_TYPES[viewerDoc.type].label} · {viewerDoc.pages} page{viewerDoc.pages > 1 ? 's' : ''} · {kb(viewerDoc.size)} · added {viewerDoc.added}</div>
                </div>
                <div className="spacer" />
                <a className="btn btn-sm" href={viewerDoc.url} download={viewerDoc.name}>⤓ Download</a>
                <a className="btn btn-sm" href={viewerDoc.url} target="_blank" rel="noopener noreferrer">↗ Open in tab</a>
                <button className="btn btn-sm btn-primary" onClick={() => setViewerDoc(null)}>Close ✕</button>
              </div>
              <div className="modal-body"><iframe id="pdfFrame" title="PDF preview" src={viewerDoc.url} /></div>
            </div>
          </div>
        )}

        {/* ══════════ INFO MODAL ══════════ */}
        {info && (
          <div className="modal open" onClick={e => { if (e.target === e.currentTarget) setInfo(null); }}>
            <div className="modal-shell sm">
              <div className="modal-bar">
                <div className="mtitle">{info.title}</div>
                <div className="spacer" />
                <button className="btn btn-sm btn-primary" onClick={() => setInfo(null)}>Close ✕</button>
              </div>
              <div className="modal-body pad">{info.body}</div>
            </div>
          </div>
        )}

        {/* ══════════ TOASTS ══════════ */}
        <div id="toasts">
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.kind}`}>
              {(t.kind === 'ok' ? '✓ ' : t.kind === 'warn' ? '⚠ ' : '✕ ') + t.msg}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   NAV GROUP
   ══════════════════════════════════════════════════════════ */
function NavGroup({ title, items, view, setView }: {
  title: string;
  items: { key: ViewKey; label: string; ini: string; badge?: number }[];
  view: ViewKey;
  setView: (v: ViewKey) => void;
}) {
  return (
    <div className="navgroup">
      <h4>{title}</h4>
      {items.map(it => (
        <div key={it.key} className={`navitem ${view === it.key ? 'active' : ''}`}
          onClick={() => setView(it.key)} title={it.label}>
          <span className="ini">{it.ini}</span>
          <span className="dot" />
          <span className="lbl">{it.label}</span>
          {it.badge !== undefined && it.badge > 0 && <span className="badge">{it.badge}</span>}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STUDIO VIEW (the main workspace)
   ══════════════════════════════════════════════════════════ */
interface StudioProps {
  job: JobHeader; setJob: (p: Partial<JobHeader>) => void;
  decl: DeclHeader; setDecl: (p: Partial<DeclHeader>) => void;
  stage: number; setStage: (n: number) => void; advanceStage: () => void;
  tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  charges: Charge[]; setCharges: React.Dispatch<React.SetStateAction<Charge[]>>;
  milestones: Milestone[]; setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
  lines: Line[]; addLine: (d?: Partial<Line>) => number;
  updateLine: (id: number, p: Partial<Line>) => void;
  removeLine: (id: number) => void; duplicateLine: (id: number) => void;
  activeId: number | null; flashId: number | null; selectLine: (id: number) => void;
  docs: Doc[]; addDoc: (d: { name: string; type: DocTypeKey; blob: Blob; pages?: number; source?: 'attached' | 'sample' }) => void;
  removeDoc: (id: number) => void; handleFiles: (f: FileList | File[]) => void; loadSampleDocs: () => void;
  onOpenDoc: (d: Doc) => void;
  autoClassifyAll: () => void; loadSample: () => void;
  totals: { totalValue: number; totalDutyMYR: number; valueMYR: number; tax: number; other: number; grand: number; fx: number };
  carbon: CarbonResult; risk: RiskResult; ein: EInvResult; chargesTot: ChargesTotals;
  importerOptions: string[];
  onAiLine: (id: number) => void;
  onCarbonDetail: () => void; onRiskDetail: () => void; onEinDetail: () => void;
  onOpenPreset: () => void; onAddCharge: () => void;
  onLogAudit: (t: string) => void;
}
function StudioView(p: StudioProps) {
  const stageInfo = STAGES[p.stage - 1];
  return (
    <>
      <BentoKPIs stage={p.stage} tasks={p.tasks} carbon={p.carbon} risk={p.risk} ein={p.ein} chargesTot={p.chargesTot} docs={p.docs} />
      <JobHeaderCard job={p.job} setJob={p.setJob} stage={p.stage} />
      <InsightsRow carbon={p.carbon} risk={p.risk} ein={p.ein}
        onCarbonDetail={p.onCarbonDetail} onRiskDetail={p.onRiskDetail} onEinDetail={p.onEinDetail} />
      <WorkflowStepper stage={p.stage} tasks={p.tasks} setStage={p.setStage} advanceStage={p.advanceStage} stageInfo={stageInfo} />
      <StageTasksCard stage={p.stage} tasks={p.tasks} setTasks={p.setTasks} onLogAudit={p.onLogAudit} />
      <DeclarationHeaderCard decl={p.decl} setDecl={p.setDecl} importerOptions={p.importerOptions} declNo={'DRF-' + declNumFrom(p.job.jobNo)} />
      <LineItemsCard
        lines={p.lines} activeId={p.activeId} flashId={p.flashId} fx={p.totals.fx}
        onSelectLine={p.selectLine} onUpdateLine={p.updateLine} onRemoveLine={p.removeLine}
        onDuplicateLine={p.duplicateLine} onAiLine={p.onAiLine}
        onAddLine={() => p.addLine()} onAutoAll={p.autoClassifyAll} onLoadSample={p.loadSample}
      />
      <DocumentsCard docs={p.docs} onAddFiles={p.handleFiles} onRemoveDoc={p.removeDoc}
        onOpenDoc={p.onOpenDoc} onLoadSampleDocs={p.loadSampleDocs} />
      <ChargesCard charges={p.charges} setCharges={p.setCharges} totals={p.chargesTot}
        onOpenPreset={p.onOpenPreset} onAddCharge={p.onAddCharge} />
      <TotalsCard decl={p.decl} setDecl={p.setDecl} totals={p.totals} />
    </>
  );
}

/* ---------- Bento ---------- */
function sparkPoints(values: number[]): string {
  if (!values.length) return '';
  const max = Math.max(...values, 1), min = Math.min(...values, 0);
  const range = max - min || 1;
  return values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * 100;
    const y = 26 - ((v - min) / range) * 22 - 2;
    return x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ');
}
function BentoKPIs({ stage, tasks, carbon, risk, ein, chargesTot, docs }: {
  stage: number; tasks: Task[]; carbon: CarbonResult; risk: RiskResult;
  ein: EInvResult; chargesTot: ChargesTotals; docs: Doc[];
}) {
  const tasksDone = tasks.filter(t => t.done).length;
  const stagePct = Math.round((tasksDone / Math.max(1, tasks.length)) * 100);
  const circumference = 2 * Math.PI * 15;
  const gpHint = chargesTot.margin >= 0 ? 'Gross margin ' + chargesTot.margin.toFixed(1) + '%' : 'Below cost';
  const docsPct = Math.round((docs.length / Math.max(1, Object.keys(DOC_TYPES).length)) * 100);
  return (
    <div className="bento">
      <div className="bento-tile">
        <span className="bt-label">Stage progress</span>
        <span className="bt-val">{stage}/10</span>
        <svg className="ring" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--line)" strokeWidth="3" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--accent)" strokeWidth="3"
            strokeDasharray={circumference.toFixed(1)}
            strokeDashoffset={(circumference * (1 - stagePct / 100)).toFixed(1)}
            strokeLinecap="round" transform="rotate(-90 18 18)" />
        </svg>
        <span className="bt-sub">{tasksDone}/{tasks.length} tasks done</span>
      </div>
      <div className="bento-tile">
        <span className="bt-label">Gross profit</span>
        <span className="bt-val" style={{ color: chargesTot.gp < 0 ? 'var(--danger)' : 'var(--ok)' }}>{fmtMYR(chargesTot.gp)}</span>
        <svg className="spark" viewBox="0 0 100 28" preserveAspectRatio="none">
          <polyline points={sparkPoints([8, 12, 10, 18, 22, 25, Math.max(1, chargesTot.gp / 1000)])}
            fill="none" stroke={chargesTot.gp < 0 ? 'var(--danger)' : 'var(--ok)'} strokeWidth="1.6" />
        </svg>
        <span className="bt-sub">{gpHint}</span>
      </div>
      <div className="bento-tile">
        <span className="bt-label">Carbon</span>
        <span className="bt-val">{carbon.tCO2e.toFixed(1)} <span style={{ fontSize: 12, color:'var(--muted)' }}>tCO₂e</span></span>
        <svg className="spark" viewBox="0 0 100 28" preserveAspectRatio="none">
          <polyline points={sparkPoints([14, 16, 15, 18, 20, 19, Math.max(1, carbon.tCO2e)])} fill="none" stroke="var(--carbon)" strokeWidth="1.6" />
        </svg>
        <span className="bt-sub">{carbon.mode} · ${carbon.cost.toFixed(0)} shadow cost</span>
      </div>
      <div className="bento-tile">
        <span className="bt-label">Compliance</span>
        <span className="bt-val">{100 - risk.score}<span style={{ fontSize: 12, color:'var(--muted)' }}>%</span></span>
        <svg className="ring" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--line)" strokeWidth="3" />
          <circle cx="18" cy="18" r="15" fill="none" stroke={risk.score < 30 ? 'var(--ok)' : risk.score < 60 ? 'var(--warn)' : 'var(--danger)'} strokeWidth="3"
            strokeDasharray={circumference.toFixed(1)}
            strokeDashoffset={(circumference * (risk.score / 100)).toFixed(1)}
            strokeLinecap="round" transform="rotate(-90 18 18)" />
        </svg>
        <span className="bt-sub">Risk score {risk.score}/100 · {risk.band}</span>
      </div>
      <div className="bento-tile">
        <span className="bt-label">e-Invoice</span>
        <span className="bt-val">{ein.pct}<span style={{ fontSize: 12, color:'var(--muted)' }}>%</span></span>
        <svg className="spark" viewBox="0 0 100 28" preserveAspectRatio="none">
          <polyline points={sparkPoints([60, 70, 75, 80, 85, 88, ein.pct])} fill="none" stroke="var(--accent-2)" strokeWidth="1.6" />
        </svg>
        <span className="bt-sub">MyInvois · {ein.total} fields</span>
      </div>
      <div className="bento-tile">
        <span className="bt-label">Documents</span>
        <span className="bt-val">{docs.length}<span style={{ fontSize: 12, color:'var(--muted)' }}> files</span></span>
        <svg className="spark" viewBox="0 0 100 28" preserveAspectRatio="none">
          <polyline points={sparkPoints([1, 2, 3, 4, 5, 6, docs.length])} fill="none" stroke="var(--ai)" strokeWidth="1.6" />
        </svg>
        <span className="bt-sub">{docsPct}% of document set</span>
      </div>
    </div>
  );
}

/* ---------- Job header ---------- */
function JobHeaderCard({ job, setJob, stage }: { job: JobHeader; setJob: (p: Partial<JobHeader>) => void; stage: number }) {
  const field = (label: string, node: React.ReactNode) => (
    <div className="field"><label>{label}</label>{node}</div>
  );
  return (
    <section className="card">
      <div className="card-head">
        <h3>Shipment Job</h3>
        <span className="sub">· booking, parties &amp; routing</span>
        <div className="spacer" />
        <span className="code-chip">{job.jobNo}</span>
        <span className={`stage-badge ${stage === STAGES.length ? 'done' : ''}`}>Stage {stage} / {STAGES.length}</span>
      </div>
      <div className="card-body">
        <div className="grid g4">
          {field('Direction', <select value={job.direction} onChange={e => setJob({ direction: e.target.value })}><option>Import</option><option>Export</option><option>Cross-trade</option><option>Transhipment</option></select>)}
          {field('Mode', <select value={job.mode} onChange={e => setJob({ mode: e.target.value })}><option>Sea FCL</option><option>Sea LCL</option><option>Air Freight</option><option>Road</option><option>Rail</option></select>)}
          {field('Carrier Booking Ref', <input value={job.booking} onChange={e => setJob({ booking: e.target.value })} placeholder="BKG-…" />)}
          {field('Customer Ref / PO', <input value={job.custRef} onChange={e => setJob({ custRef: e.target.value })} placeholder="PO / S.O. no." />)}
          {field('Shipper / Exporter', <input value={job.shipper} onChange={e => setJob({ shipper: e.target.value })} placeholder="Exporter name" />)}
          {field('Consignee', <input value={job.consignee} onChange={e => setJob({ consignee: e.target.value })} placeholder="Importer name" />)}
          {field('Notify Party', <input value={job.notify} onChange={e => setJob({ notify: e.target.value })} placeholder="Notify party" />)}
          {field('Carrier / Airline', <input value={job.carrier} onChange={e => setJob({ carrier: e.target.value })} placeholder="e.g. Maersk, SQ Cargo" />)}
          {field('Vessel / Voyage / Flight', <input value={job.vessel} onChange={e => setJob({ vessel: e.target.value })} placeholder="MV OCEAN HARVEST / 014E" />)}
          {field('Port of Loading (POL)', <input value={job.pol} onChange={e => setJob({ pol: e.target.value })} placeholder="Yantian, CN" />)}
          {field('Port of Discharge (POD)', <input value={job.pod} onChange={e => setJob({ pod: e.target.value })} placeholder="Port Klang, MY" />)}
          {field('Place of Delivery', <input value={job.delivery} onChange={e => setJob({ delivery: e.target.value })} placeholder="Kuala Lumpur" />)}
          {field('ETD (planned)', <input type="date" value={job.etd} onChange={e => setJob({ etd: e.target.value })} />)}
          {field('ETA (planned)', <input type="date" value={job.eta} onChange={e => setJob({ eta: e.target.value })} />)}
          {field('ATD (actual)', <input type="date" value={job.atd} onChange={e => setJob({ atd: e.target.value })} />)}
          {field('ATA (actual)', <input type="date" value={job.ata} onChange={e => setJob({ ata: e.target.value })} />)}
          {field('Container / AWB No', <input value={job.ctr} onChange={e => setJob({ ctr: e.target.value })} placeholder="MSKU 4471823 / 618-12345678" />)}
          {field('Container Type', <select value={job.ctrType} onChange={e => setJob({ ctrType: e.target.value })}><option>20GP</option><option>40HC</option><option>40GP</option><option>45HC</option><option>LCL</option><option>Air</option></select>)}
          {field('Packages / Gross Weight (kg)', (
            <div style={{ display:'flex', gap: 6 }}>
              <NumInput value={job.pkgs} onChange={n => setJob({ pkgs: n })} min={0} step={1} style={{ flex:1 }} />
              <NumInput value={job.kg} onChange={n => setJob({ kg: n })} min={0} step={0.01} style={{ flex:1 }} />
            </div>
          ))}
          {field('Volume (m³) / Chargeable (kg)', (
            <div style={{ display:'flex', gap: 6 }}>
              <NumInput value={job.cbm} onChange={n => setJob({ cbm: n })} min={0} step={0.01} style={{ flex:1 }} />
              <NumInput value={job.chg} onChange={n => setJob({ chg: n })} min={0} step={0.01} style={{ flex:1 }} />
            </div>
          ))}
          {field('Sales Person', <input value={job.sales} onChange={e => setJob({ sales: e.target.value })} placeholder="Name" />)}
          {field('Operations Person', <input value={job.ops} onChange={e => setJob({ ops: e.target.value })} placeholder="Name" />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Insights ---------- */
function InsightsRow({ carbon, risk, ein, onCarbonDetail, onRiskDetail, onEinDetail }: {
  carbon: CarbonResult; risk: RiskResult; ein: EInvResult;
  onCarbonDetail: () => void; onRiskDetail: () => void; onEinDetail: () => void;
}) {
  const band = carbon.tCO2e < 2 ? 'Low' : carbon.tCO2e < 10 ? 'Moderate' : 'High';
  const riskLabel = risk.band === 'low' ? 'Low risk' : risk.band === 'mid' ? 'Moderate' : 'High risk';
  return (
    <div className="insights">
      <section className="card">
        <div className="card-head"><h3>Sustainability</h3><span className="sub">GLEC v3 · 2026</span>
          <div className="spacer" /><button className="btn btn-ghost btn-sm" onClick={onCarbonDetail}>Details</button></div>
        <div className="card-body">
          <div className="metric-row">
            <div className="metric"><span className="metric-label">Well-to-Wake</span><span className="metric-val">{carbon.tCO2e.toFixed(2)} t</span></div>
            <div className="metric"><span className="metric-label">Intensity</span><span className="metric-val sm">{carbon.intensity.toFixed(0)} g/t-km</span></div>
          </div>
          <div className="meter carbon"><i style={{ width: Math.min(100, carbon.tCO2e / 20 * 100) + '%' }} /></div>
          <div className="metric-foot">
            {carbon.mode} · {carbon.distance.toLocaleString()} km · {carbon.tonnes.toFixed(1)} t<br />
            Internal carbon cost @ ${CARBON_PRICE}/t ≈ <b>${carbon.cost.toFixed(0)}</b> · Band: <b>{band}</b>
          </div>
        </div>
      </section>
      <section className="card">
        <div className="card-head"><h3>Predictive Risk</h3><span className="sub">AI · beta</span>
          <div className="spacer" /><button className="btn btn-ghost btn-sm" onClick={onRiskDetail}>Details</button></div>
        <div className="card-body">
          <div className="risk-head">
            <span className="risk-score">{risk.score}</span>
            <span className={`risk-band ${risk.band}`}>{riskLabel}</span>
          </div>
          <div className="meter risk"><i style={{ width: risk.score + '%' }} /></div>
          <ul className="risk-reasons">{risk.reasons.slice(0, 3).map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
      </section>
      <section className="card">
        <div className="card-head"><h3>e-Invoice</h3><span className="sub">MyInvois · UBL 2.1</span>
          <div className="spacer" /><button className="btn btn-ghost btn-sm" onClick={onEinDetail}>Preview</button></div>
        <div className="card-body">
          <div className="ein-head"><span className="ein-pct">{ein.pct}%</span><span>ready to submit</span></div>
          <div className="meter ein"><i style={{ width: ein.pct + '%' }} /></div>
          <div className="metric-foot">
            {ein.ok}/{ein.total} fields validated<br />
            {ein.missing.length ? 'Missing: <b>' + ein.missing.join(', ') + '</b>' : '✓ All required fields present'}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Workflow stepper ---------- */
function WorkflowStepper({ stage, tasks, setStage, advanceStage, stageInfo }: {
  stage: number; tasks: Task[]; setStage: (n: number) => void; advanceStage: () => void; stageInfo: StageInfo;
}) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>Workflow Progress</h3>
        <span className="sub">Stage {stageInfo.id} of {STAGES.length} · {stageInfo.name}</span>
        <div className="spacer" />
        <button className="btn btn-sm" disabled={stage <= 1} onClick={() => setStage(stage - 1)}>← Back</button>
        <button className="btn btn-sm btn-primary" disabled={stage >= STAGES.length} onClick={advanceStage}>Advance →</button>
      </div>
      <div className="card-body">
        <div className="stepper">
          {STAGES.map(s => {
            const stageTasks = tasks.filter(t => t.stage === s.id);
            const total = stageTasks.length;
            const done = stageTasks.filter(t => t.done).length;
            let cls = 'pending';
            if (s.id < stage) cls = 'done';
            if (s.id === stage) cls = 'active';
            if (s.id < stage && total > 0 && done < total) cls = 'active';
            if (s.id === stage && total > 0 && done === 0 && stage > 1) cls = 'blocked';
            return (
              <div key={s.id} className={`step ${cls}`} title={s.name} onClick={() => setStage(s.id)}>
                <div className="step-dot">{cls === 'done' ? '✓' : s.id}</div>
                <div className="step-label">{s.name}</div>
                <div className="step-count">{total ? done + '/' + total : ''}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Stage tasks ---------- */
function StageTasksCard({ stage, tasks, setTasks, onLogAudit }: {
  stage: number; tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onLogAudit: (t: string) => void;
}) {
  const stageInfo = STAGES[stage - 1];
  const stageTasks = tasks.filter(t => t.stage === stageInfo.id);
  const done = stageTasks.filter(t => t.done).length;
  const today = new Date(new Date().toDateString());
  return (
    <section className="card">
      <div className="card-head">
        <h3>Stage Tasks</h3>
        <span className="sub">{stageInfo.name}</span>
        <div className="spacer" />
        <span className={`chip ${stageTasks.length && done === stageTasks.length ? 'ok' : ''}`}>{done} / {stageTasks.length} complete</span>
      </div>
      <div className="card-body">
        {stageTasks.length === 0 ? (
          <div className="empty" style={{ padding: 14 }}>No tasks defined for this stage.</div>
        ) : stageTasks.map(t => {
          const overdue = t.due && !t.done && new Date(t.due) < today;
          return (
            <div key={t.id} className={`task ${t.done ? 'done' : ''}`}>
              <input type="checkbox" checked={t.done} onChange={e => {
                const done = e.target.checked;
                setTasks(ts => ts.map(x => x.id === t.id ? { ...x, done } : x));
                onLogAudit(`Task "<b>${escapeHtml(t.title)}</b>" ${done ? 'completed' : 'reopened'}.`);
              }} />
              <div className="task-body">
                <div className="task-title">{t.title}</div>
                <div className="task-meta">
                  <select value={t.owner} onChange={e => setTasks(ts => ts.map(x => x.id === t.id ? { ...x, owner: e.target.value } : x))}>
                    {['Ops','Docs','Customs','Finance','Driver'].map(o => <option key={o}>{o}</option>)}
                  </select>
                  <input type="date" value={t.due} className={overdue ? 'overdue' : ''}
                    onChange={e => setTasks(ts => ts.map(x => x.id === t.id ? { ...x, due: e.target.value } : x))} />
                  {overdue && <span className="task-flag hot">overdue</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Declaration header ---------- */
function DeclarationHeaderCard({ decl, setDecl, importerOptions, declNo }: {
  decl: DeclHeader; setDecl: (p: Partial<DeclHeader>) => void; importerOptions: string[]; declNo: string;
}) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>Customs Declaration</h3>
        <span className="sub">· Import · Form C1</span>
        <div className="spacer" />
        <span className="code-chip">{declNo}</span>
      </div>
      <div className="card-body">
        <div className="grid g4">
          <div className="field"><label>Importer / Consignee</label>
            <select value={decl.importer} onChange={e => setDecl({ importer: e.target.value })}>
              {importerOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="field"><label>Country of Origin (default)</label>
            <select value={decl.defOrigin} onChange={e => setDecl({ defOrigin: e.target.value })}>
              {['CN','SG','JP','US','DE','IN','TH','VN'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>Port of Clearance</label>
            <select value={decl.port} onChange={e => setDecl({ port: e.target.value })}>
              {['Port Klang (West) — MYPKG','Penang — MYPEN','Johor Bahru — MYJHB','KLIA Cargo — MYKUL'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>Incoterm 2020</label>
            <select value={decl.incoterm} onChange={e => setDecl({ incoterm: e.target.value })}>
              {['CIF','FOB','EXW','DDP','CFR'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>Currency</label>
            <select value={decl.currency} onChange={e => setDecl({ currency: e.target.value })}>
              {['MYR','USD','SGD','EUR'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>Exchange Rate (→ MYR)</label>
            <NumInput value={decl.fxRate} step={0.0001} onChange={n => setDecl({ fxRate: n })} />
          </div>
          <div className="field"><label>Tax Rate (SST/VAT %)</label>
            <NumInput value={decl.taxRate} step={0.5} onChange={n => setDecl({ taxRate: n })} />
          </div>
          <div className="field"><label>Declaration Date</label>
            <input type="date" value={decl.declDate} onChange={e => setDecl({ declDate: e.target.value })} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Line items ---------- */
function LineItemsCard(p: {
  lines: Line[]; activeId: number | null; flashId: number | null; fx: number;
  onSelectLine: (id: number) => void;
  onUpdateLine: (id: number, patch: Partial<Line>) => void;
  onRemoveLine: (id: number) => void; onDuplicateLine: (id: number) => void;
  onAiLine: (id: number) => void;
  onAddLine: () => void; onAutoAll: () => void; onLoadSample: () => void;
}) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>Line Items</h3>
        <span className="sub">{p.lines.length} {p.lines.length === 1 ? 'line' : 'lines'}</span>
        <div className="spacer" />
        <button className="btn btn-sm" onClick={p.onAutoAll} title="Classify every line automatically">⚡ Auto-classify all</button>
        <button className="btn btn-sm" onClick={p.onLoadSample}>Load Sample</button>
        <button className="btn btn-sm btn-primary" onClick={p.onAddLine}>＋ Add Line</button>
      </div>
      <div className="tablewrap">
        <table>
          <thead><tr>
            <th className="col-idx">#</th>
            <th className="col-desc">Product Description</th>
            <th className="col-code">HS Code</th>
            <th className="col-origin">Origin</th>
            <th className="col-num">Qty</th>
            <th className="col-num">Unit Value</th>
            <th className="col-duty">Duty %</th>
            <th className="col-act">Actions</th>
          </tr></thead>
          <tbody>
            {p.lines.map((l, i) => (
              <LineRow key={l.id} line={l} idx={i + 1} fx={p.fx}
                selected={p.activeId === l.id} flash={p.flashId === l.id}
                onSelect={() => p.onSelectLine(l.id)}
                onChange={patch => p.onUpdateLine(l.id, patch)}
                onRemove={() => p.onRemoveLine(l.id)}
                onDuplicate={() => p.onDuplicateLine(l.id)}
                onAi={() => p.onAiLine(l.id)} />
            ))}
          </tbody>
        </table>
      </div>
      {p.lines.length === 0 && (
        <div className="empty"><span className="big">▤</span>No line items yet. Click <b>Add Line</b> or <b>Load Sample</b> to begin.</div>
      )}
    </section>
  );
}
function LineRow({ line, idx, fx, selected, flash, onSelect, onChange, onRemove, onDuplicate, onAi }: {
  line: Line; idx: number; fx: number; selected: boolean; flash: boolean;
  onSelect: () => void; onChange: (p: Partial<Line>) => void;
  onRemove: () => void; onDuplicate: () => void; onAi: () => void;
}) {
  const dutyAmt = line.qty * line.val * fx * line.rate / 100;
  const onCodeBlur = () => {
    const formatted = codeFmt(line.code);
    if (formatted !== line.code) onChange({ code: formatted });
  };
  const stop = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (['INPUT', 'SELECT', 'BUTTON'].includes(tag)) e.stopPropagation();
  };
  return (
    <tr className={`${selected ? 'selected' : ''} ${flash ? 'flash' : ''}`} onClick={stop}>
      <td className="col-idx" onClick={onSelect}>{idx}</td>
      <td className="col-desc"><input placeholder="Describe the goods as declared…" value={line.desc}
        onChange={e => onChange({ desc: e.target.value })} onFocus={onSelect} /></td>
      <td className="col-code"><input placeholder="0000.00.00" value={line.code}
        onChange={e => onChange({ code: e.target.value })}
        onFocus={onSelect}
        onBlur={onCodeBlur} /></td>
      <td className="col-origin">
        <select value={line.origin} onChange={e => onChange({ origin: e.target.value })} onFocus={onSelect}>
          {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </td>
      <td className="col-num"><NumInput value={line.qty} min={0} step={1} onChange={n => onChange({ qty: n })} /></td>
      <td className="col-num"><NumInput value={line.val} min={0} step={0.01} onChange={n => onChange({ val: n })} /></td>
      <td className="col-duty">
        <div className="duty-rate">
          <NumInput value={line.rate} min={0} step={0.5} onChange={n => onChange({ rate: n })} />
          <span style={{ color:'#94a3b8' }}>%</span>
        </div>
        <div className="duty-amt">{fmtMYR(dutyAmt)}</div>
      </td>
      <td className="col-act">
        <div className="rowtools">
          <button className="btn btn-ghost btn-sm" title="AI classify this line" onClick={onAi}>⚡</button>
          <button className="btn btn-ghost btn-sm" title="Duplicate line" onClick={onDuplicate}>⧉</button>
          <button className="btn btn-ghost btn-sm" title="Remove line" onClick={onRemove}>✕</button>
        </div>
      </td>
    </tr>
  );
}

/* ---------- Documents ---------- */
function DocumentsCard({ docs, onAddFiles, onRemoveDoc, onOpenDoc, onLoadSampleDocs }: {
  docs: Doc[]; onAddFiles: (f: FileList | File[]) => void;
  onRemoveDoc: (id: number) => void; onOpenDoc: (d: Doc) => void; onLoadSampleDocs: () => void;
}) {
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const present = new Set(docs.map(d => d.type));
  return (
    <section className="card">
      <div className="card-head">
        <h3>Supporting Documents</h3>
        <span className="sub">{docs.length} attached</span>
        <div className="spacer" />
        <button className="btn btn-sm" onClick={onLoadSampleDocs}>Load Sample Docs</button>
        <button className="btn btn-sm btn-primary" onClick={() => fileRef.current?.click()}>＋ Attach PDF</button>
      </div>
      <div className="card-body">
        <div className="doc-grid">
          {docs.map(d => {
            const t = DOC_TYPES[d.type];
            return (
              <div key={d.id} className={`doc-card ${t.cls}`} onClick={() => onOpenDoc(d)} title="Click to preview">
                <div className="doc-thumb">PDF</div>
                <div className="doc-info">
                  <div className="doc-name">{d.name}</div>
                  <div className="doc-meta">{t.label} · {d.pages} page{d.pages > 1 ? 's' : ''} · {kb(d.size)}</div>
                  <span className="doc-badge">{d.source === 'sample' ? 'Sample' : 'Attached'}</span>
                </div>
                <button className="doc-x" title="Remove document" onClick={e => { e.stopPropagation(); onRemoveDoc(d.id); }}>✕</button>
              </div>
            );
          })}
        </div>
        {docs.length === 0 && (
          <div className="empty" style={{ padding:'18px 10px' }}>
            <span className="big">🖹</span>No documents attached. Drop PDFs below or load the sample set.
          </div>
        )}
        <div className={`dropzone ${drag ? 'drag' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDrag(true); }}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDrag(true); }}
          onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDrag(false); }}
          onDrop={e => { e.preventDefault(); e.stopPropagation(); setDrag(false); if (e.dataTransfer?.files) onAddFiles(e.dataTransfer.files); }}>
          <b>Drag &amp; drop PDF files here</b> — or click to browse<br />
          <span style={{ fontSize: 11 }}>Booking · SI · VGM · invoice · packing list · B/L · COO · permits · arrival notice · DO</span>
        </div>
        <input ref={fileRef} type="file" accept="application/pdf,.pdf" multiple hidden
          onChange={e => { if (e.target.files) onAddFiles(e.target.files); e.target.value = ''; }} />
        <div className="doc-req">
          {(Object.entries(DOC_TYPES) as [DocTypeKey, DocTypeInfo][]).map(([k, v]) => {
            const ok = present.has(k);
            return <span key={k} className={`req-pill ${ok ? 'ok' : (v.required ? 'no' : '')}`}>{ok ? '✓' : '○'} {v.label}{v.required ? ' *' : ''}</span>;
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Charges ---------- */
function ChargesCard({ charges, setCharges, totals, onOpenPreset, onAddCharge }: {
  charges: Charge[]; setCharges: React.Dispatch<React.SetStateAction<Charge[]>>;
  totals: ChargesTotals; onOpenPreset: () => void; onAddCharge: () => void;
}) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>Charges &amp; Billing</h3>
        <span className="sub">· buy / sell rates &amp; profit</span>
        <div className="spacer" />
        <button className="btn btn-sm" onClick={onOpenPreset}>＋ Quick add</button>
        <button className="btn btn-sm btn-primary" onClick={onAddCharge}>＋ Add Charge</button>
      </div>
      <div className="tablewrap">
        <table style={{ minWidth: 840 }}>
          <thead><tr>
            <th style={{ width: 80 }}>Code</th><th>Description</th><th style={{ width: 60 }}>Qty</th>
            <th style={{ width: 80 }}>Unit</th><th style={{ width: 100 }}>Buy</th><th style={{ width: 100 }}>Sell</th>
            <th style={{ width: 70 }}>Ccy</th><th style={{ width: 100 }}>Profit</th><th style={{ width: 40 }} />
          </tr></thead>
          <tbody>
            {charges.map((c, i) => {
              const profit = chargeProfit(c);
              return (
                <tr key={i}>
                  <td><input value={c.code} onChange={e => setCharges(cs => cs.map((x, j) => j === i ? { ...x, code: e.target.value } : x))} /></td>
                  <td><input value={c.desc} onChange={e => setCharges(cs => cs.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} /></td>
                  <td><NumInput value={c.qty} min={0} step={1} style={{ textAlign:'right' }} onChange={n => setCharges(cs => cs.map((x, j) => j === i ? { ...x, qty: n } : x))} /></td>
                  <td><input value={c.unit} onChange={e => setCharges(cs => cs.map((x, j) => j === i ? { ...x, unit: e.target.value } : x))} /></td>
                  <td><NumInput value={c.buyRate} min={0} step={0.01} style={{ textAlign:'right' }} onChange={n => setCharges(cs => cs.map((x, j) => j === i ? { ...x, buyRate: n } : x))} /></td>
                  <td><NumInput value={c.sellRate} min={0} step={0.01} style={{ textAlign:'right' }} onChange={n => setCharges(cs => cs.map((x, j) => j === i ? { ...x, sellRate: n } : x))} /></td>
                  <td><input value={c.currency} onChange={e => setCharges(cs => cs.map((x, j) => j === i ? { ...x, currency: e.target.value } : x))} /></td>
                  <td style={{ textAlign:'right', fontWeight: 600, color: profit < 0 ? 'var(--danger)' : 'var(--ok)' }}>{profit.toFixed(2)}</td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => setCharges(cs => cs.filter((_, j) => j !== i))}>✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="charges-summary">
        <div className="cs"><div className="cs-label">Total Buy (MYR)</div><div className="cs-val">{fmtMYR(totals.buyMYR)}</div></div>
        <div className="cs"><div className="cs-label">Total Sell (MYR)</div><div className="cs-val">{fmtMYR(totals.sellMYR)}</div></div>
        <div className="cs"><div className="cs-label">Gross Profit</div><div className={`cs-val ${totals.gp < 0 ? 'loss' : 'gp'}`}>{fmtMYR(totals.gp)}</div></div>
        <div className="cs"><div className="cs-label">Margin</div><div className={`cs-val ${totals.margin < 0 ? 'loss' : ''}`}>{totals.margin.toFixed(1)}%</div></div>
      </div>
    </section>
  );
}

/* ---------- Totals ---------- */
function TotalsCard({ decl, setDecl, totals }: {
  decl: DeclHeader; setDecl: (p: Partial<DeclHeader>) => void;
  totals: { totalValue: number; totalDutyMYR: number; valueMYR: number; tax: number; other: number; grand: number; fx: number };
}) {
  const fxNote = decl.currency === 'MYR'
    ? '· all amounts in MYR'
    : '· 1 ' + decl.currency + ' = ' + (num(decl.fxRate) || 1).toFixed(4) + ' MYR';
  return (
    <section className="card">
      <div className="card-head"><h3>Duty &amp; Tax Summary</h3><span className="sub">{fxNote}</span></div>
      <div className="totals">
        <div className="trow"><span>Total Customs Value <span className="cur">({decl.currency})</span></span><span>{fmtCur(totals.totalValue, decl.currency)}</span></div>
        <div className="trow"><span>Customs Value converted to MYR</span><span>{fmtMYR(totals.valueMYR)}</span></div>
        <div className="trow"><span>Total Import Duty</span><span>{fmtMYR(totals.totalDutyMYR)}</span></div>
        <div className="trow"><span>Tax on (Value + Duty)</span><span>{fmtMYR(totals.tax)}</span></div>
        <div className="trow"><span>Other Charges (handling, port)</span>
          <span><NumInput value={decl.otherCharges} min={0} step={0.01} className="mini-input" onChange={n => setDecl({ otherCharges: n })} /> <span className="cur">MYR</span></span>
        </div>
        <div className="trow grand"><span>Total Payable</span><span>{fmtMYR(totals.grand)}</span></div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   ALT VIEWS (one component, switch by view)
   ══════════════════════════════════════════════════════════ */
interface AltViewProps {
  view: ViewKey; job: JobHeader; decl: DeclHeader; stage: number;
  tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  lines: Line[]; addLine: (d?: Partial<Line>) => number; activeId: number | null;
  selectLine: (id: number) => void;
  applyCodeToLine: (id: number, code: string, rate: number, source?: string) => void;
  docs: Doc[]; handleFiles: (f: FileList | File[]) => void; loadSampleDocs: () => void;
  onOpenDoc: (d: Doc) => void;
  charges: Charge[]; setCharges: React.Dispatch<React.SetStateAction<Charge[]>>;
  milestones: Milestone[]; setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
  carbon: CarbonResult; risk: RiskResult; ein: EInvResult; chargesTot: ChargesTotals;
  totals: { totalValue: number; totalDutyMYR: number; valueMYR: number; tax: number; other: number; grand: number; fx: number };
  setView: (v: ViewKey) => void; setStage: (n: number) => void;
  setRailTab: (t: RailTab) => void;
  saveDraft: () => void; restoreDraft: (n: number) => void;
  autoClassifyAll: () => void;
  pushToast: (msg: string, kind?: ToastKind) => void;
  logAudit: (t: string) => void;
  setInfo: (i: { title: string; body: React.ReactNode } | null) => void;
  onUseImporter: (name: string) => void;
  goStudio: () => void;
}
function AltView(p: AltViewProps) {
  const titles: Record<string, { title: string; sub: string }> = {
    jobs:     { title:'Shipment Jobs', sub:'All forwarder jobs in this workspace — active, saved drafts and lodged declarations.' },
    taskboard:{ title:'Task Board', sub:'Every task across the shipment, grouped by stage.' },
    charges:  { title:'Charges & Billing', sub:'Full buy/sell breakdown of job charges.' },
    milestones:{ title:'Milestones', sub:'Track planned vs actual dates for each step.' },
    sustainability:{ title:'Sustainability & Carbon', sub:'GLEC-aligned emissions, internal carbon pricing and CBAM exposure.' },
    queue:    { title:'Classification Queue', sub:'Every line without a tariff classification, with one-click suggestions.' },
    drafts:   { title:'Draft Declarations', sub:'Locally stored job drafts. Restore any draft into the studio.' },
    submitted:{ title:'Submitted / MRN', sub:'Declarations lodged through this session.' },
    einvoice: { title:'e-Invoice (MyInvois)', sub:'Malaysia LHDN e-Invoice readiness and UBL 2.1 submission preview.' },
    tariff:   { title:'Tariff Schedule', sub:'Search the tariff and push a code onto the selected line.' },
    rulings:  { title:'Rulings & BTIs', sub:'Prior rulings you can rely on when classifying similar goods.' },
    fta:      { title:'FTA Origin Rules', sub:'Check whether goods qualify for preferential duty treatment.' },
    restricted:{ title:'Restricted Goods', sub:'Subheadings that carry permit, standards or licensing obligations.' },
    importers:{ title:'Importer Registry', sub:'Select an importer to populate the declaration header.' },
    products: { title:'Product Master', sub:'Reusable product records — push them straight into the declaration.' },
  };
  const t = titles[p.view] || { title: 'View', sub: '' };
  return (
    <>
      <div className="view-head">
        <div><h2>{t.title}</h2><p>{t.sub}</p></div>
        <div className="spacer" />
        <button className="btn btn-sm" onClick={() => p.setView('studio')}>← Back to Job Workspace</button>
      </div>
      {p.view === 'jobs' && <JobsView {...p} />}
      {p.view === 'taskboard' && <TaskBoardView {...p} />}
      {p.view === 'charges' && <ChargesView {...p} />}
      {p.view === 'milestones' && <MilestonesView {...p} />}
      {p.view === 'sustainability' && <SustainabilityView {...p} />}
      {p.view === 'queue' && <QueueView {...p} />}
      {p.view === 'drafts' && <DraftsView {...p} />}
      {p.view === 'submitted' && <SubmittedView {...p} />}
      {p.view === 'einvoice' && <EInvoiceView {...p} />}
      {p.view === 'tariff' && <TariffView {...p} />}
      {p.view === 'rulings' && <RulingsView {...p} />}
      {p.view === 'fta' && <FtaView {...p} />}
      {p.view === 'restricted' && <RestrictedView {...p} />}
      {p.view === 'importers' && <ImportersView {...p} />}
      {p.view === 'products' && <ProductsView {...p} />}
    </>
  );
}

/* ---------- Jobs View ---------- */
function JobsView(p: AltViewProps) {
  const drafts = readStore<{ id: string; importer?: string; customer?: string; savedAt: string; lineCount?: number; total?: string; stage?: number; header?: JobHeader }[]>(K_DRAFTS, []);
  const subs = readStore<{ mrn: string; declNo: string; importer: string; submittedAt: string; total: string; items?: Line[]; pol?: string; pod?: string }[]>(K_SUBMITTED, []);
  return (
    <>
      <div className="stat-chips">
        <span className="chip ok">Active <b>1</b></span>
        <span className="chip">Drafts <b>{drafts.length}</b></span>
        <span className="chip info">Lodged <b>{subs.length}</b></span>
      </div>
      <div className="card">
        <div className="card-head"><h3>Shipment Jobs</h3>
          <div className="spacer" />
          <button className="btn btn-sm btn-primary" onClick={() => { p.saveDraft(); }}>Save current as draft</button>
        </div>
        <div className="tablewrap">
          <table className="mini" style={{ minWidth: 920 }}>
            <thead><tr><th style={{ width: 130 }}>Job / Ref</th><th>Customer</th><th style={{ width: 100 }}>Mode</th>
              <th style={{ width: 110 }}>Direction</th><th>Routing</th><th style={{ width: 90 }}>Stage</th>
              <th style={{ width: 60 }}>Lines</th><th style={{ width: 70 }}>Docs</th>
              <th style={{ width: 120 }}>Payable</th><th style={{ width: 100 }}>State</th><th style={{ width: 170 }}>Actions</th></tr></thead>
            <tbody>
              <tr>
                <td className="mono">{p.job.jobNo}</td>
                <td>{p.job.consignee || p.decl.importer || '—'}</td>
                <td>{p.job.mode}</td><td>{p.job.direction}</td>
                <td className="row-note">{(p.job.pol || '—') + ' → ' + (p.job.pod || '—')}</td>
                <td>{p.stage} / {STAGES.length}</td>
                <td>{p.lines.length}</td><td>{p.docs.length}</td>
                <td>{fmtMYR(p.totals.grand)}</td>
                <td><span className="chip warn" style={{ fontSize: 10, padding:'2px 7px' }}>Active</span></td>
                <td><button className="btn btn-sm btn-primary" onClick={() => p.setView('studio')}>Open</button></td>
              </tr>
              {drafts.map(d => (
                <tr key={d.id}>
                  <td className="mono">{d.id}</td>
                  <td>{d.customer || d.importer || '—'}</td>
                  <td>{d.header?.mode || '—'}</td><td>{d.header?.direction || '—'}</td>
                  <td className="row-note">{d.header ? ((d.header.pol || '—') + ' → ' + (d.header.pod || '—')) : '—'}</td>
                  <td>{d.stage || 1} / {STAGES.length}</td>
                  <td>{d.lineCount || 0}</td><td>0</td>
                  <td>{d.total || '—'}</td>
                  <td><span className="chip info" style={{ fontSize: 10, padding:'2px 7px' }}>Draft</span></td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => {
                      const next = drafts.filter(x => x.id !== d.id);
                      writeStore(K_DRAFTS, next); p.pushToast('Draft deleted.', 'warn'); p.setView('jobs');
                    }}>Delete</button>
                  </td>
                </tr>
              ))}
              {subs.map((s, i) => (
                <tr key={s.mrn}>
                  <td className="mono">{s.mrn}</td>
                  <td>{s.importer}</td>
                  <td>{'—'}</td><td>{'—'}</td>
                  <td className="row-note">{(s.pol || '—') + ' → ' + (s.pod || '—')}</td>
                  <td>{STAGES.length} / {STAGES.length}</td>
                  <td>{(s.items || []).length}</td><td>0</td>
                  <td>{s.total}</td>
                  <td><span className="chip ok" style={{ fontSize: 10, padding:'2px 7px' }}>Lodged</span></td>
                  <td><button className="btn btn-sm" onClick={() => {
                    p.setInfo({
                      title: 'Lodged · ' + s.mrn,
                      body: (
                        <div className="info-block">
                          <h4>MRN</h4><div className="code-chip">{s.mrn}</div>
                          <h4>Declaration</h4><div className="mono">{s.declNo}</div>
                          <h4>Importer</h4><div>{s.importer}</div>
                          <h4>Total payable</h4><div><b>{s.total}</b></div>
                        </div>
                      ),
                    });
                  }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ---------- Task Board ---------- */
function TaskBoardView(p: AltViewProps) {
  const today = new Date(new Date().toDateString());
  const total = p.tasks.length, done = p.tasks.filter(t => t.done).length;
  const overdue = p.tasks.filter(t => !t.done && t.due && new Date(t.due) < today).length;
  return (
    <>
      <div className="stat-chips">
        <span className="chip">Total <b>{total}</b></span>
        <span className="chip ok">Complete <b>{done}</b></span>
        <span className="chip warn">Open <b>{total - done}</b></span>
        <span className="chip err">Overdue <b>{overdue}</b></span>
        <span className="chip info">Current <b>{STAGES[p.stage-1].name}</b></span>
      </div>
      <div className="board">
        {STAGES.map(s => {
          const stageTasks = p.tasks.filter(t => t.stage === s.id);
          return (
            <div className="board-col" key={s.id}>
              <h5>{s.name}<span style={{ fontWeight: 600, color:'var(--muted)' }}>{stageTasks.filter(t => t.done).length}/{stageTasks.length}</span></h5>
              {stageTasks.length ? stageTasks.map(t => (
                <div key={t.id} className={`board-card ${t.done ? 'done' : ''}`} onClick={() => { p.setStage(s.id); p.setView('studio'); }}>
                  {t.title}
                  <small>{t.owner} · {dateShort(t.due)}{t.done ? ' · done' : (t.due && new Date(t.due) < today ? ' · overdue' : '')}</small>
                </div>
              )) : <div style={{ fontSize: 11, color:'var(--muted)', padding:'6px 2px' }}>No tasks</div>}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ---------- Charges View ---------- */
function ChargesView(p: AltViewProps) {
  const t = p.chargesTot;
  return (
    <>
      <div className="stat-chips">
        <span className="chip">Charges <b>{p.charges.length}</b></span>
        <span className="chip">Buy <b>{fmtMYR(t.buyMYR)}</b></span>
        <span className="chip info">Sell <b>{fmtMYR(t.sellMYR)}</b></span>
        <span className={`chip ${t.gp >= 0 ? 'ok' : 'err'}`}>GP <b>{fmtMYR(t.gp)}</b></span>
        <span className={`chip ${t.margin >= 0 ? 'ok' : 'err'}`}>Margin <b>{t.margin.toFixed(1)}%</b></span>
      </div>
      <div className="card">
        <div className="card-head"><h3>Charges &amp; Billing</h3>
          <div className="spacer" />
          <button className="btn btn-sm" onClick={() => {
            p.setInfo({
              title: 'Quick add charge',
              body: (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap: 8 }}>
                  {CHARGE_PRESETS.map((pr, i) => (
                    <button key={i} className="btn" style={{ justifyContent:'space-between', textAlign:'left', padding:'8px 10px' }}
                      onClick={() => {
                        p.setCharges(cs => [...cs, { code: pr.code, desc: pr.desc, qty: 1, unit: pr.unit, buyRate: pr.buy, sellRate: pr.sell, currency: pr.currency }]);
                        p.setInfo(null); p.pushToast('Added ' + pr.code + '.');
                      }}>
                      <span><b>{pr.code}</b> · {pr.desc}</span>
                      <span style={{ color:'var(--muted)', fontSize: 11 }}>{pr.currency}</span>
                    </button>
                  ))}
                </div>
              ),
            });
          }}>＋ Quick add</button>
          <button className="btn btn-sm btn-primary" onClick={() => p.setCharges(cs => [...cs, { code:'NEW', desc:'New charge', qty:1, unit:'unit', buyRate:0, sellRate:0, currency:'MYR' }])}>＋ Add charge</button>
        </div>
        <div className="tablewrap">
          <table style={{ minWidth: 840 }}>
            <thead><tr><th style={{ width: 80 }}>Code</th><th>Description</th><th style={{ width: 60 }}>Qty</th>
              <th style={{ width: 80 }}>Unit</th><th style={{ width: 100 }}>Buy</th><th style={{ width: 100 }}>Sell</th>
              <th style={{ width: 70 }}>Ccy</th><th style={{ width: 100 }}>Profit</th><th style={{ width: 40 }} /></tr></thead>
            <tbody>
              {p.charges.map((c, i) => {
                const profit = chargeProfit(c);
                return (
                  <tr key={i}>
                    <td><input value={c.code} onChange={e => p.setCharges(cs => cs.map((x, j) => j === i ? { ...x, code: e.target.value } : x))} /></td>
                    <td><input value={c.desc} onChange={e => p.setCharges(cs => cs.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} /></td>
                    <td><NumInput value={c.qty} min={0} step={1} style={{ textAlign:'right' }} onChange={n => p.setCharges(cs => cs.map((x, j) => j === i ? { ...x, qty: n } : x))} /></td>
                    <td><input value={c.unit} onChange={e => p.setCharges(cs => cs.map((x, j) => j === i ? { ...x, unit: e.target.value } : x))} /></td>
                    <td><NumInput value={c.buyRate} min={0} step={0.01} style={{ textAlign:'right' }} onChange={n => p.setCharges(cs => cs.map((x, j) => j === i ? { ...x, buyRate: n } : x))} /></td>
                    <td><NumInput value={c.sellRate} min={0} step={0.01} style={{ textAlign:'right' }} onChange={n => p.setCharges(cs => cs.map((x, j) => j === i ? { ...x, sellRate: n } : x))} /></td>
                    <td><input value={c.currency} onChange={e => p.setCharges(cs => cs.map((x, j) => j === i ? { ...x, currency: e.target.value } : x))} /></td>
                    <td style={{ textAlign:'right', fontWeight: 600, color: profit < 0 ? 'var(--danger)' : 'var(--ok)' }}>{profit.toFixed(2)}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => p.setCharges(cs => cs.filter((_, j) => j !== i))}>✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="charges-summary">
          <div className="cs"><div className="cs-label">Total Buy</div><div className="cs-val">{fmtMYR(t.buyMYR)}</div></div>
          <div className="cs"><div className="cs-label">Total Sell</div><div className="cs-val">{fmtMYR(t.sellMYR)}</div></div>
          <div className="cs"><div className="cs-label">Gross Profit</div><div className={`cs-val ${t.gp < 0 ? 'loss' : 'gp'}`}>{fmtMYR(t.gp)}</div></div>
          <div className="cs"><div className="cs-label">Margin</div><div className="cs-val">{t.margin.toFixed(1)}%</div></div>
        </div>
      </div>
    </>
  );
}

/* ---------- Milestones View ---------- */
function MilestonesView(p: AltViewProps) {
  const today = new Date(new Date().toDateString());
  return (
    <>
      <div className="card">
        <div className="card-head"><h3>Milestones</h3>
          <div className="spacer" />
          <button className="btn btn-sm btn-primary" onClick={() => {
            const map: Record<number, string> = { 1:'booking', 2:'si', 5:'departed', 6:'arrived', 7:'cleared', 8:'delivered', 9:'closed', 10:'closed' };
            const key = map[p.stage];
            const idx = p.milestones.findIndex(m => m.key === key);
            if (idx >= 0) {
              p.setMilestones(ms => ms.map((m, i) => i === idx ? { ...m, actual: todayISO() } : m));
              p.logAudit(`Milestone auto-stamped — ${p.milestones[idx].label}.`);
              p.pushToast('Stamped: ' + p.milestones[idx].label);
            } else p.pushToast('No milestone mapped to this stage.', 'warn');
          }}>Auto-stamp current stage</button>
        </div>
        <div className="card-body">
          <div className="ms-list">
            {p.milestones.map(m => {
              let cls = 'pending';
              if (m.actual) cls = 'done';
              else if (m.planned && new Date(m.planned) < today) cls = 'overdue';
              return (
                <div key={m.key} className={`ms ${cls}`}>
                  <div className="ms-title">{m.label}</div>
                  <div className="ms-meta"><span>Planned <b>{dateShort(m.planned)}</b></span><span>Actual <b>{dateShort(m.actual)}</b></span></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Edit Milestone Dates</h3></div>
        <div className="card-body">
          <div className="tablewrap">
            <table className="mini" style={{ minWidth: 680 }}>
              <thead><tr><th>Milestone</th><th style={{ width: 150 }}>Planned</th><th style={{ width: 150 }}>Actual</th></tr></thead>
              <tbody>
                {p.milestones.map((m, i) => (
                  <tr key={m.key}>
                    <td>{m.label}</td>
                    <td><input type="date" value={m.planned} onChange={e => p.setMilestones(ms => ms.map((x, j) => j === i ? { ...x, planned: e.target.value } : x))} style={{ width:'100%' }} /></td>
                    <td><input type="date" value={m.actual} onChange={e => { p.setMilestones(ms => ms.map((x, j) => j === i ? { ...x, actual: e.target.value } : x)); p.logAudit(`Milestone updated — ${m.label} actual ${e.target.value || 'cleared'}.`); }} style={{ width:'100%' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Sustainability View ---------- */
function SustainabilityView(p: AltViewProps) {
  const c = p.carbon;
  const cbam = p.lines.filter(it => CBAM_CODES.includes((it.code || '').replace(/[^0-9]/g, '').slice(0, 4)));
  return (
    <>
      <div className="stat-chips">
        <span className="chip ok">Well-to-Wake <b>{c.tCO2e.toFixed(2)} tCO₂e</b></span>
        <span className="chip">Intensity <b>{c.intensity.toFixed(0)} g/t-km</b></span>
        <span className="chip">Shadow cost <b>${c.cost.toFixed(0)}</b></span>
        <span className={`chip ${cbam.length ? 'warn' : 'ok'}`}>CBAM-relevant lines <b>{cbam.length}</b></span>
      </div>
      <div className="insights">
        <section className="card">
          <div className="card-head"><h3>Emissions breakdown</h3></div>
          <div className="card-body">
            <div className="metric-row">
              <div className="metric"><span className="metric-label">Mode</span><span className="metric-val sm">{c.mode}</span></div>
              <div className="metric"><span className="metric-label">Distance</span><span className="metric-val sm">{c.distance.toLocaleString()} km</span></div>
              <div className="metric"><span className="metric-label">Cargo weight</span><span className="metric-val sm">{c.tonnes.toFixed(1)} t</span></div>
            </div>
            <div className="metric-row">
              <div className="metric"><span className="metric-label">Factor</span><span className="metric-val sm">{c.factor} kg/t-km</span></div>
              <div className="metric"><span className="metric-label">Total</span><span className="metric-val sm">{c.kg.toFixed(0)} kg CO₂e</span></div>
            </div>
            <div className="meter carbon"><i style={{ width: Math.min(100, c.tCO2e / 20 * 100) + '%' }} /></div>
            <div className="metric-foot">Well-to-wake per GLEC v3. Includes upstream fuel production.</div>
          </div>
        </section>
        <section className="card">
          <div className="card-head"><h3>Mode comparison</h3></div>
          <div className="card-body">
            {Object.entries(GLEC).map(([m, f]) => {
              const co2 = c.tonnes * c.distance * f / 1000;
              const w = Math.min(100, co2 / 20 * 100);
              return (
                <div key={m} style={{ marginBottom: 9 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11.5, color:'var(--muted)' }}>
                    <span>{m}{m === c.mode ? ' · current' : ''}</span><span><b style={{ color:'var(--text)' }}>{co2.toFixed(2)} t</b></span>
                  </div>
                  <div className="meter carbon" style={{ margin:'4px 0 0' }}><i style={{ width: w + '%' }} /></div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="card">
          <div className="card-head"><h3>CBAM exposure</h3></div>
          <div className="card-body">
            {cbam.length ? (
              <>
                <div className="verdict warn" style={{ marginBottom: 10 }}>{cbam.length} line(s) classified under CBAM-covered goods. Embedded emissions reporting applies for EU-bound shipments from 2026.</div>
                <table className="mini"><thead><tr><th>HS</th><th>Goods</th></tr></thead>
                  <tbody>{cbam.map((it, i) => <tr key={i}><td className="mono">{it.code}</td><td>{it.desc}</td></tr>)}</tbody></table>
              </>
            ) : <div className="verdict ok">No CBAM-covered goods detected on this shipment. ✓</div>}
            <div style={{ marginTop: 12, fontSize: 11.5, color:'var(--muted)', lineHeight: 1.5 }}>
              Internal carbon price applied: <b>${CARBON_PRICE}/tCO₂e</b> — adjust per company policy.
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* ---------- Queue View ---------- */
function QueueView(p: AltViewProps) {
  const [suggestions, setSuggestions] = useState<Record<number, ClassResult[] | 'none'>>({});
  const items = p.lines.map((l, i) => ({ ...l, idx: i + 1 }));
  const pending = items.filter(i => !i.code);
  return (
    <>
      <div className="stat-chips">
        <span className="chip">Lines <b>{items.length}</b></span>
        <span className="chip ok">Classified <b>{items.length - pending.length}</b></span>
        <span className={`chip ${pending.length ? 'warn' : 'ok'}`}>Awaiting <b>{pending.length}</b></span>
      </div>
      <div className="card">
        <div className="card-head"><h3>Classification Queue</h3>
          <div className="spacer" />
          <button className="btn btn-sm btn-primary" disabled={!pending.length} onClick={() => {
            const updates: { id: number; code: string; rate: number }[] = [];
            pending.forEach(i => { const res = classify(i.desc); if (res.length) updates.push({ id: i.id, code: res[0].code, rate: res[0].duty }); });
            updates.forEach(u => p.applyCodeToLine(u.id, u.code, u.rate, 'queue auto'));
            p.pushToast('Pending lines classified.');
          }}>⚡ Classify all pending</button>
        </div>
        {items.length ? (
          <div className="tablewrap">
            <table className="mini" style={{ minWidth: 680 }}>
              <thead><tr><th style={{ width: 38 }}>#</th><th>Description</th><th style={{ width: 64 }}>Origin</th>
                <th style={{ width: 120 }}>HS Code</th><th style={{ width: 170 }}>Action</th></tr></thead>
              <tbody>
                {items.map(i => (
                  <React.Fragment key={i.id}>
                    <tr>
                      <td>{i.idx}</td><td>{i.desc}</td><td>{i.origin}</td>
                      <td className="mono">{i.code ? i.code : <span style={{ color:'var(--warn)' }}>— none —</span>}</td>
                      <td>
                        <button className={`btn btn-sm ${i.code ? '' : 'btn-primary'}`} onClick={() => {
                          const res = classify(i.desc);
                          setSuggestions(s => ({ ...s, [i.id]: res.length ? res : 'none' }));
                        }}>⚡ Classify</button>
                        <button className="btn btn-sm" onClick={() => { p.selectLine(i.id); p.setView('studio'); }}>Open line</button>
                      </td>
                    </tr>
                    {suggestions[i.id] && (
                      <tr className="qres">
                        <td />
                        <td colSpan={4}>
                          {suggestions[i.id] === 'none' ? (
                            <span style={{ color:'var(--warn)' }}>⚠ No confident match — escalate for manual classification.</span>
                          ) : (
                            <div style={{ display:'flex', flexDirection:'column', gap: 7 }}>
                              {(suggestions[i.id] as ClassResult[]).slice(0, 3).map((r, k) => (
                                <div key={r.code + k} style={{ display:'flex', alignItems:'center', gap: 10, flexWrap:'wrap' }}>
                                  <span className="mono" style={{ minWidth: 90 }}>{r.code}</span>
                                  <span style={{ flex: 1, minWidth: 180, fontSize: 11.5, color:'var(--muted)' }}>{r.desc}</span>
                                  <span style={{ fontSize: 11, color:'var(--muted)', whiteSpace:'nowrap' }}>{r.duty}% · {r.conf}%</span>
                                  <button className={`btn btn-sm ${k === 0 ? 'btn-primary' : ''}`} onClick={() => {
                                    p.applyCodeToLine(i.id, r.code, r.duty, 'queue');
                                    p.pushToast(`Applied ${r.code}.`);
                                    setSuggestions(s => { const n = { ...s }; delete n[i.id]; return n; });
                                  }}>Apply</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty"><span className="big">▤</span>No line items yet.<br />
            <button className="btn btn-sm btn-primary" style={{ marginTop: 10 }} onClick={() => p.setView('studio')}>Go to Job Workspace</button>
          </div>
        )}
      </div>
    </>
  );
}

/* ---------- Drafts View ---------- */
function DraftsView(p: AltViewProps) {
  const drafts = readStore<{ id: string; importer?: string; customer?: string; savedAt: string; lineCount?: number; total?: string }[]>(K_DRAFTS, []);
  return (
    <>
      <div className="stat-chips">
        <span className="chip">Stored <b>{drafts.length}</b></span>
        <span className="chip">Current lines <b>{p.lines.length}</b></span>
        <span className="chip info">Payable <b>{fmtMYR(p.totals.grand)}</b></span>
      </div>
      <div className="card">
        <div className="card-head"><h3>Saved Drafts</h3>
          <div className="spacer" />
          <button className="btn btn-sm btn-primary" onClick={() => p.saveDraft()}>＋ Save current job</button>
        </div>
        {drafts.length ? (
          <div className="tablewrap">
            <table className="mini" style={{ minWidth: 780 }}>
              <thead><tr><th style={{ width: 130 }}>Reference</th><th>Customer</th><th style={{ width: 170 }}>Saved</th>
                <th style={{ width: 60 }}>Lines</th><th style={{ width: 130 }}>Payable</th><th style={{ width: 170 }}>Actions</th></tr></thead>
              <tbody>
                {drafts.map(d => (
                  <tr key={d.id}>
                    <td className="mono">{d.id}</td>
                    <td>{d.customer || d.importer || '—'}</td>
                    <td>{new Date(d.savedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</td>
                    <td>{d.lineCount || 0}</td>
                    <td>{d.total || '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => {
                        const next = drafts.filter(x => x.id !== d.id);
                        writeStore(K_DRAFTS, next); p.pushToast('Draft deleted.', 'warn'); p.setView('drafts');
                      }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty"><span className="big">🗂</span>No drafts yet. Use <b>Save current job</b> to store one.</div>
        )}
      </div>
    </>
  );
}

/* ---------- Submitted View ---------- */
function SubmittedView(p: AltViewProps) {
  const list = readStore<{ mrn: string; declNo: string; importer: string; submittedAt: string; total: string; items?: Line[] }[]>(K_SUBMITTED, []);
  return (
    <>
      <div className="stat-chips"><span className="chip">Lodged <b>{list.length}</b></span></div>
      <div className="card">
        <div className="card-head"><h3>Submitted Declarations</h3></div>
        {list.length ? (
          <div className="tablewrap">
            <table className="mini" style={{ minWidth: 780 }}>
              <thead><tr><th style={{ width: 200 }}>MRN</th><th>Declaration</th><th>Importer</th>
                <th style={{ width: 170 }}>Submitted</th><th style={{ width: 130 }}>Payable</th><th style={{ width: 100 }}>Details</th></tr></thead>
              <tbody>
                {list.map(s => (
                  <tr key={s.mrn}>
                    <td className="mono">{s.mrn}</td>
                    <td className="mono">{s.declNo}</td>
                    <td>{s.importer}</td>
                    <td>{new Date(s.submittedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</td>
                    <td>{s.total}</td>
                    <td><button className="btn btn-sm" onClick={() => {
                      p.setInfo({
                        title: 'Declaration ' + s.declNo,
                        body: (
                          <div className="info-block">
                            <h4>MRN</h4><div className="code-chip">{s.mrn}</div>
                            <h4>Importer</h4><div>{s.importer}</div>
                            <h4>Submitted</h4><div>{new Date(s.submittedAt).toLocaleString('en-GB')}</div>
                            <h4>Total payable</h4><div><b>{s.total}</b></div>
                            <h4>Lines</h4>
                            <table className="mini"><thead><tr><th>#</th><th>Description</th><th>HS</th><th>Origin</th><th>Qty</th><th>Unit</th><th>Duty</th></tr></thead>
                              <tbody>
                                {(s.items || []).map((it, i) => <tr key={i}><td>{i+1}</td><td>{it.desc}</td><td className="mono">{it.code || '—'}</td><td>{it.origin}</td><td>{it.qty}</td><td>{it.val.toFixed(2)}</td><td>{it.rate}%</td></tr>)}
                                {!(s.items || []).length && <tr><td colSpan={7}>No lines.</td></tr>}
                              </tbody></table>
                          </div>
                        ),
                      });
                    }}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty"><span className="big">📤</span>No declarations lodged yet.</div>}
      </div>
    </>
  );
}

/* ---------- e-Invoice View ---------- */
function EInvoiceView(p: AltViewProps) {
  const payload = buildUblJson(p.job, p.decl, p.lines);
  return (
    <>
      <div className="stat-chips">
        <span className={`chip ${p.ein.pct === 100 ? 'ok' : 'warn'}`}>Readiness <b>{p.ein.pct}%</b></span>
        <span className="chip">Fields <b>{p.ein.ok}/{p.ein.total}</b></span>
        <span className={`chip ${p.ein.missing.length ? 'warn' : 'ok'}`}>Missing <b>{p.ein.missing.length}</b></span>
      </div>
      <div className="card">
        <div className="card-head"><h3>Validation checklist</h3>
          <div className="spacer" />
          <button className="btn btn-sm btn-primary" disabled={p.ein.pct < 100}
            onClick={() => { p.logAudit('e-Invoice submitted to MyInvois (simulated) · UUID ' + (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now())); p.pushToast('e-Invoice submitted. UUID issued.', 'ok'); }}>
            Submit to MyInvois →
          </button>
        </div>
        <div className="card-body">
          {p.ein.checks.map((c, i) => (
            <div key={i} className="check">
              <div className={`ico ${c.ok ? 'pass' : 'fail'}`}>{c.ok ? '✓' : '✕'}</div>
              <div><b>{c.label}</b><small>{c.detail}</small></div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>UBL 2.1 payload</h3>
          <div className="spacer" />
          <button className="btn btn-sm" onClick={() => {
            if (navigator.clipboard) navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(
              () => p.pushToast('JSON copied.'), () => p.pushToast('Copy failed.', 'warn'));
          }}>Copy JSON</button>
        </div>
        <div className="card-body"><pre className="json">{JSON.stringify(payload, null, 2)}</pre></div>
      </div>
    </>
  );
}
function buildUblJson(job: JobHeader, decl: DeclHeader, lines: Line[]) {
  const cur = decl.currency;
  return {
    _note: 'UBL 2.1 e-Invoice · MyInvois profile — simulated for demonstration',
    ID: 'INV-' + declNumFrom(job.jobNo),
    IssueDate: decl.declDate,
    IssueTime: new Date().toISOString().slice(11, 19) + 'Z',
    DocumentCurrencyCode: cur,
    InvoiceTypeCode: '01',
    Supplier: { TIN:'C2584563200', Name: job.shipper || 'Shenzhen Yuanhe Trading Co., Ltd', Country:'CN' },
    Customer: { TIN:'C' + declNumFrom(job.jobNo).slice(-10), Name: decl.importer, Country:'MY' },
    Shipment: { POL: job.pol, POD: job.pod, Mode: job.mode, Container: job.ctr, ETD: job.etd, ETA: job.eta },
    InvoiceLine: lines.map((it, i) => ({
      ID: String(i+1),
      InvoicedQuantity: { value: it.qty, unitCode: 'PCE' },
      LineExtensionAmount: { value: +(it.qty * it.val).toFixed(2), currencyID: cur },
      Item: { Name: it.desc, CommodityClassification: { ItemClassificationCode: it.code || '—' }, OriginCountry: it.origin },
      TaxCategory: { ID: 'SST', Percent: decl.taxRate },
    })),
    LegalMonetaryTotal: {
      LineExtensionAmount: { value: +lines.reduce((a, it) => a + it.qty * it.val, 0).toFixed(2), currencyID: cur },
      TaxInclusiveAmount: { value: 0, currencyID: 'MYR' },
    },
  };
}

/* ---------- Tariff View ---------- */
function TariffView(p: AltViewProps) {
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<'all' | 'free' | 'dutiable'>('all');
  const filtered = useMemo(() => HS_DB.filter(h => {
    const term = q.toLowerCase().trim();
    const matchText = !term || (h.code + ' ' + h.desc + ' ' + h.kw.join(' ')).toLowerCase().includes(term);
    const matchDuty = mode === 'all' || (mode === 'free' && h.duty === 0) || (mode === 'dutiable' && h.duty > 0);
    return matchText && matchDuty;
  }), [q, mode]);
  return (
    <div className="card">
      <div className="card-head"><h3>National Tariff Schedule</h3><span className="sub">{HS_DB.length} subheadings</span></div>
      <div className="card-body" style={{ paddingBottom: 6 }}>
        <div className="view-toolbar">
          <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search code or description…" style={{ minWidth: 260 }} />
          <select value={mode} onChange={e => setMode(e.target.value as 'all' | 'free' | 'dutiable')}>
            <option value="all">All duty rates</option><option value="free">Free (0%)</option><option value="dutiable">Dutiable (&gt; 0%)</option>
          </select>
          <span className="chip">{filtered.length} of {HS_DB.length}</span>
        </div>
      </div>
      <div className="tablewrap">
        <table className="mini" style={{ minWidth: 760 }}>
          <thead><tr><th style={{ width: 130 }}>HS Code</th><th>Description</th><th style={{ width: 64 }}>Duty</th><th style={{ width: 210 }}>Action</th></tr></thead>
          <tbody>
            {filtered.map(h => (
              <tr key={h.code}>
                <td className="mono">{h.code}</td>
                <td>{h.desc}{h.notes.length > 0 && <span title={h.notes[0]} style={{ color:'var(--warn)' }}> ⚠</span>}</td>
                <td>{h.duty}%</td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => {
                    if (p.activeId == null) { p.pushToast('Select a line item first.', 'warn'); return; }
                    p.applyCodeToLine(p.activeId, h.code, h.duty, 'tariff schedule');
                    p.pushToast(`Applied ${h.code}.`);
                  }}>Use on selected line</button>
                  <button className="btn btn-sm" onClick={() => {
                    if (navigator.clipboard) navigator.clipboard.writeText(h.code).then(
                      () => p.pushToast('Copied ' + h.code), () => p.pushToast('Copy failed.', 'warn'));
                  }}>Copy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Rulings View ---------- */
function RulingsView(p: AltViewProps) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    return RULINGS.filter(r => !term || (r.ref + ' ' + r.subject + ' ' + r.code).toLowerCase().includes(term));
  }, [q]);
  return (
    <div className="card">
      <div className="card-head"><h3>Binding Tariff Information</h3></div>
      <div className="card-body" style={{ paddingBottom: 6 }}>
        <div className="view-toolbar">
          <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search reference or subject…" style={{ minWidth: 260 }} />
          <span className="chip">{filtered.length} of {RULINGS.length}</span>
        </div>
      </div>
      <div className="tablewrap">
        <table className="mini" style={{ minWidth: 700 }}>
          <thead><tr><th style={{ width: 150 }}>Reference</th><th>Subject</th><th style={{ width: 120 }}>Code</th><th style={{ width: 200 }}>Action</th></tr></thead>
          <tbody>
            {filtered.map(r => {
              const entry = HS_DB.find(h => h.code === r.code);
              const duty = entry ? entry.duty : 0;
              return (
                <tr key={r.ref}>
                  <td className="mono">{r.ref}</td><td>{r.subject}</td><td className="mono">{r.code}</td>
                  <td><button className="btn btn-sm btn-primary" onClick={() => {
                    if (p.activeId == null) { p.pushToast('Select a line item first.', 'warn'); return; }
                    p.applyCodeToLine(p.activeId, r.code, duty, 'ruling');
                    p.pushToast(`Applied ${r.code}.`);
                  }}>Apply to selected line</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- FTA View ---------- */
function FtaView(p: AltViewProps) {
  const [agreementId, setAgreementId] = useState(FTA_AGREEMENTS[0].id);
  const [origin, setOrigin] = useState(ORIGINS[0]);
  const [rvc, setRvc] = useState(0);
  const [cth, setCth] = useState<'no' | 'yes'>('no');
  const [verdict, setVerdict] = useState<{ cls: 'ok' | 'warn' | 'err'; msg: string } | null>(null);
  return (
    <>
      <div className="card">
        <div className="card-head"><h3>Origin Qualifier</h3></div>
        <div className="card-body">
          <div className="grid g4">
            <div className="field"><label>Agreement</label>
              <select value={agreementId} onChange={e => setAgreementId(e.target.value)}>
                {FTA_AGREEMENTS.map(a => <option key={a.id} value={a.id}>{a.id} — {a.name}</option>)}
              </select></div>
            <div className="field"><label>Origin country</label>
              <select value={origin} onChange={e => setOrigin(e.target.value)}>
                {ORIGINS.map(o => <option key={o}>{o}</option>)}
              </select></div>
            <div className="field"><label>Regional value content (%)</label>
              <NumInput value={rvc} min={0} step={1} onChange={setRvc} /></div>
            <div className="field"><label>Change in tariff heading?</label>
              <select value={cth} onChange={e => setCth(e.target.value as 'no' | 'yes')}><option value="no">No</option><option value="yes">Yes</option></select></div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary btn-sm" onClick={() => {
              const ag = FTA_AGREEMENTS.find(a => a.id === agreementId)!;
              const member = ag.members.includes(origin);
              const rvcOk = rvc >= ag.threshold;
              let cls: 'ok' | 'warn' | 'err';
              let msg: string;
              if (!member) { cls = 'err'; msg = `Origin ${origin} is not a member of ${ag.id}. Preferential treatment is not available.`; }
              else if (rvcOk || cth === 'yes') { cls = 'ok'; msg = `Qualifies under ${ag.id}: ${rvcOk ? `RVC ${rvc}% ≥ ${ag.threshold}%` : 'change in tariff heading satisfied'}.`; }
              else { cls = 'warn'; msg = `${origin} is a member of ${ag.id}, but neither RVC (${rvc}% < ${ag.threshold}%) nor CTH is satisfied.`; }
              setVerdict({ cls, msg });
              p.logAudit(`FTA origin check — ${ag.id} / ${origin} → ${cls === 'ok' ? 'qualifies' : 'does not qualify'}.`);
            }}>Check qualification</button>
          </div>
          {verdict && <div className={`verdict ${verdict.cls}`} style={{ marginTop: 12 }}>{verdict.msg}</div>}
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Agreements in Force</h3></div>
        <div className="tablewrap">
          <table className="mini">
            <thead><tr><th style={{ width: 110 }}>Agreement</th><th>Description</th><th>Members (selection)</th><th style={{ width: 110 }}>RVC threshold</th></tr></thead>
            <tbody>
              {FTA_AGREEMENTS.map(a => (
                <tr key={a.id}><td className="mono">{a.id}</td><td>{a.name}</td><td className="mono">{a.members.join(' · ')}</td><td>{a.threshold}%</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ---------- Restricted View ---------- */
function RestrictedView(p: AltViewProps) {
  const [q, setQ] = useState('');
  const entries = HS_DB.filter(h => h.notes.length);
  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    return entries.filter(h => !term || (h.code + ' ' + h.notes[0]).toLowerCase().includes(term));
  }, [q, entries]);
  return (
    <>
      <div className="stat-chips"><span className="chip warn">With requirements <b>{entries.length}</b></span></div>
      <div className="card">
        <div className="card-head"><h3>Restricted Goods &amp; Permit Triggers</h3></div>
        <div className="card-body" style={{ paddingBottom: 6 }}>
          <div className="view-toolbar">
            <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Filter by code or requirement…" style={{ minWidth: 260 }} />
            <span className="chip">{filtered.length} of {entries.length}</span>
          </div>
        </div>
        <div className="tablewrap">
          <table className="mini" style={{ minWidth: 720 }}>
            <thead><tr><th style={{ width: 120 }}>HS Code</th><th>Requirement</th><th style={{ width: 170 }}>Action</th></tr></thead>
            <tbody>
              {filtered.map(h => (
                <tr key={h.code}>
                  <td className="mono">{h.code}</td><td>{h.notes[0]}</td>
                  <td><button className="btn btn-sm" onClick={() => {
                    p.logAudit(`Restricted goods flag raised for <b>${h.code}</b> — permit review required.`);
                    p.pushToast(`Flagged ${h.code} for permit review.`, 'warn');
                    p.setRailTab('audit');
                  }}>Flag in declaration</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ---------- Importers View ---------- */
function ImportersView(p: AltViewProps) {
  const [custom, setCustom] = useState<Importer[]>(() => readStore(K_IMPORTERS, []));
  const [name, setName] = useState('');
  const [reg, setReg] = useState('');
  const [status, setStatus] = useState('Active');
  const list = [...DEFAULT_IMPORTERS, ...custom];
  return (
    <>
      <div className="card">
        <div className="card-head"><h3>Importer Registry</h3><span className="sub">{list.length} registered</span></div>
        <div className="tablewrap">
          <table className="mini" style={{ minWidth: 720 }}>
            <thead><tr><th>Importer</th><th style={{ width: 150 }}>Registration</th><th>Status</th><th style={{ width: 190 }}>Action</th></tr></thead>
            <tbody>
              {list.map((im, i) => (
                <tr key={im.name + i}>
                  <td><b>{im.name}</b></td><td className="mono">{im.reg}</td><td>{im.status}</td>
                  <td><button className="btn btn-sm btn-primary" onClick={() => p.onUseImporter(im.name)}>Use on declaration</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Add Importer</h3></div>
        <div className="card-body">
          <div className="grid g3">
            <div className="field"><label>Company name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Harbourview Trading Sdn Bhd" /></div>
            <div className="field"><label>Registration no.</label><input value={reg} onChange={e => setReg(e.target.value)} placeholder="e.g. ROI-445210" /></div>
            <div className="field"><label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}><option>Active</option><option>Active · bonded warehouse</option><option>Pending</option></select></div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-sm btn-primary" onClick={() => {
              const n = name.trim();
              const r = reg.trim() || 'ROI-' + Math.floor(100000 + Math.random() * 899999);
              if (!n) { p.pushToast('Enter a company name.', 'warn'); return; }
              const updated = [...custom, { name: n, reg: r, status }];
              writeStore(K_IMPORTERS, updated);
              setCustom(updated);
              p.logAudit(`Importer registered: <b>${escapeHtml(n)}</b>.`);
              p.pushToast('Importer added.'); setName(''); setReg('');
            }}>Add to registry</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Products View ---------- */
function ProductsView(p: AltViewProps) {
  const [products, setProducts] = useState<Line[]>(() => readStore<Line[]>(K_PRODUCTS, []));
  return (
    <>
      <div className="stat-chips">
        <span className="chip">Master <b>{products.length}</b></span>
        <span className="chip">Current lines <b>{p.lines.length}</b></span>
      </div>
      <div className="card">
        <div className="card-head"><h3>Product Master</h3>
          <div className="spacer" />
          <button className="btn btn-sm btn-primary" disabled={!p.lines.length} onClick={() => {
            const master = [...products];
            let added = 0;
            p.lines.forEach(it => {
              const key = (it.desc + '|' + it.code).toLowerCase();
              if (!master.some(m => (m.desc + '|' + m.code).toLowerCase() === key)) {
                master.push({ ...it, id: Date.now() + added }); added++;
              }
            });
            writeStore(K_PRODUCTS, master.slice(0, 100));
            setProducts(master);
            p.logAudit(`Product master updated — ${added} new.`);
            p.pushToast(added ? `${added} saved.` : 'Already in master.', added ? 'ok' : 'warn');
          }}>＋ Save current lines</button>
        </div>
        {products.length ? (
          <div className="tablewrap">
            <table className="mini" style={{ minWidth: 760 }}>
              <thead><tr><th>Description</th><th style={{ width: 120 }}>HS Code</th><th style={{ width: 80 }}>Origin</th>
                <th style={{ width: 80 }}>Unit</th><th style={{ width: 80 }}>Duty</th><th style={{ width: 200 }}>Action</th></tr></thead>
              <tbody>
                {products.map((pr, i) => (
                  <tr key={i}>
                    <td>{pr.desc}</td>
                    <td className="mono">{pr.code || '—'}</td>
                    <td>{pr.origin || '—'}</td>
                    <td>{pr.val ? pr.val.toFixed(2) : '—'}</td>
                    <td>{pr.rate}%</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => {
                        p.addLine({ desc: pr.desc, code: pr.code, origin: pr.origin, qty: 1, val: pr.val, rate: pr.rate });
                        p.pushToast('Product added.'); p.setView('studio');
                      }}>Add as line</button>
                      <button className="btn btn-sm btn-danger" onClick={() => {
                        const next = products.filter((_, j) => j !== i);
                        writeStore(K_PRODUCTS, next); setProducts(next);
                        p.logAudit(`Product <b>${escapeHtml(pr.desc)}</b> removed.`);
                      }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty"><span className="big">📦</span>Product master is empty.</div>}
      </div>
    </>
  );
}