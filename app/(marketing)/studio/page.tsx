'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/* ============================================================
   TYPES
============================================================ */
type Sev = 'warn' | 'danger';
type Layer = 'physical' | 'digital' | 'sync';

type Cargo = {
  name: string;
  hs: string;
  qty: number;
  unit: number;
  gross: number;
  net: number;
  origin: string;
  pkgs: number;
  hazard: string | null;
  tempCtl: boolean;
  permit: string | null;
};

type Declared = {
  hs: string;
  qty: number;
  unit: number;
  value: number;
  gross: number;
  pkgs: number;
  origin: string;
};

type Telemetry = {
  temp: number;
  humidity: number;
  shock: number;
  door: string;
  battery: number;
  signal: number;
  lastPing: number;
};

type Drift = {
  field: string;
  sev: Sev;
  declared: string;
  physical: string;
  declaredVal: number | string;
  physicalVal: number | string;
  delta: string;
  at: string;
};

type Asset = {
  id: string;
  seal: string;
  u: number;
  speed: number;
  status: string;
  stage: number;
  cargo: Cargo;
  pulse: number;
  telemetry: Telemetry;
  declared: Declared;
  drifts: Drift[];
  hist: { temp: number[]; humidity: number[]; shock: number[] };
};

type TwinEvent = { kind: string; title: string; detail: string; time: string };

type Point = { x: number; y: number };
type Packet = { asset: Asset; p: number; speed: number };

type State = {
  assets: Asset[];
  selected: string | null;
  hovered: string | null;
  layers: Record<Layer, boolean>;
  paused: boolean;
  speed: number;
  view: { x: number; y: number; zoom: number };
  events: TwinEvent[];
  eventCount: number;
  packets: Packet[];
  lastReconcile: string | null;
  fidelity: number;
  latency: number;
  rate: number;
  assetSearch: string;
  assetFilter: 'all' | 'drift' | 'clean' | 'critical';
  assetSort: 'id' | 'drift' | 'progress' | 'value' | 'name';
  eventFilter: 'all' | 'iot' | 'edi' | 'cus' | 'doc' | 'alert';
  driftFilter: 'all' | 'warn' | 'danger';
  dragAsset: { id: string; startX: number; startY: number; moved: boolean } | null;
  pan: { sx: number; sy: number; vx: number; vy: number; moved: boolean } | null;
  accum: number;
  nextId: number;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  activeTab: 'tel' | 'rec' | 'ev';
};

type DrawContext = {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  dpr: number;
  physPath: Point[];
  digiPath: Point[];
};

type Toast = { id: number; msg: string; kind: 'ok' | 'warn' | 'err' | 'info' };

type ModalState =
  | { type: 'add' }
  | { type: 'inject' }
  | { type: 'help' }
  | { type: 'confirm'; title: string; msg: string; resolve: (v: boolean) => void }
  | null;

/* ============================================================
   CONSTANTS
============================================================ */
const CARGO_PRESETS: Cargo[] = [
  { name: 'Bluetooth headphones', hs: '8518.30.00', qty: 500, unit: 42.5, gross: 1842, net: 1620, origin: 'CN', pkgs: 42, hazard: null, tempCtl: false, permit: null },
  { name: 'Laptops 14"', hs: '8471.30.00', qty: 75, unit: 3150, gross: 1140, net: 940, origin: 'CN', pkgs: 75, hazard: null, tempCtl: false, permit: null },
  { name: 'USB-C cables 2m', hs: '8544.42.00', qty: 2000, unit: 6.2, gross: 620, net: 540, origin: 'CN', pkgs: 20, hazard: null, tempCtl: false, permit: null },
  { name: 'Cotton t-shirts', hs: '6109.10.00', qty: 1200, unit: 18.9, gross: 284, net: 246, origin: 'VN', pkgs: 24, hazard: null, tempCtl: false, permit: 'Textile labelling' },
  { name: 'Wi-Fi 6 routers', hs: '8517.62.00', qty: 300, unit: 128, gross: 498, net: 420, origin: 'TW', pkgs: 30, hazard: null, tempCtl: false, permit: 'Dual-use' },
  { name: 'Roasted coffee', hs: '0901.21.00', qty: 400, unit: 48, gross: 452, net: 400, origin: 'ID', pkgs: 40, hazard: null, tempCtl: false, permit: 'Food safety' },
  { name: 'Vitamin C capsules', hs: '3004.90.00', qty: 900, unit: 15.5, gross: 198, net: 162, origin: 'IN', pkgs: 18, hazard: null, tempCtl: true, permit: 'NPRA' },
  { name: 'Li-ion power banks', hs: '8507.60.00', qty: 800, unit: 22, gross: 1260, net: 1080, origin: 'CN', pkgs: 40, hazard: 'UN3480', tempCtl: false, permit: 'DG declaration' },
];

const STAGES = ['Origin', 'Transit', 'Transship', 'Arrival', 'Clearance', 'Delivery'];

const WAYPOINTS = [
  { x: 0.07, y: -0.35, name: 'Shanghai', code: 'CNSHA', stage: 0 },
  { x: 0.235, y: 0.55, name: 'Shekou', code: 'CNSHK', stage: 1 },
  { x: 0.43, y: -0.5, name: 'Singapore', code: 'SGSIN', stage: 2 },
  { x: 0.65, y: 0.6, name: 'Port Klang', code: 'MYPKG', stage: 3 },
  { x: 0.82, y: -0.4, name: 'Customs', code: 'MYCUS', stage: 4 },
  { x: 0.945, y: 0.35, name: 'Bayan Lepas DC', code: 'MYDC01', stage: 5 },
];

type DriftTemplate = {
  field: string;
  sev: Sev;
  mk: (a: Asset) => Omit<Drift, 'field' | 'sev' | 'at'>;
};

const DRIFT_TEMPLATES: DriftTemplate[] = [
  {
    field: 'Gross weight', sev: 'warn',
    mk: (c) => ({
      declared: c.declared.gross + ' kg',
      physical: +(c.declared.gross * (1.026 + Math.random() * 0.035)).toFixed(1) + ' kg',
      declaredVal: c.declared.gross,
      physicalVal: +(c.declared.gross * 1.05).toFixed(1),
      delta: 'Declared weight exceeds tolerance by ~2.6%',
    }),
  },
  {
    field: 'Package count', sev: 'warn',
    mk: (c) => ({
      declared: c.declared.pkgs + ' pkgs',
      physical: c.declared.pkgs - 1 + ' pkgs',
      declaredVal: c.declared.pkgs,
      physicalVal: c.declared.pkgs - 1,
      delta: '1 package unaccounted for at count',
    }),
  },
  {
    field: 'Seal integrity', sev: 'danger',
    mk: (c) => ({
      declared: 'Intact · ' + c.seal,
      physical: 'Tampered · ' + c.seal,
      declaredVal: 'Intact',
      physicalVal: 'Tampered',
      delta: 'Seal break detected in transit',
    }),
  },
  {
    field: 'Reefer temperature', sev: 'danger',
    mk: () => ({
      declared: '2 – 8 °C',
      physical: (10.8 + Math.random() * 4.2).toFixed(1) + ' °C',
      declaredVal: 5,
      physicalVal: 12.5,
      delta: 'Temperature excursion 3.1 h above range',
    }),
  },
  {
    field: 'HS classification', sev: 'danger',
    mk: (c) => ({
      declared: c.declared.hs,
      physical: altHs(c.declared.hs),
      declaredVal: c.declared.hs,
      physicalVal: altHs(c.declared.hs),
      delta: 'Physical inspection suggests alternate heading',
    }),
  },
  {
    field: 'Door status', sev: 'warn',
    mk: () => ({
      declared: 'Closed',
      physical: 'Open · ' + nowShort() + ' UTC',
      declaredVal: 'closed',
      physicalVal: 'open',
      delta: 'Unplanned opening logged',
    }),
  },
  {
    field: 'Customs value basis', sev: 'warn',
    mk: (c) => ({
      declared: fmtM(c.declared.value),
      physical: fmtM(c.declared.value * 1.084),
      declaredVal: c.declared.value,
      physicalVal: c.declared.value * 1.084,
      delta: 'Royalty / assist not declared',
    }),
  },
  {
    field: 'DG placard', sev: 'danger',
    mk: (c) => ({
      declared: c.cargo.hazard || 'None',
      physical: 'Missing / illegible',
      declaredVal: c.cargo.hazard || 'None',
      physicalVal: 'Missing',
      delta: 'DG placard not visible on container',
    }),
  },
];

const EV_KINDS = [
  { k: 'iot', t: 'Telemetry packet', f: (a: Asset) => `${a.id} · temp ${a.telemetry.temp.toFixed(1)}°C · RH ${a.telemetry.humidity.toFixed(0)}%` },
  { k: 'iot', t: 'Door sensor ping', f: (a: Asset) => `${a.id} · seal ${a.seal} · state ${a.telemetry.door}` },
  { k: 'edi', t: 'Vessel position update', f: (a: Asset) => `${a.id} · ETA MYPKG revised` },
  { k: 'edi', t: 'Carrier status message', f: (a: Asset) => `${a.id} · loaded on vessel` },
  { k: 'cus', t: 'Customs gateway response', f: (a: Asset) => `${a.id} · declaration accepted for pre-clearance` },
  { k: 'doc', t: 'Document received', f: (a: Asset) => `${a.id} · packing list v2 ingested` },
  { k: 'doc', t: 'Certificate of origin', f: (a: Asset) => `${a.id} · COO ${a.declared.origin} validated` },
];

const STORAGE_KEY = 'brokerdesk.twin.v4';
const UI_KEY = 'brokerdesk.twin.ui.v1';

/* ============================================================
   UTILITIES
============================================================ */
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)] ?? (arr[0] as T);
const fmtM = (n: number) => 'MYR ' + (n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nowT = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const nowShort = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
const num = (v: string) => {
  const n = parseFloat(v);
  return isFinite(n) ? n : 0;
};

function altHs(hs: string): string {
  const m: Record<string, string> = {
    '8518.30.00': '8518.90.00', '8471.30.00': '8471.41.00', '8544.42.00': '8544.49.00',
    '6109.10.00': '6109.90.00', '8517.62.00': '8517.69.00', '0901.21.00': '0901.22.00',
    '3004.90.00': '3004.50.00', '8507.60.00': '8507.80.00',
  };
  return m[hs] || '9999.99.00';
}

/* ============================================================
   STATE FACTORY
============================================================ */
function makeInitialState(): State {
  return {
    assets: [],
    selected: null,
    hovered: null,
    layers: { physical: true, digital: true, sync: true },
    paused: false,
    speed: 1,
    view: { x: 0, y: 0, zoom: 1 },
    events: [],
    eventCount: 0,
    packets: [],
    lastReconcile: null,
    fidelity: 99.2,
    latency: 42,
    rate: 318,
    assetSearch: '',
    assetFilter: 'all',
    assetSort: 'id',
    eventFilter: 'all',
    driftFilter: 'all',
    dragAsset: null,
    pan: null,
    accum: 0,
    nextId: 1000,
    leftCollapsed: false,
    rightCollapsed: false,
    activeTab: 'tel',
  };
}

function makeAsset(data: Cargo | null, i: number, nextId: number): Asset {
  const cargo = data || CARGO_PRESETS[i % CARGO_PRESETS.length]!;
  const id = 'MSKU' + (4471220 + nextId);
  const asset: Asset = {
    id,
    seal: 'SL-' + (88210 + nextId * 3),
    u: i * 0.11 + 0.02,
    speed: 0.0055 + Math.random() * 0.004,
    status: 'in_transit',
    stage: 0,
    cargo,
    pulse: 0,
    telemetry: {
      temp: cargo.tempCtl ? rnd(3.5, 6.5) : rnd(20, 28),
      humidity: rnd(52, 72),
      shock: rnd(0.05, 0.35),
      door: 'closed',
      battery: rnd(82, 99),
      signal: rnd(78, 99),
      lastPing: 0,
    },
    declared: {
      hs: cargo.hs,
      qty: cargo.qty,
      unit: cargo.unit,
      value: cargo.qty * cargo.unit,
      gross: cargo.gross,
      pkgs: cargo.pkgs,
      origin: cargo.origin,
    },
    drifts: [],
    hist: {
      temp: Array.from({ length: 40 }, () => (cargo.tempCtl ? rnd(3.5, 6.5) : rnd(20, 28))),
      humidity: Array.from({ length: 40 }, () => rnd(52, 72)),
      shock: Array.from({ length: 40 }, () => rnd(0.05, 0.35)),
    },
  };
  asset.stage = Math.min(5, Math.floor(asset.u * 6));
  return asset;
}

function addDriftInternal(asset: Asset, sev: Sev, fieldName?: string): Drift | null {
  let tmpl: DriftTemplate | undefined;
  if (fieldName) tmpl = DRIFT_TEMPLATES.find((d) => d.field === fieldName);
  else tmpl = pick(DRIFT_TEMPLATES.filter((d) => d.sev === sev));
  if (!tmpl) return null;
  const d = tmpl.mk(asset);
  const drift: Drift = { field: tmpl.field, sev: tmpl.sev, ...d, at: nowShort() };
  asset.drifts.push(drift);
  return drift;
}

/* ============================================================
   PATH MATH
============================================================ */
function cm(a: number, b: number, c: number, d: number, t: number): number {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
}

function catmull(pts: Point[], samples: number): Point[] {
  const out: Point[] = [];
  const n = pts.length;
  const P = [pts[0]!, ...pts, pts[n - 1]!];
  for (let i = 0; i < samples; i++) {
    const t = (i / (samples - 1)) * (n - 1);
    const seg = clamp(Math.floor(t), 0, n - 2);
    const lt = t - seg;
    const p0 = P[seg]!, p1 = P[seg + 1]!, p2 = P[seg + 2]!, p3 = P[seg + 3]!;
    out.push({ x: cm(p0.x, p1.x, p2.x, p3.x, lt), y: cm(p0.y, p1.y, p2.y, p3.y, lt) });
  }
  return out;
}

function buildPath(W: number, H: number, cy: number, amp: number): Point[] {
  const pts = WAYPOINTS.map((w) => ({ x: w.x * W, y: cy + w.y * amp }));
  return catmull(pts, 600);
}

function rebuildPaths(W: number, H: number): { physPath: Point[]; digiPath: Point[] } {
  const physCY = H * 0.3, physAmp = H * 0.155;
  const digiCY = H * 0.755, digiAmp = H * 0.105;
  return {
    physPath: buildPath(W, H, physCY, physAmp),
    digiPath: buildPath(W, H, digiCY, digiAmp),
  };
}

function pointOn(path: Point[], u: number): Point {
  const idx = clamp(u, 0, 1) * (path.length - 1);
  const i0 = Math.floor(idx), i1 = Math.min(path.length - 1, i0 + 1);
  const t = idx - i0;
  const p0 = path[i0]!, p1 = path[i1]!;
  return { x: lerp(p0.x, p1.x, t), y: lerp(p0.y, p1.y, t) };
}

function xToU(path: Point[], x: number): number {
  if (x <= path[0]!.x) return 0;
  if (x >= path[path.length - 1]!.x) return 1;
  let lo = 0, hi = path.length - 1;
  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (path[mid]!.x < x) lo = mid;
    else hi = mid;
  }
  const pl = path[lo]!, ph = path[hi]!;
  const t = (x - pl.x) / (ph.x - pl.x + 0.0001);
  return (lo + t) / (path.length - 1);
}

/* ============================================================
   CANVAS DRAWING
============================================================ */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBackground(dc: DrawContext, ts: number) {
  const { ctx, W, H } = dc;
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#070c14');
  bg.addColorStop(0.5, '#060a11');
  bg.addColorStop(1, '#080d16');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const step = 34;
  const off = (ts * 0.008) % step;
  ctx.strokeStyle = 'rgba(34,211,238,.035)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = -step + off; x < W + step; x += step) {
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, H);
  }
  for (let y = -step + off; y < H + step; y += step) {
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(W, Math.round(y) + 0.5);
  }
  ctx.stroke();

  const g = ctx.createRadialGradient(W * 0.5, H * 0.42, 40, W * 0.5, H * 0.42, Math.max(W, H) * 0.72);
  g.addColorStop(0, 'rgba(34,211,238,.028)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawStageLabels(dc: DrawContext) {
  const { ctx, W } = dc;
  ctx.save();
  ctx.font = '700 9.5px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  WAYPOINTS.forEach((w) => {
    ctx.fillStyle = 'rgba(125,143,168,.55)';
    ctx.fillText(STAGES[w.stage]!.toUpperCase(), w.x * W, 16);
  });
  ctx.restore();
}

function drawBand(dc: DrawContext, path: Point[], color: string, dashed: boolean, glow: boolean) {
  const { ctx } = dc;
  ctx.save();
  ctx.beginPath();
  path.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  if (glow) {
    ctx.strokeStyle = color.replace(/[\d.]+\)$/, '.15)');
    ctx.lineWidth = 9;
    ctx.stroke();
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = dashed ? 1.4 : 1.8;
  ctx.setLineDash(dashed ? [5, 5] : []);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawWaypoints(dc: DrawContext) {
  const { ctx, physPath } = dc;
  ctx.save();
  WAYPOINTS.forEach((w, i) => {
    const p = pointOn(physPath, i / (WAYPOINTS.length - 1));
    ctx.beginPath();
    ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(10,17,28,.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(59,130,246,.6)';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.font = '650 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(219,230,247,.82)';
    ctx.fillText(w.name, p.x, p.y - 17);
    ctx.font = '500 8.5px ui-monospace, monospace';
    ctx.fillStyle = 'rgba(125,143,168,.7)';
    ctx.fillText(w.code, p.x, p.y + 20);
  });
  ctx.restore();
}

function drawSyncLinks(dc: DrawContext, s: State, t: number) {
  if (!s.layers.sync) return;
  const { ctx, physPath, digiPath } = dc;
  ctx.save();
  s.assets.forEach((a) => {
    const pp = pointOn(physPath, a.u);
    const dp = pointOn(digiPath, a.u);
    const dCount = a.drifts.length;
    const danger = a.drifts.some((d) => d.sev === 'danger');

    let color = 'rgba(16,185,129,.42)';
    if (danger) color = 'rgba(239,68,68,.75)';
    else if (dCount) color = 'rgba(245,158,11,.7)';

    ctx.beginPath();
    ctx.moveTo(pp.x, pp.y);
    ctx.lineTo(dp.x, dp.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = danger ? 2 : 1.3;
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = -(t * 0.03) % 8;
    ctx.stroke();
    ctx.setLineDash([]);

    if (dCount) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.006 + a.u * 10);
      ctx.beginPath();
      ctx.moveTo(pp.x, pp.y);
      ctx.lineTo(dp.x, dp.y);
      ctx.strokeStyle = (danger ? 'rgba(239,68,68,' : 'rgba(245,158,11,') + (0.12 + pulse * 0.18) + ')';
      ctx.lineWidth = 7;
      ctx.stroke();
    }
  });
  ctx.restore();
}

function drawPhysicalChip(dc: DrawContext, a: Asset, s: State, t: number) {
  const { ctx, physPath } = dc;
  const p = pointOn(physPath, a.u);
  const cw = 152, ch = 46;
  const x = p.x - cw / 2, y = p.y - ch / 2;

  const danger = a.drifts.some((d) => d.sev === 'danger');
  const warn = !danger && a.drifts.length > 0;
  const accent = danger ? '#ef4444' : warn ? '#f59e0b' : '#3b82f6';
  const isSel = s.selected === a.id;
  const isHov = s.hovered === a.id;

  ctx.save();
  if (danger || warn) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.005 + a.u * 8);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 44 + pulse * 8, 0, Math.PI * 2);
    ctx.fillStyle = (danger ? 'rgba(239,68,68,' : 'rgba(245,158,11,') + (0.05 + pulse * 0.07) + ')';
    ctx.fill();
  }
  if (isSel || isHov) {
    roundRect(ctx, x - 4, y - 4, cw + 8, ch + 8, 11);
    ctx.strokeStyle = isSel ? 'rgba(34,211,238,.95)' : 'rgba(34,211,238,.45)';
    ctx.lineWidth = isSel ? 2 : 1.2;
    ctx.stroke();
  }
  roundRect(ctx, x, y, cw, ch, 9);
  const g = ctx.createLinearGradient(x, y, x, y + ch);
  g.addColorStop(0, 'rgba(22,35,55,.97)');
  g.addColorStop(1, 'rgba(14,23,37,.97)');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = isSel ? 'rgba(34,211,238,.8)' : 'rgba(45,66,96,.95)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  roundRect(ctx, x, y, cw, ch, 9);
  ctx.clip();
  ctx.fillStyle = accent;
  ctx.fillRect(x, y, 3.5, ch);
  ctx.restore();

  ctx.font = '700 11.5px ui-monospace, monospace';
  ctx.fillStyle = '#a5d8ff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(a.id, x + 11, y + 15);

  ctx.font = '500 9.5px Inter, sans-serif';
  ctx.fillStyle = 'rgba(125,143,168,.9)';
  const nm = a.cargo.name.length > 21 ? a.cargo.name.slice(0, 20) + '…' : a.cargo.name;
  ctx.fillText(nm, x + 11, y + 31);

  const ledColor = danger ? '#ef4444' : warn ? '#f59e0b' : '#10b981';
  ctx.beginPath();
  ctx.arc(x + cw - 13, y + 14, 3.6, 0, Math.PI * 2);
  ctx.fillStyle = ledColor;
  ctx.shadowColor = ledColor;
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.font = '600 9px ui-monospace, monospace';
  ctx.fillStyle = 'rgba(125,143,168,.75)';
  ctx.textAlign = 'right';
  ctx.fillText(Math.round(a.u * 100) + '%', x + cw - 10, y + 33);

  ctx.restore();
}

function drawDigitalChip(dc: DrawContext, a: Asset, s: State, t: number) {
  const { ctx, digiPath } = dc;
  const p = pointOn(digiPath, a.u);
  const cw = 152, ch = 40;
  const x = p.x - cw / 2, y = p.y - ch / 2;

  const danger = a.drifts.some((d) => d.sev === 'danger');
  const warn = !danger && a.drifts.length > 0;
  const accent = danger ? '#ef4444' : warn ? '#f59e0b' : '#22d3ee';
  const isSel = s.selected === a.id;

  ctx.save();
  roundRect(ctx, x, y, cw, ch, 9);
  ctx.fillStyle = 'rgba(34,211,238,.035)';
  ctx.fill();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = isSel
    ? 'rgba(34,211,238,.95)'
    : danger
    ? 'rgba(239,68,68,.7)'
    : warn
    ? 'rgba(245,158,11,.6)'
    : 'rgba(34,211,238,.4)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = '700 8px Inter, sans-serif';
  ctx.fillStyle = 'rgba(34,211,238,.6)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('DECLARED', x + 10, y + 11);

  ctx.font = '700 11px ui-monospace, monospace';
  ctx.fillStyle = '#7dd3fc';
  ctx.fillText(a.declared.hs, x + 10, y + 25);

  ctx.font = '600 9.5px ui-monospace, monospace';
  ctx.fillStyle = 'rgba(125,143,168,.85)';
  ctx.textAlign = 'right';
  ctx.fillText(fmtM(a.declared.value).replace('MYR ', ''), x + cw - 10, y + 25);

  const pulse = 0.5 + 0.5 * Math.sin(t * 0.004 + a.u * 6);
  ctx.beginPath();
  ctx.arc(x + cw - 10, y + 11, 3, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.45 + pulse * 0.55;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawPackets(dc: DrawContext, s: State) {
  if (s.paused) return;
  if (Math.random() < 0.12) {
    const a = pick(s.assets);
    s.packets.push({ asset: a, p: 0, speed: rnd(0.9, 1.7) });
  }
  const { ctx, physPath, digiPath } = dc;
  ctx.save();
  for (let i = s.packets.length - 1; i >= 0; i--) {
    const pk = s.packets[i]!;
    if (pk.p >= 1) {
      s.packets.splice(i, 1);
      continue;
    }
    const pp = pointOn(physPath, pk.asset.u);
    const dp = pointOn(digiPath, pk.asset.u);
    const x = lerp(pp.x, dp.x, pk.p);
    const y = lerp(pp.y, dp.y, pk.p);
    const col = pk.asset.drifts.some((d) => d.sev === 'danger')
      ? '#ef4444'
      : pk.asset.drifts.length
      ? '#f59e0b'
      : '#22d3ee';
    ctx.beginPath();
    ctx.arc(x, y, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.shadowColor = col;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

function drawWatermarks(dc: DrawContext, s: State) {
  const { ctx, H } = dc;
  ctx.save();
  ctx.font = '800 10px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  if (s.layers.physical) {
    ctx.fillStyle = 'rgba(59,130,246,.5)';
    ctx.fillText('PHYSICAL LAYER', 22, H * 0.3 - H * 0.155 - 24);
  }
  if (s.layers.digital) {
    ctx.fillStyle = 'rgba(34,211,238,.45)';
    ctx.fillText('DIGITAL TWIN LAYER', 22, H * 0.755 - H * 0.105 - 24);
  }
  ctx.restore();
}

function drawMinimap(dc: DrawContext, s: State) {
  const { ctx, W, H, physPath, digiPath } = dc;
  const mmW = 160, mmH = 100;
  const mmX = W - mmW - 14, mmY = 14;

  ctx.save();
  ctx.fillStyle = 'rgba(10,17,28,.85)';
  ctx.strokeStyle = 'rgba(29,42,61,1)';
  ctx.lineWidth = 1;
  roundRect(ctx, mmX, mmY, mmW, mmH, 8);
  ctx.fill();
  ctx.stroke();

  const all = [...physPath, ...digiPath];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  all.forEach((p) => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  });

  const pad = 8;
  const sx = (mmW - pad * 2) / (maxX - minX);
  const sy = (mmH - pad * 2) / (maxY - minY);
  const sc = Math.min(sx, sy);
  const ox = mmX + pad + (mmW - pad * 2 - (maxX - minX) * sc) / 2 - minX * sc;
  const oy = mmY + pad + (mmH - pad * 2 - (maxY - minY) * sc) / 2 - minY * sc;

  ctx.strokeStyle = 'rgba(59,130,246,.55)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  physPath.forEach((p, i) => {
    const x = p.x * sc + ox, y = p.y * sc + oy;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();

  ctx.strokeStyle = 'rgba(34,211,238,.4)';
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  digiPath.forEach((p, i) => {
    const x = p.x * sc + ox, y = p.y * sc + oy;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  s.assets.forEach((a) => {
    const p = pointOn(physPath, a.u);
    const danger = a.drifts.some((d) => d.sev === 'danger');
    const warn = !danger && a.drifts.length > 0;
    ctx.fillStyle = danger ? '#ef4444' : warn ? '#f59e0b' : '#10b981';
    ctx.beginPath();
    ctx.arc(p.x * sc + ox, p.y * sc + oy, 2.4, 0, Math.PI * 2);
    ctx.fill();
  });

  const vx = -s.view.x / s.view.zoom;
  const vy = -s.view.y / s.view.zoom;
  const vw = W / s.view.zoom;
  const vh = H / s.view.zoom;
  ctx.strokeStyle = 'rgba(34,211,238,.7)';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(vx * sc + ox, vy * sc + oy, vw * sc, vh * sc);

  ctx.fillStyle = 'rgba(125,143,168,.7)';
  ctx.font = '700 9px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('TWIN MAP', mmX + 8, mmY + 6);
  ctx.restore();
}

function draw(dc: DrawContext, s: State, ts: number) {
  const { ctx, W, H, dpr } = dc;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  drawBackground(dc, ts);

  ctx.setTransform(
    dpr * s.view.zoom,
    0,
    0,
    dpr * s.view.zoom,
    dpr * s.view.x,
    dpr * s.view.y,
  );
  drawStageLabels(dc);
  drawWatermarks(dc, s);
  if (s.layers.physical) drawBand(dc, dc.physPath, 'rgba(59,130,246,.5)', false, true);
  if (s.layers.digital) drawBand(dc, dc.digiPath, 'rgba(34,211,238,.42)', true, true);
  if (s.layers.sync) drawWaypoints(dc);
  if (s.layers.sync) drawSyncLinks(dc, s, ts);
  if (s.layers.digital) s.assets.forEach((a) => drawDigitalChip(dc, a, s, ts));
  if (s.layers.physical) s.assets.forEach((a) => drawPhysicalChip(dc, a, s, ts));
  if (s.layers.sync) drawPackets(dc, s);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawMinimap(dc, s);
}

function hitTest(dc: DrawContext, s: State, mx: number, my: number): Asset | null {
  const wx = (mx - s.view.x) / s.view.zoom;
  const wy = (my - s.view.y) / s.view.zoom;
  for (let i = s.assets.length - 1; i >= 0; i--) {
    const a = s.assets[i]!;
    if (!s.layers.physical) continue;
    const p = pointOn(dc.physPath, a.u);
    if (Math.abs(wx - p.x) < 78 && Math.abs(wy - p.y) < 25) return a;
  }
  return null;
}

/* ============================================================
   SPARKLINE
============================================================ */
function drawSparkline(canvasEl: HTMLCanvasElement, data: number[], color: string) {
  const dpr2 = Math.min(2, window.devicePixelRatio || 1);
  const r = canvasEl.getBoundingClientRect();
  canvasEl.width = r.width * dpr2;
  canvasEl.height = r.height * dpr2;
  const c = canvasEl.getContext('2d');
  if (!c) return;
  c.setTransform(dpr2, 0, 0, dpr2, 0, 0);
  const w = r.width, h = r.height;
  c.clearRect(0, 0, w, h);
  if (data.length < 2) return;
  const lo = Math.min(...data), hi = Math.max(...data);
  const range = hi - lo || 1;

  c.beginPath();
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - lo) / range) * (h - 4) - 2;
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  });
  c.lineTo(w, h);
  c.lineTo(0, h);
  c.closePath();
  const g = c.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, color + '33');
  g.addColorStop(1, color + '00');
  c.fillStyle = g;
  c.fill();

  c.beginPath();
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - lo) / range) * (h - 4) - 2;
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  });
  c.strokeStyle = color;
  c.lineWidth = 1.4;
  c.stroke();

  const lx = w, ly = h - ((data[data.length - 1]! - lo) / range) * (h - 4) - 2;
  c.beginPath();
  c.arc(lx - 1, ly, 2, 0, Math.PI * 2);
  c.fillStyle = color;
  c.fill();
}

/* ============================================================
   STYLES
============================================================ */
const styles = `
:root{
  --bg:#070c14; --panel:#0e1520; --panel-2:#131c2a; --panel-3:#182333;
  --line:#1d2a3d; --line-2:#243449;
  --text:#dbe6f7; --muted:#7d8fa8; --dim:#5a6b82;
  --cyan:#22d3ee; --blue:#3b82f6; --green:#10b981;
  --amber:#f59e0b; --red:#ef4444; --violet:#8b5cf6;
  --left-w: 228px; --right-w: 380px;
}
*{box-sizing:border-box}
html,body{height:100%;margin:0;overflow:hidden}
body{
  background:var(--bg);color:var(--text);font-size:13px;
  font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
}
button,input,select,textarea{font-family:inherit;font-size:inherit;color:inherit}
button{cursor:pointer}
::-webkit-scrollbar{width:9px;height:9px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#22314a;border-radius:9px;border:2px solid transparent;background-clip:content-box}
::-webkit-scrollbar-thumb:hover{background:#31456a;background-clip:content-box}

.app{
  display:grid;
  grid-template-columns:var(--left-w) 1fr var(--right-w);
  grid-template-rows:54px 1fr 44px;
  height:100vh;
  transition:grid-template-columns .26s cubic-bezier(.3,.9,.3,1);
}
.app.collapse-left{ --left-w: 0px; }
.app.collapse-right{ --right-w: 0px; }

.topbar{
  grid-column:1/-1;display:flex;align-items:center;gap:10px;
  background:linear-gradient(180deg,#0d1626,#0a111c);
  border-bottom:1px solid var(--line);padding:0 12px;z-index:40;
}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;color:#fff;white-space:nowrap}
.brand .mark{
  width:28px;height:28px;border-radius:8px;display:grid;place-items:center;
  font-size:14px;font-weight:800;color:#04121f;
  background:linear-gradient(135deg,var(--cyan),var(--blue));
  box-shadow:0 0 18px rgba(34,211,238,.35);
}
.brand small{display:block;font-weight:400;font-size:9.5px;color:var(--dim);letter-spacing:.6px}
.sync-pill{
  display:flex;align-items:center;gap:7px;padding:5px 11px;border-radius:99px;
  font-size:11px;font-weight:650;letter-spacing:.3px;
  background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);color:#34d399;
  cursor:pointer;transition:.15s;white-space:nowrap;
}
.sync-pill:hover{background:rgba(16,185,129,.18)}
.sync-pill.drift{background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.35);color:#fbbf24}
.sync-pill.deg{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.35);color:#f87171}
.sync-dot{width:7px;height:7px;border-radius:50%;background:currentColor;
  box-shadow:0 0 8px currentColor;animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.82)}}
.spacer{flex:1}
.metric{display:flex;flex-direction:column;gap:1px;padding:0 2px;min-width:60px}
.metric .k{font-size:9px;letter-spacing:.7px;text-transform:uppercase;color:var(--dim);font-weight:700}
.metric .v{font-size:13px;font-weight:700;color:var(--text);font-variant-numeric:tabular-nums;font-family:ui-monospace,Menlo,monospace}
.metric .v.cy{color:var(--cyan)} .metric .v.gr{color:var(--green)}
.metric .v.am{color:var(--amber)} .metric .v.rd{color:var(--red)}
.mdiv{width:1px;height:26px;background:var(--line)}
.avatar{width:28px;height:28px;border-radius:50%;background:#1c2c44;display:grid;place-items:center;
  font-weight:700;color:#8fb4ff;font-size:11px;border:1px solid #2a3f5e}

.panel-toggle{
  display:inline-flex;align-items:center;justify-content:center;gap:5px;
  padding:5px 9px;border-radius:7px;border:1px solid var(--line);
  background:var(--panel-2);color:var(--muted);font-size:11px;font-weight:650;
  transition:.14s;white-space:nowrap;
}
.panel-toggle:hover{background:var(--panel-3);color:var(--text);border-color:var(--line-2)}
.panel-toggle.on{background:rgba(34,211,238,.12);border-color:rgba(34,211,238,.35);color:var(--cyan)}
.panel-toggle svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:1.8}

.sidebar{
  background:var(--panel);border-right:1px solid var(--line);
  display:flex;flex-direction:column;overflow:hidden;min-width:0;
  transition:border-color .15s;
}
.app.collapse-left .sidebar{border-right-color:transparent}
.sb-head{padding:10px 12px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:7px;flex:0 0 auto}
.sb-head .row{display:flex;align-items:center;gap:6px}
.sb-head h3{margin:0;font-size:10px;letter-spacing:.9px;text-transform:uppercase;color:var(--dim);font-weight:800;flex:1;white-space:nowrap}
.sb-search{
  width:100%;background:var(--panel-2);border:1px solid var(--line);border-radius:7px;
  padding:6px 9px;color:var(--text);outline:none;font-size:11.5px;
}
.sb-search:focus{border-color:var(--cyan);background:#0d1825}
.sb-search::placeholder{color:var(--dim)}
.sb-filters{display:flex;gap:4px}
.sb-fbtn{
  flex:1;padding:5px 4px;border-radius:6px;border:1px solid var(--line);
  background:var(--panel-2);font-size:10px;font-weight:650;color:var(--dim);
  letter-spacing:.2px;transition:.12s;
}
.sb-fbtn:hover{background:var(--panel-3);color:var(--muted)}
.sb-fbtn.on{background:rgba(34,211,238,.1);border-color:rgba(34,211,238,.35);color:var(--cyan)}
.sb-sort{
  width:100%;background:var(--panel-2);border:1px solid var(--line);border-radius:6px;
  padding:5px 7px;color:var(--muted);outline:none;font-size:10.5px;cursor:pointer;
}
.sb-sort:hover{border-color:var(--line-2)}
.sb-add{
  width:100%;padding:6px;border-radius:7px;border:1px dashed var(--line-2);
  background:transparent;color:var(--muted);font-size:11px;font-weight:650;transition:.12s;
}
.sb-add:hover{background:rgba(34,211,238,.06);border-color:var(--cyan);color:var(--cyan)}
.sb-body{flex:1;overflow-y:auto;padding:8px;min-width:0}
.asset{
  display:block;width:100%;text-align:left;background:var(--panel-2);border:1px solid var(--line);
  border-radius:9px;padding:8px 10px;margin-bottom:6px;transition:.14s;position:relative;
}
.asset:hover{background:var(--panel-3);border-color:#2c4160;transform:translateX(2px)}
.asset.active{border-color:var(--cyan);background:rgba(34,211,238,.07);
  box-shadow:0 0 0 1px rgba(34,211,238,.25),0 0 20px rgba(34,211,238,.08)}
.asset .r1{display:flex;align-items:center;gap:7px;margin-bottom:3px}
.asset .cid{font-family:ui-monospace,Menlo,monospace;font-weight:700;font-size:11.5px;color:#a5d8ff}
.asset .led{width:6px;height:6px;border-radius:50%;flex:0 0 6px;margin-left:auto}
.asset .nm{font-size:11px;color:var(--muted);line-height:1.35;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.asset .r3{display:flex;gap:8px;margin-top:5px;font-size:9.5px;color:var(--dim);
  font-family:ui-monospace,Menlo,monospace;flex-wrap:wrap}
.asset .r3 b{color:#7dd3fc}
.asset-empty{text-align:center;padding:30px 10px;color:var(--dim);font-size:11.5px;line-height:1.6}
.asset-empty .big{font-size:26px;display:block;margin-bottom:6px;opacity:.3}

.main{position:relative;overflow:hidden;background:#060a11;display:flex;flex-direction:column;min-width:0}
.toolbar{
  display:flex;align-items:center;gap:7px;padding:7px 12px;
  background:linear-gradient(180deg,#0c1420,#0a111a);
  border-bottom:1px solid var(--line);flex:0 0 auto;z-index:12;flex-wrap:wrap;
}
.tb-group{display:flex;gap:1px;background:#111b2a;padding:2px;border-radius:8px;border:1px solid var(--line)}
.tb-btn{border:0;background:transparent;padding:5px 10px;border-radius:6px;font-size:11px;
  font-weight:650;color:var(--muted);white-space:nowrap;transition:.12s}
.tb-btn:hover{background:#182740;color:var(--text)}
.tb-btn.on{background:#1c3350;color:var(--cyan);box-shadow:inset 0 0 0 1px rgba(34,211,238,.25)}
.tb-btn.icon{padding:5px 8px;font-size:13px;line-height:1}
.tb-btn:disabled{opacity:.4;cursor:not-allowed}
.btn{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:8px;
  border:1px solid var(--line);background:var(--panel-2);font-weight:650;font-size:11.5px;
  color:var(--muted);transition:.12s;white-space:nowrap}
.btn:hover{background:var(--panel-3);color:var(--text);border-color:var(--line-2)}
.btn-cyan{background:rgba(34,211,238,.12);border-color:rgba(34,211,238,.35);color:var(--cyan)}
.btn-cyan:hover{background:rgba(34,211,238,.22);border-color:rgba(34,211,238,.55)}
.btn-amber{background:rgba(245,158,11,.12);border-color:rgba(245,158,11,.35);color:var(--amber)}
.btn-amber:hover{background:rgba(245,158,11,.22)}
.btn-red{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3);color:#f87171}
.btn-red:hover{background:rgba(239,68,68,.2)}
.btn-green{background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.35);color:#34d399}
.btn-green:hover{background:rgba(16,185,129,.22)}
.btn:disabled{opacity:.4;cursor:not-allowed}
.sep{width:1px;height:20px;background:var(--line);margin:0 2px}

.canvas-wrap{position:relative;flex:1;overflow:hidden;min-height:0;min-width:0}
.twin-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}

.gauge{
  position:absolute;right:14px;top:14px;width:172px;
  background:rgba(10,17,28,.86);border:1px solid var(--line);border-radius:10px;
  padding:11px 13px;backdrop-filter:blur(8px);z-index:14;
  transition:opacity .2s;
}
.gauge .gl{font-size:9px;letter-spacing:.9px;text-transform:uppercase;color:var(--dim);font-weight:800}
.gauge .gv{font-size:24px;font-weight:800;font-family:ui-monospace,Menlo,monospace;
  color:var(--green);line-height:1.1;margin-top:3px;transition:color .3s}
.gauge .gv.am{color:var(--amber)} .gauge .gv.rd{color:var(--red)}
.gauge .bar{height:5px;border-radius:99px;background:#162030;margin-top:8px;overflow:hidden}
.gauge .bar i{display:block;height:100%;border-radius:99px;background:var(--green);transition:width .5s,background .3s}
.gauge .sub{font-size:10px;color:var(--dim);margin-top:7px;font-family:ui-monospace,Menlo,monospace}

.legend{
  position:absolute;left:14px;bottom:14px;display:flex;gap:12px;flex-wrap:wrap;
  background:rgba(10,17,28,.82);border:1px solid var(--line);border-radius:9px;
  padding:8px 12px;backdrop-filter:blur(8px);z-index:14;
}
.lg{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--muted);font-weight:600}
.lg i{width:7px;height:7px;border-radius:2px;display:block}
.lg .dash{width:10px;height:0;border-top:1.5px dashed currentColor}

.zoomctl{position:absolute;right:14px;bottom:14px;display:flex;flex-direction:column;gap:3px;z-index:14}
.zoomctl button{
  width:30px;height:30px;border-radius:7px;border:1px solid var(--line);
  background:rgba(10,17,28,.86);backdrop-filter:blur(8px);
  font-size:13px;font-weight:700;color:var(--muted);display:grid;place-items:center;
  transition:.12s;
}
.zoomctl button:hover{background:#1a2a40;color:var(--cyan);border-color:var(--line-2)}
.zoomctl .zval{font-size:9px;font-weight:800;color:var(--dim);
  background:transparent;border:0;cursor:default;font-family:ui-monospace,monospace;padding:2px 0;height:auto;width:30px;text-align:center}

.tip{
  position:absolute;pointer-events:none;z-index:30;display:none;
  background:rgba(10,17,28,.97);border:1px solid var(--line-2);border-radius:9px;
  padding:9px 11px;font-size:11.5px;box-shadow:0 8px 28px rgba(0,0,0,.6);
  backdrop-filter:blur(8px);max-width:260px;
}
.tip.show{display:block}
.tip .th{font-family:ui-monospace,Menlo,monospace;font-weight:700;color:#a5d8ff;font-size:12px;margin-bottom:5px}
.tip .tr{display:flex;justify-content:space-between;gap:14px;color:var(--muted);line-height:1.55;font-size:11px}
.tip .tr b{color:var(--text);font-weight:650}

.drawer{
  position:absolute;right:0;top:0;bottom:0;width:360px;background:rgba(10,17,28,.98);
  border-left:1px solid var(--line);backdrop-filter:blur(10px);
  z-index:25;display:flex;flex-direction:column;
  transform:translateX(100%);transition:transform .22s cubic-bezier(.3,.9,.3,1);
  box-shadow:-8px 0 32px rgba(0,0,0,.5);
}
.drawer.open{transform:translateX(0)}
.drawer-head{
  display:flex;align-items:flex-start;gap:10px;padding:12px 14px;
  border-bottom:1px solid var(--line);background:#0c1521;
}
.drawer-head > div{flex:1;min-width:0}
.drawer-t{font-size:9px;letter-spacing:.9px;text-transform:uppercase;color:var(--dim);font-weight:800}
.drawer-id{font-family:ui-monospace,Menlo,monospace;font-weight:800;font-size:14px;color:#a5d8ff;margin-top:2px}
.drawer-close{
  width:26px;height:26px;border-radius:6px;border:1px solid var(--line);
  background:var(--panel-2);color:var(--muted);font-size:16px;line-height:1;
  display:grid;place-items:center;transition:.12s;
}
.drawer-close:hover{background:rgba(239,68,68,.15);border-color:rgba(239,68,68,.4);color:#f87171}
.drawer-body{flex:1;overflow-y:auto;padding:14px}

.dr-section{margin-bottom:18px}
.dr-section .dr-h{
  font-size:9.5px;letter-spacing:.9px;text-transform:uppercase;color:var(--dim);
  font-weight:800;margin-bottom:8px;display:flex;align-items:center;gap:8px;
}
.dr-section .dr-h:after{content:"";flex:1;height:1px;background:var(--line)}
.dr-field{display:flex;flex-direction:column;gap:4px;margin-bottom:8px}
.dr-field label{font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--dim)}
.dr-field input, .dr-field select{
  padding:6px 9px;border:1px solid var(--line);border-radius:7px;
  background:var(--panel-2);color:var(--text);font-size:12px;outline:none;width:100%;
  font-family:ui-monospace,Menlo,monospace;
}
.dr-field input:focus, .dr-field select:focus{border-color:var(--cyan);background:#0d1825;
  box-shadow:0 0 0 3px rgba(34,211,238,.1)}
.dr-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dr-meta{font-size:11px;color:var(--muted);line-height:1.65;padding:8px 10px;
  background:var(--panel-2);border:1px solid var(--line);border-radius:7px}
.dr-meta b{color:var(--text);font-weight:650}
.dr-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.dr-actions .btn{flex:1;justify-content:center}

.drift-item{
  border-radius:9px;padding:9px 11px;margin-bottom:7px;border:1px solid;
  background:rgba(245,158,11,.05);border-color:rgba(245,158,11,.25);
}
.drift-item.danger{background:rgba(239,68,68,.06);border-color:rgba(239,68,68,.3)}
.drift-item .dh{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.drift-item .dn{font-size:11.5px;font-weight:700;color:var(--text);flex:1}
.drift-item .sev{font-size:8.5px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;
  padding:2px 6px;border-radius:4px}
.drift-item .sev.w{background:rgba(245,158,11,.2);color:#fbbf24}
.drift-item .sev.d{background:rgba(239,68,68,.2);color:#f87171}
.drift-item .diff{display:grid;grid-template-columns:auto 1fr auto;gap:3px 8px;
  font-size:10.5px;font-family:ui-monospace,Menlo,monospace;align-items:center}
.drift-item .lbl{color:var(--dim);font-size:9px;letter-spacing:.4px;text-transform:uppercase;
  font-family:"Inter",sans-serif;font-weight:700}
.drift-item .pv{color:var(--text);text-align:right}
.drift-item .dv{color:var(--amber);text-align:right;font-weight:700}
.drift-item.danger .dv{color:#f87171}
.drift-item .delta{font-size:10px;color:var(--muted);margin-top:6px;display:flex;gap:5px;align-items:flex-start}
.drift-item .delta span:first-child{color:var(--amber);flex-shrink:0}
.drift-item.danger .delta span:first-child{color:#f87171}
.drift-item .da{display:flex;gap:4px;margin-top:7px}
.drift-item .da button{flex:1;padding:4px;font-size:10px;border-radius:5px}
.no-drift{
  text-align:center;padding:26px 12px;color:var(--green);font-size:11.5px;line-height:1.6;
}
.no-drift .big{font-size:28px;display:block;margin-bottom:4px}

.rail{
  background:var(--panel);border-left:1px solid var(--line);
  display:flex;flex-direction:column;overflow:hidden;min-width:0;
  transition:border-color .15s;
}
.app.collapse-right .rail{border-left-color:transparent}
.tabs{display:flex;border-bottom:1px solid var(--line);background:#0b1220;flex:0 0 auto}
.tab{flex:1;padding:10px 4px;text-align:center;font-size:11px;font-weight:700;color:var(--dim);
  border:0;border-bottom:2px solid transparent;background:none;transition:.14s;letter-spacing:.2px;white-space:nowrap}
.tab:hover{color:var(--muted);background:#0f1828}
.tab.on{color:var(--cyan);border-bottom-color:var(--cyan);background:var(--panel)}
.tab .cnt{display:inline-block;min-width:14px;padding:0 4px;border-radius:99px;font-size:9px;
  background:var(--red);color:#fff;margin-left:4px;font-weight:800;line-height:13px}
.pane{display:none;padding:12px;overflow-y:auto;flex:1;flex-direction:column;min-width:0}
.pane.on{display:flex}

.selcard{
  background:var(--panel-2);border:1px solid var(--line);border-radius:10px;
  padding:10px 12px;margin-bottom:12px;
}
.selcard .h{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.selcard .h .cid{font-family:ui-monospace,Menlo,monospace;font-weight:800;font-size:12.5px;color:#a5d8ff}
.selcard .h .st{margin-left:auto;font-size:9px;font-weight:800;letter-spacing:.5px;
  text-transform:uppercase;padding:2.5px 7px;border-radius:99px}
.st.transit{background:rgba(59,130,246,.15);color:#60a5fa}
.st.port{background:rgba(139,92,246,.15);color:#a78bfa}
.st.customs{background:rgba(245,158,11,.15);color:#fbbf24}
.st.hold{background:rgba(239,68,68,.15);color:#f87171}
.st.released{background:rgba(16,185,129,.15);color:#34d399}
.selcard .meta{font-size:11px;color:var(--muted);line-height:1.65}
.selcard .meta b{color:var(--text)}

.sec-t{font-size:9.5px;letter-spacing:.9px;text-transform:uppercase;color:var(--dim);
  font-weight:800;margin:16px 0 8px;display:flex;align-items:center;gap:8px}
.sec-t:before{content:"";flex:1;height:1px;background:var(--line);order:2}
.sec-t span{order:1}

.tel{display:grid;grid-template-columns:1fr auto;gap:2px 10px;align-items:center;
  padding:8px 0;border-bottom:1px solid rgba(29,42,61,.5)}
.tel:last-child{border-bottom:0}
.tel .tk{font-size:11.5px;color:var(--muted)}
.tel .tv{font-family:ui-monospace,Menlo,monospace;font-size:12.5px;font-weight:700;
  color:var(--text);font-variant-numeric:tabular-nums}
.tel .tv.ok{color:var(--green)} .tel .tv.warn{color:var(--amber)} .tel .tv.bad{color:var(--red)}
.tel .unit{font-size:10px;color:var(--dim);font-weight:500;margin-left:2px}
.spark{grid-column:1/-1;height:22px;margin-top:2px}
.spark canvas{width:100%;height:22px;display:block}

.filter-bar{display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap}
.filter-btn{padding:4px 9px;border-radius:6px;border:1px solid var(--line);
  background:var(--panel-2);font-size:10.5px;font-weight:650;color:var(--dim);transition:.12s}
.filter-btn:hover{background:var(--panel-3);color:var(--muted)}
.filter-btn.on{background:rgba(34,211,238,.1);border-color:rgba(34,211,238,.35);color:var(--cyan)}

.ev{display:flex;gap:9px;padding:8px 0;border-bottom:1px solid rgba(29,42,61,.45);
  font-size:11.5px;line-height:1.45;animation:fadein .3s ease}
@keyframes fadein{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.ev .ei{width:20px;height:20px;border-radius:6px;flex:0 0 20px;display:grid;place-items:center;
  font-size:10px;font-weight:800}
.ev .ei.iot{background:rgba(34,211,238,.13);color:var(--cyan)}
.ev .ei.edi{background:rgba(59,130,246,.13);color:#60a5fa}
.ev .ei.cus{background:rgba(139,92,246,.13);color:#a78bfa}
.ev .ei.alert{background:rgba(239,68,68,.13);color:#f87171}
.ev .ei.doc{background:rgba(16,185,129,.13);color:#34d399}
.ev .eb{flex:1;min-width:0}
.ev .eb b{color:var(--text);font-weight:650}
.ev .eb span{color:var(--muted)}
.ev time{display:block;font-size:9.5px;color:var(--dim);margin-top:2px;
  font-family:ui-monospace,Menlo,monospace}

.reconcile-ok{text-align:center;padding:26px 12px;color:var(--green);font-size:12px;line-height:1.7}
.reconcile-ok .big{font-size:30px;display:block;margin-bottom:6px;opacity:.85}

.statusbar{
  grid-column:1/-1;display:flex;align-items:center;gap:14px;padding:0 14px;
  background:linear-gradient(180deg,#0a111c,#0d1626);border-top:1px solid var(--line);z-index:40;
}
.sb-stat{font-size:11px;color:var(--dim);display:flex;align-items:center;gap:6px;white-space:nowrap}
.sb-stat b{color:var(--muted);font-weight:650;font-variant-numeric:tabular-nums;
  font-family:ui-monospace,Menlo,monospace}
.sb-stat .dot{width:6px;height:6px;border-radius:50%;background:var(--green)}
.sb-stat .dot.am{background:var(--amber)} .sb-stat .dot.rd{background:var(--red)}
.sb-btn{border:0;background:transparent;color:var(--muted);font-size:11px;font-weight:650;
  padding:4px 9px;border-radius:6px;transition:.12s}
.sb-btn:hover{background:#16243a;color:var(--text)}

.edge-tab{
  position:fixed;top:50%;transform:translateY(-50%);
  width:18px;height:64px;
  background:var(--panel);border:1px solid var(--line);
  color:var(--muted);z-index:45;
  display:none;align-items:center;justify-content:center;
  font-size:14px;font-weight:700;
  transition:background .12s,color .12s,width .12s;
  cursor:pointer;
}
.edge-tab.show{display:flex}
.edge-tab:hover{background:#1a2a40;color:var(--cyan);width:22px}
.edge-tab-left{left:0;border-radius:0 8px 8px 0;border-left:0;padding-left:2px}
.edge-tab-right{right:0;border-radius:8px 0 0 8px;border-right:0;padding-right:2px}

.modal-bg{
  position:fixed;inset:0;background:rgba(2,6,12,.7);backdrop-filter:blur(4px);
  z-index:100;display:none;align-items:center;justify-content:center;padding:20px;
}
.modal-bg.show{display:flex;animation:fadein .18s ease}
.modal{
  width:100%;max-width:440px;background:var(--panel);border:1px solid var(--line-2);
  border-radius:12px;padding:18px 20px;box-shadow:0 24px 60px rgba(0,0,0,.6);
  max-height:90vh;overflow-y:auto;
}
.modal.small{max-width:380px}
.modal h3{margin:0 0 14px;font-size:14px;font-weight:700;color:#fff;letter-spacing:.2px}
.modal label{display:flex;flex-direction:column;gap:4px;font-size:10.5px;font-weight:700;
  letter-spacing:.4px;text-transform:uppercase;color:var(--dim);margin-bottom:10px}
.modal input, .modal select, .modal textarea{
  padding:7px 10px;border:1px solid var(--line);border-radius:7px;
  background:var(--panel-2);color:var(--text);font-size:12.5px;outline:none;
  text-transform:none;letter-spacing:0;font-family:inherit;
}
.modal input:focus, .modal select:focus, .modal textarea:focus{
  border-color:var(--cyan);background:#0d1825;box-shadow:0 0 0 3px rgba(34,211,238,.1);
}
.modal input[type=checkbox]{width:auto;padding:0;margin-right:6px;vertical-align:middle;accent-color:var(--cyan)}
.modal .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.modal .actions{display:flex;gap:8px;margin-top:16px;justify-content:flex-end}
.modal .actions .btn{padding:7px 14px;font-size:12px}
.modal .cbrow{display:flex;align-items:center;font-size:11.5px;color:var(--muted);margin-bottom:10px}
.modal p{margin:0 0 14px;font-size:12.5px;color:var(--muted);line-height:1.55}

#toasts{position:fixed;bottom:60px;right:18px;display:flex;flex-direction:column;gap:8px;z-index:200}
.toast{
  background:rgba(10,17,28,.97);border:1px solid var(--line-2);color:var(--text);
  padding:10px 14px;border-radius:9px;font-size:12px;
  box-shadow:0 10px 34px rgba(0,0,0,.65);display:flex;gap:9px;align-items:flex-start;
  animation:slidein .24s cubic-bezier(.2,.9,.3,1.2);max-width:340px;line-height:1.45;
  border-left:3px solid var(--green);backdrop-filter:blur(8px);
}
.toast.warn{border-left-color:var(--amber)} .toast.err{border-left-color:var(--red)}
.toast.info{border-left-color:var(--cyan)}
@keyframes slidein{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}

.hidden{display:none !important}
`;

/* ============================================================
   COMPONENT
============================================================ */
export default function TwinStudio() {
  const stateRef = useRef<State>(makeInitialState());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const drawCtxRef = useRef<DrawContext>({
    ctx: null as unknown as CanvasRenderingContext2D,
    W: 0,
    H: 0,
    dpr: 1,
    physPath: [],
    digiPath: [],
  });
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const toastIdRef = useRef(0);
  const mountedRef = useRef(true);

  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const refresh = forceUpdate;

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<ModalState>(null);

  const addToast = useCallback((msg: string, kind: Toast['kind'] = 'ok') => {
    const id = ++toastIdRef.current;
    setToasts((t) => [...t, { id, msg, kind }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3600);
  }, []);

  /* ---------- Recompute fidelity + gauge ---------- */
  const recomputeFidelity = useCallback(() => {
    const s = stateRef.current;
    let penalty = 0;
    s.assets.forEach((a) => a.drifts.forEach((d) => (penalty += d.sev === 'danger' ? 4.5 : 1.8)));
    s.fidelity = clamp(100 - penalty, 40, 100);
    refresh();
  }, []);

  /* ---------- Path / resize ---------- */
  const resize = useCallback(() => {
    const wrap = canvasWrapRef.current;
    const cv = canvasRef.current;
    if (!wrap || !cv) return;
    const r = wrap.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(r.width * dpr);
    cv.height = Math.round(r.height * dpr);
    const dc = drawCtxRef.current;
    dc.W = r.width;
    dc.H = r.height;
    dc.dpr = dpr;
    const ctx = cv.getContext('2d');
    if (ctx) dc.ctx = ctx;
    const { physPath, digiPath } = rebuildPaths(r.width, r.height);
    dc.physPath = physPath;
    dc.digiPath = digiPath;
  }, []);

  /* ---------- Actions ---------- */
  const selectAsset = useCallback((id: string | null) => {
    stateRef.current.selected = id;
    refresh();
  }, []);

  const toggleLayer = useCallback((layer: Layer) => {
    const s = stateRef.current;
    s.layers[layer] = !s.layers[layer];
    refresh();
  }, []);

  const togglePause = useCallback(() => {
    const s = stateRef.current;
    s.paused = !s.paused;
    refresh();
  }, []);

  const stepOneTick = useCallback(() => {
    const s = stateRef.current;
    if (!s.paused) s.paused = true;
    // inline a mini tick
    s.assets.forEach((a) => {
      a.u = clamp(a.u + 0.02, 0, 1);
      a.stage = Math.min(5, Math.floor(a.u * 6));
    });
    addToast('Stepped one tick.', 'info');
    refresh();
  }, [addToast]);

  const setSpeed = useCallback((v: number) => {
    stateRef.current.speed = v;
    refresh();
  }, []);

  const fitView = useCallback(() => {
    stateRef.current.view = { x: 0, y: 0, zoom: 1 };
    refresh();
  }, []);

  const zoomBy = useCallback((factor: number, cx: number, cy: number) => {
    const s = stateRef.current;
    const z = clamp(s.view.zoom * factor, 0.35, 3.5);
    const wx = (cx - s.view.x) / s.view.zoom;
    const wy = (cy - s.view.y) / s.view.zoom;
    s.view.zoom = z;
    s.view.x = cx - wx * z;
    s.view.y = cy - wy * z;
    refresh();
  }, []);

  const toggleLeft = useCallback(() => {
    const s = stateRef.current;
    s.leftCollapsed = !s.leftCollapsed;
    try {
      localStorage.setItem(
        UI_KEY,
        JSON.stringify({ leftCollapsed: s.leftCollapsed, rightCollapsed: s.rightCollapsed }),
      );
    } catch {}
    refresh();
  }, []);

  const toggleRight = useCallback(() => {
    const s = stateRef.current;
    s.rightCollapsed = !s.rightCollapsed;
    try {
      localStorage.setItem(
        UI_KEY,
        JSON.stringify({ leftCollapsed: s.leftCollapsed, rightCollapsed: s.rightCollapsed }),
      );
    } catch {}
    refresh();
  }, []);

  const resolveDrift = useCallback(
    (asset: Asset, idx: number) => {
      const d = asset.drifts[idx];
      if (!d) return;
      if (d.field === 'Gross weight') asset.declared.gross = d.physicalVal as number;
      else if (d.field === 'Package count') asset.declared.pkgs = d.physicalVal as number;
      else if (d.field === 'HS classification') asset.declared.hs = d.physicalVal as string;
      else if (d.field === 'Customs value basis') asset.declared.value = d.physicalVal as number;
      else if (d.field === 'Seal integrity') asset.seal = asset.seal.replace('Tampered', 'Re-sealed');
      else if (d.field === 'Door status') asset.telemetry.door = 'closed';
      else if (d.field === 'Reefer temperature') asset.telemetry.temp = d.physicalVal as number;

      asset.drifts.splice(idx, 1);
      recomputeFidelity();
      stateRef.current.lastReconcile = nowT();
      stateRef.current.events.unshift({
        kind: 'doc',
        title: `Reconciled ${d.field}`,
        detail: `${asset.id} · digital updated to match physical state`,
        time: nowT(),
      });
      addToast(`Reconciled ${d.field} on ${asset.id}.`, 'ok');
    },
    [recomputeFidelity, addToast],
  );

  const rejectDrift = useCallback(
    (asset: Asset, idx: number) => {
      const d = asset.drifts[idx];
      if (!d) return;
      asset.drifts.splice(idx, 1);
      recomputeFidelity();
      stateRef.current.events.unshift({
        kind: 'doc',
        title: `Rejected drift ${d.field}`,
        detail: `${asset.id} · marked as false positive`,
        time: nowT(),
      });
      addToast(`Drift rejected on ${asset.id}.`, 'info');
    },
    [recomputeFidelity, addToast],
  );

  const reconcileAll = useCallback(async () => {
    const s = stateRef.current;
    const total = s.assets.reduce((sum, a) => sum + a.drifts.length, 0);
    if (!total) {
      addToast('Twin is already fully reconciled.', 'info');
      return;
    }
    const ok = await new Promise<boolean>((resolve) =>
      setModal({ type: 'confirm', title: 'Reconcile All', msg: `Reconcile ${total} divergence(s) across all assets?`, resolve }),
    );
    if (!ok) return;
    s.assets.forEach((a) => (a.drifts = []));
    recomputeFidelity();
    s.lastReconcile = nowT();
    s.events.unshift({
      kind: 'doc',
      title: 'Bulk reconciliation',
      detail: `${total} divergence(s) resolved`,
      time: nowT(),
    });
    addToast(`${total} divergence(s) reconciled.`, 'ok');
    refresh();
  }, [recomputeFidelity, addToast]);

  const deleteAsset = useCallback(
    (id: string) => {
      const s = stateRef.current;
      s.assets = s.assets.filter((a) => a.id !== id);
      s.selected = null;
      recomputeFidelity();
      s.events.unshift({
        kind: 'doc',
        title: 'Asset deleted',
        detail: `${id} removed from twin`,
        time: nowT(),
      });
      addToast(`Deleted ${id}.`, 'warn');
    },
    [recomputeFidelity, addToast],
  );

  const resetTwin = useCallback(async () => {
    const ok = await new Promise<boolean>((resolve) =>
      setModal({
        type: 'confirm',
        title: 'Reset Twin',
        msg: 'Reset the twin to its initial state? All changes will be lost.',
        resolve,
      }),
    );
    if (!ok) return;
    const s = stateRef.current;
    s.events = [];
    s.eventCount = 0;
    s.packets = [];
    s.selected = null;
    s.assets = [];
    for (let i = 0; i < CARGO_PRESETS.length; i++) {
      s.assets.push(makeAsset(null, i, s.nextId++));
    }
    addDriftInternal(s.assets[4]!, 'danger', 'HS classification');
    addDriftInternal(s.assets[7]!, 'danger', 'DG placard');
    addDriftInternal(s.assets[2]!, 'warn', 'Gross weight');
    addDriftInternal(s.assets[6]!, 'warn', 'Customs value basis');
    recomputeFidelity();
    addToast('Twin reset.', 'info');
  }, [recomputeFidelity, addToast]);

  const saveTwin = useCallback(() => {
    try {
      const s = stateRef.current;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          assets: s.assets,
          view: s.view,
          speed: s.speed,
          nextId: s.nextId,
        }),
      );
      addToast('Twin state saved.', 'ok');
    } catch {}
  }, [addToast]);

  const exportTwin = useCallback(() => {
    const s = stateRef.current;
    const payload = {
      exportedAt: new Date().toISOString(),
      fidelity: s.fidelity,
      assets: s.assets.map((a) => ({
        id: a.id,
        seal: a.seal,
        u: a.u,
        stage: a.stage,
        cargo: a.cargo,
        declared: a.declared,
        telemetry: a.telemetry,
        drifts: a.drifts,
      })),
      events: s.events.slice(0, 50),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'twin-state-' + Date.now() + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
    addToast('Twin state exported.', 'ok');
  }, [addToast]);

  /* ---------- Sim tick ---------- */
  const simTick = useCallback(() => {
    const s = stateRef.current;
    s.latency = Math.round(clamp(s.latency + rnd(-9, 9), 18, 180));
    s.rate = Math.round(clamp(s.rate + rnd(-40, 40), 90, 780));

    s.assets.forEach((a) => {
      const t = a.telemetry;
      const target = a.cargo.tempCtl ? 5 : 24;
      const excursion = a.drifts.some((d) => d.field === 'Reefer temperature');
      t.temp += excursion ? rnd(0.15, 0.6) : (target - t.temp) * 0.06 + rnd(-0.35, 0.35);
      if (!excursion) t.temp = clamp(t.temp, a.cargo.tempCtl ? 3 : 19, a.cargo.tempCtl ? 7 : 29);
      else t.temp = clamp(t.temp, 8, 16);

      t.humidity = clamp(t.humidity + rnd(-1.6, 1.6), 42, 84);
      t.shock = clamp(t.shock * 0.92 + rnd(0, 0.12), 0, 1.4);
      t.battery = clamp(t.battery - rnd(0.01, 0.06), 5, 100);
      t.signal = clamp(t.signal + rnd(-2.4, 2.4), 40, 99);
      t.lastPing = Math.round(rnd(1, 12));
      t.door = a.drifts.some((d) => d.field === 'Door status') ? 'open' : 'closed';

      a.hist.temp.push(t.temp);
      a.hist.temp.shift();
      a.hist.humidity.push(t.humidity);
      a.hist.humidity.shift();
      a.hist.shock.push(t.shock);
      a.hist.shock.shift();
    });

    if (Math.random() < 0.42) {
      const kind = pick(EV_KINDS);
      const a = pick(s.assets);
      if (a) {
        s.events.unshift({ kind: kind.k, title: kind.t, detail: kind.f(a), time: nowT() });
        s.events = s.events.slice(0, 100);
        s.eventCount++;
      }
    }

    if (Math.random() < 0.055) {
      const candidates = s.assets.filter((a) => a.drifts.length < 3);
      if (candidates.length) {
        const a = pick(candidates);
        const sev: Sev = Math.random() < 0.4 ? 'danger' : 'warn';
        const d = addDriftInternal(a, sev);
        if (d) {
          recomputeFidelity();
          s.events.unshift({
            kind: 'alert',
            title: `Divergence — ${d.field}`,
            detail: `${a.id} · physical ${d.physical} vs declared ${d.declared}`,
            time: nowT(),
          });
          addToast(`Drift on ${a.id}: ${d.field}`, sev === 'danger' ? 'err' : 'warn');
        }
      }
    }
  }, [recomputeFidelity, addToast]);

  /* ---------- Init assets on mount ---------- */
  useEffect(() => {
    const s = stateRef.current;
    // Try restore
    let restored = false;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.assets && d.assets.length) {
          s.assets = d.assets;
          s.view = d.view || { x: 0, y: 0, zoom: 1 };
          s.speed = d.speed || 1;
          s.nextId = d.nextId || 1000;
          restored = true;
        }
      }
    } catch {}

    if (!restored) {
      for (let i = 0; i < CARGO_PRESETS.length; i++) {
        s.assets.push(makeAsset(null, i, s.nextId++));
      }
      addDriftInternal(s.assets[4]!, 'danger', 'HS classification');
      addDriftInternal(s.assets[7]!, 'danger', 'DG placard');
      addDriftInternal(s.assets[2]!, 'warn', 'Gross weight');
      addDriftInternal(s.assets[6]!, 'warn', 'Customs value basis');
      s.events.unshift({ kind: 'iot', title: 'Telemetry gateway connected', detail: '8 asset streams online · MQTT broker MYPKG-01', time: nowT() });
      s.events.unshift({ kind: 'edi', title: 'Carrier feed subscribed', detail: 'Vessel schedules + container status events', time: nowT() });
      s.events.unshift({ kind: 'cus', title: 'Customs gateway handshake', detail: 'Pre-clearance channel established', time: nowT() });
      s.events.unshift({ kind: 'doc', title: 'Twin session initialised', detail: `${s.assets.length} assets mirrored · fidelity ${s.fidelity.toFixed(1)}%`, time: nowT() });
    } else {
      s.events.unshift({ kind: 'doc', title: 'Twin restored from local storage', detail: `${s.assets.length} assets recovered`, time: nowT() });
    }

    s.lastReconcile = nowT();
    recomputeFidelity();

    // Load UI prefs
    try {
      const raw = localStorage.getItem(UI_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.leftCollapsed) s.leftCollapsed = true;
        if (d.rightCollapsed) s.rightCollapsed = true;
      }
    } catch {}

    refresh();

    setTimeout(() => {
      if (mountedRef.current) addToast('Studio ready. Press [ or ] to collapse panels.', 'info');
    }, 600);
  }, [recomputeFidelity, addToast]);

  /* ---------- RAF loop ---------- */
  useEffect(() => {
    mountedRef.current = true;
    resize();

    const frame = (ts: number) => {
      const s = stateRef.current;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000) || 0.016;
      lastTsRef.current = ts;

      if (!s.paused) {
        s.accum += dt * s.speed;
        while (s.accum > 1.4) {
          s.accum -= 1.4;
          simTick();
        }
        s.assets.forEach((a) => {
          a.u = Math.min(1, a.u + a.speed * s.speed * dt);
          a.stage = Math.min(5, Math.floor(a.u * 6));
        });
        s.packets.forEach((pk) => (pk.p += pk.speed * dt * s.speed));
        s.packets = s.packets.filter((pk) => pk.p < 1);
      }

      const dc = drawCtxRef.current;
      if (dc.ctx) draw(dc, s, ts);
      rafRef.current = requestAnimationFrame(frame);
    };

    lastTsRef.current = performance.now();
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [resize, simTick]);

  /* ---------- ResizeObserver ---------- */
  useEffect(() => {
    const wrap = canvasWrapRef.current;
    if (!wrap) return;
    if (typeof ResizeObserver === 'undefined') {
      const h = () => {
        resize();
        refresh();
      };
      window.addEventListener('resize', h);
      return () => window.removeEventListener('resize', h);
    }
    const ro = new ResizeObserver(() => {
      resize();
      refresh();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [resize]);

  /* ---------- Interval refresh ---------- */
  useEffect(() => {
    const id = setInterval(() => refresh(), 500);
    return () => clearInterval(id);
  }, []);

  /* ---------- Keyboard ---------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.matches?.('input, textarea, select')) return;
      const key = e.key.toLowerCase();

      if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepOneTick();
      } else if (key === 'f') {
        e.preventDefault();
        fitView();
      } else if (key === 'r') {
        e.preventDefault();
        void reconcileAll();
      } else if (key === 'i') {
        e.preventDefault();
        setModal({ type: 'inject' });
      } else if (key === 'a') {
        e.preventDefault();
        setModal({ type: 'add' });
      } else if (key === '[') {
        e.preventDefault();
        toggleLeft();
      } else if (key === ']') {
        e.preventDefault();
        toggleRight();
      } else if (e.key === 'Escape') {
        selectAsset(null);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [togglePause, stepOneTick, fitView, reconcileAll, toggleLeft, toggleRight, selectAsset]);

  /* ---------- Canvas pointer handlers ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dc = drawCtxRef.current;

    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      const hit = hitTest(dc, stateRef.current, mx, my);
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}
      if (hit) {
        selectAsset(hit.id);
        stateRef.current.dragAsset = { id: hit.id, startX: mx, startY: my, moved: false };
        canvas.style.cursor = 'grabbing';
      } else {
        stateRef.current.pan = {
          sx: mx,
          sy: my,
          vx: stateRef.current.view.x,
          vy: stateRef.current.view.y,
          moved: false,
        };
        canvas.style.cursor = 'grabbing';
      }
    };

    const onMove = (e: PointerEvent) => {
      const s = stateRef.current;
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;

      if (s.dragAsset) {
        const a = s.assets.find((x) => x.id === s.dragAsset!.id);
        if (a) {
          const wx = (mx - s.view.x) / s.view.zoom;
          a.u = clamp(xToU(dc.physPath, wx), 0, 1);
          a.stage = Math.min(5, Math.floor(a.u * 6));
          if (Math.abs(mx - s.dragAsset.startX) > 2 || Math.abs(my - s.dragAsset.startY) > 2) {
            s.dragAsset.moved = true;
          }
        }
        return;
      }
      if (s.pan) {
        s.view.x = s.pan.vx + (mx - s.pan.sx);
        s.view.y = s.pan.vy + (my - s.pan.sy);
        if (Math.abs(mx - s.pan.sx) > 2 || Math.abs(my - s.pan.sy) > 2) s.pan.moved = true;
        return;
      }

      const hit = hitTest(dc, s, mx, my);
      s.hovered = hit ? hit.id : null;
      canvas.style.cursor = hit ? 'grab' : 'default';

      const tip = tipRef.current;
      if (!tip) return;
      if (hit) {
        const drifts = hit.drifts.length;
        tip.innerHTML = `
          <div class="th">${hit.id}</div>
          <div class="tr"><span>Seal</span><b>${hit.seal}</b></div>
          <div class="tr"><span>Cargo</span><b>${esc(hit.cargo.name)}</b></div>
          <div class="tr"><span>HS Code</span><b>${hit.declared.hs}</b></div>
          <div class="tr"><span>Value</span><b>${fmtM(hit.declared.value)}</b></div>
          <div class="tr"><span>Progress</span><b>${Math.round(hit.u * 100)}% · ${STAGES[hit.stage]}</b></div>
          <div class="tr"><span>Drifts</span><b style="color:${drifts ? (hit.drifts.some((d) => d.sev === 'danger') ? '#f87171' : '#fbbf24') : '#34d399'}">${drifts || 'None'}</b></div>
        `;
        tip.classList.add('show');
        const tw = tip.offsetWidth, th = tip.offsetHeight;
        let tx = mx + 16, ty = my - th / 2;
        if (tx + tw > dc.W - 10) tx = mx - tw - 16;
        ty = clamp(ty, 8, dc.H - th - 8);
        tip.style.left = tx + 'px';
        tip.style.top = ty + 'px';
      } else {
        tip.classList.remove('show');
      }
    };

    const onUp = () => {
      const s = stateRef.current;
      if (s.dragAsset) {
        s.dragAsset = null;
        canvas.style.cursor = 'grab';
        refresh();
        return;
      }
      if (s.pan) {
        const moved = s.pan.moved;
        s.pan = null;
        canvas.style.cursor = 'default';
        if (!moved) selectAsset(null);
      }
    };

    const onLeave = () => {
      stateRef.current.hovered = null;
      tipRef.current?.classList.remove('show');
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top);
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [selectAsset, zoomBy]);

  /* ---------- Derived data ---------- */
  const s = stateRef.current;

  const filteredAssets = useMemo(() => {
    const q = s.assetSearch.toLowerCase().trim();
    let list = s.assets.filter((a) => {
      if (
        q &&
        !(
          a.id.toLowerCase().includes(q) ||
          a.cargo.name.toLowerCase().includes(q) ||
          a.declared.hs.includes(q)
        )
      )
        return false;
      const dCount = a.drifts.length;
      const hasDanger = a.drifts.some((d) => d.sev === 'danger');
      if (s.assetFilter === 'drift' && dCount === 0) return false;
      if (s.assetFilter === 'clean' && dCount > 0) return false;
      if (s.assetFilter === 'critical' && !hasDanger) return false;
      return true;
    });
    list = [...list];
    if (s.assetSort === 'drift') list.sort((a, b) => b.drifts.length - a.drifts.length);
    else if (s.assetSort === 'progress') list.sort((a, b) => b.u - a.u);
    else if (s.assetSort === 'value') list.sort((a, b) => b.declared.value - a.declared.value);
    else if (s.assetSort === 'name') list.sort((a, b) => a.cargo.name.localeCompare(b.cargo.name));
    else list.sort((a, b) => a.id.localeCompare(b.id));
    return list;
  }, [s, s.assets, s.assetSearch, s.assetFilter, s.assetSort]);

  const selectedAsset = s.selected ? s.assets.find((a) => a.id === s.selected) ?? null : null;
  const totalDrifts = s.assets.reduce((sum, a) => sum + a.drifts.length, 0);

  /* ---------- Render helpers ---------- */
  const renderTopbar = () => (
    <header className="topbar">
      <div className="brand">
        <div className="mark">◇</div>
        <div>
          BrokerDesk Twin<small>DIGITAL TWIN STUDIO · LIVE</small>
        </div>
      </div>

      <div
        className={`sync-pill${totalDrifts === 0 ? '' : s.fidelity < 80 ? ' deg' : ' drift'}`}
        title="Click to reconcile all"
        onClick={() => void reconcileAll()}
      >
        <span className="sync-dot" />
        <span>{totalDrifts === 0 ? 'SYNCHRONISED' : s.fidelity < 80 ? 'DIVERGENCE' : 'DRIFT DETECTED'}</span>
      </div>

      <div className="mdiv" />
      <div className="metric">
        <span className="k">Fidelity</span>
        <span className={`v ${s.fidelity < 80 ? 'rd' : s.fidelity < 93 ? 'am' : 'gr'}`}>{s.fidelity.toFixed(1)}%</span>
      </div>
      <div className="mdiv" />
      <div className="metric">
        <span className="k">Latency</span>
        <span className={`v ${s.latency > 90 ? 'am' : 'cy'}`}>{s.latency} ms</span>
      </div>
      <div className="mdiv" />
      <div className="metric">
        <span className="k">Rate</span>
        <span className="v">{s.rate}/s</span>
      </div>
      <div className="mdiv" />
      <div className="metric">
        <span className="k">Assets</span>
        <span className="v">{s.assets.length}</span>
      </div>
      <div className="mdiv" />
      <div className="metric">
        <span className="k">Drifts</span>
        <span className={`v ${totalDrifts === 0 ? 'gr' : totalDrifts > 3 ? 'rd' : 'am'}`}>{totalDrifts}</span>
      </div>

      <div className="spacer" />

      <button
        className={`panel-toggle${!s.leftCollapsed ? ' on' : ''}`}
        title="Toggle left panel ( [ )"
        onClick={toggleLeft}
      >
        <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>
        <span>Left</span>
      </button>
      <button
        className={`panel-toggle${!s.rightCollapsed ? ' on' : ''}`}
        title="Toggle right panel ( ] )"
        onClick={toggleRight}
      >
        <span>Right</span>
        <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></svg>
      </button>

      <div className="avatar">RA</div>
    </header>
  );

  const renderSidebar = () => (
    <aside className="sidebar">
      <div className="sb-head">
        <div className="row">
          <h3>Twin Assets</h3>
          <button
            className="btn btn-cyan"
            style={{ padding: '4px 8px', fontSize: '10.5px' }}
            onClick={() => setModal({ type: 'add' })}
          >
            ＋ Add
          </button>
        </div>
        <input
          className="sb-search"
          placeholder="Search ID, cargo, HS code…"
          value={s.assetSearch}
          onChange={(e) => {
            s.assetSearch = e.target.value;
            refresh();
          }}
        />
        <div className="sb-filters">
          {(['all', 'drift', 'clean', 'critical'] as const).map((f) => (
            <button
              key={f}
              className={`sb-fbtn${s.assetFilter === f ? ' on' : ''}`}
              onClick={() => {
                s.assetFilter = f;
                refresh();
              }}
            >
              {f === 'all' ? 'All' : f === 'drift' ? 'Drift' : f === 'clean' ? 'Clean' : 'Critical'}
            </button>
          ))}
        </div>
        <select
          className="sb-sort"
          value={s.assetSort}
          onChange={(e) => {
            s.assetSort = e.target.value as State['assetSort'];
            refresh();
          }}
        >
          <option value="id">Sort: ID</option>
          <option value="drift">Sort: Drift count</option>
          <option value="progress">Sort: Progress</option>
          <option value="value">Sort: Declared value</option>
          <option value="name">Sort: Cargo name</option>
        </select>
      </div>
      <div className="sb-body">
        {filteredAssets.length === 0 ? (
          <div className="asset-empty">
            <span className="big">◇</span>
            {s.assetSearch || s.assetFilter !== 'all'
              ? 'No assets match your filter.'
              : 'No assets yet. Click + Add.'}
          </div>
        ) : (
          filteredAssets.map((a) => {
            const danger = a.drifts.some((d) => d.sev === 'danger');
            const warn = !danger && a.drifts.length > 0;
            const led = danger ? '#ef4444' : warn ? '#f59e0b' : '#10b981';
            return (
              <button
                key={a.id}
                className={`asset${s.selected === a.id ? ' active' : ''}`}
                onClick={() => selectAsset(a.id)}
              >
                <div className="r1">
                  <span className="cid">{a.id}</span>
                  <span
                    className="led"
                    style={{ background: led, boxShadow: `0 0 7px ${led}` }}
                  />
                </div>
                <div className="nm">{a.cargo.name}</div>
                <div className="r3">
                  <span>
                    <b>{a.declared.hs}</b>
                  </span>
                  <span>{Math.round(a.u * 100)}%</span>
                  {a.drifts.length > 0 && (
                    <span style={{ color: danger ? '#f87171' : '#fbbf24' }}>▲ {a.drifts.length}</span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );

  const renderToolbar = () => (
    <div className="toolbar">
      <div className="tb-group">
        {(['physical', 'digital', 'sync'] as const).map((l) => (
          <button
            key={l}
            className={`tb-btn${s.layers[l] ? ' on' : ''}`}
            onClick={() => toggleLayer(l)}
          >
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>
      <div className="sep" />
      <div className="tb-group">
        <button className="tb-btn icon" title="Play / Pause (Space)" onClick={togglePause}>
          {s.paused ? '▶' : '⏸'}
        </button>
        <button className="tb-btn icon" title="Step one tick" onClick={stepOneTick}>
          ⏭
        </button>
      </div>
      <div className="tb-group">
        {[0.25, 0.5, 1, 2, 4].map((v) => (
          <button
            key={v}
            className={`tb-btn${s.speed === v ? ' on' : ''}`}
            onClick={() => setSpeed(v)}
          >
            {v === 0.25 ? '¼×' : v === 0.5 ? '½×' : `${v}×`}
          </button>
        ))}
      </div>
      <div className="sep" />
      <button className="btn btn-amber" onClick={() => setModal({ type: 'inject' })}>
        ⚡ Inject
      </button>
      <button className="btn btn-cyan" onClick={() => void reconcileAll()}>
        ⟲ Reconcile All
      </button>
      <button className="btn" onClick={saveTwin}>
        💾 Save
      </button>
      <button className="btn" onClick={exportTwin}>
        ⬇ Export
      </button>
      <div className="sep" />
      <button className="btn" onClick={fitView}>
        ⤢ Fit
      </button>
      <button
        className="btn"
        onClick={() => {
          if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
          else document.exitFullscreen?.();
        }}
      >
        ⛶
      </button>
      <div style={{ flex: 1 }} />
      <button className="btn" onClick={() => setModal({ type: 'help' })}>
        ?
      </button>
    </div>
  );

  const renderGauge = () => (
    <div className="gauge">
      <div className="gl">Twin Fidelity</div>
      <div className={`gv${s.fidelity < 80 ? ' rd' : s.fidelity < 93 ? ' am' : ''}`}>
        {s.fidelity.toFixed(1)}%
      </div>
      <div className="bar">
        <i
          style={{
            width: `${s.fidelity}%`,
            background: s.fidelity < 80 ? 'var(--red)' : s.fidelity < 93 ? 'var(--amber)' : 'var(--green)',
          }}
        />
      </div>
      <div className="sub">{totalDrifts} active divergence{totalDrifts === 1 ? '' : 's'}</div>
    </div>
  );

  const renderLegend = () => (
    <div className="legend">
      <div className="lg" style={{ color: '#3b82f6' }}>
        <i style={{ background: '#3b82f6' }} /> Physical
      </div>
      <div className="lg" style={{ color: '#22d3ee' }}>
        <i style={{ background: 'transparent', border: '1.5px dashed #22d3ee' }} /> Digital
      </div>
      <div className="lg" style={{ color: '#10b981' }}>
        <span className="dash" style={{ borderColor: '#10b981' }} /> Synced
      </div>
      <div className="lg" style={{ color: '#f59e0b' }}>
        <span className="dash" style={{ borderColor: '#f59e0b' }} /> Drift
      </div>
      <div className="lg" style={{ color: '#ef4444' }}>
        <span className="dash" style={{ borderColor: '#ef4444' }} /> Critical
      </div>
    </div>
  );

  const renderZoomControls = () => (
    <div className="zoomctl">
      <button title="Zoom in" onClick={() => zoomBy(1.2, drawCtxRef.current.W / 2, drawCtxRef.current.H / 2)}>
        ＋
      </button>
      <button title="Zoom out" onClick={() => zoomBy(1 / 1.2, drawCtxRef.current.W / 2, drawCtxRef.current.H / 2)}>
        −
      </button>
      <button title="Fit view (F)" onClick={fitView}>
        ⤢
      </button>
      <button className="zval">{Math.round(s.view.zoom * 100)}%</button>
    </div>
  );

  const renderDrawer = () => {
    if (!selectedAsset) {
      return <aside className="drawer" />;
    }
    const a = selectedAsset;
    return (
      <aside className="drawer open" key={a.id}>
        <div className="drawer-head">
          <div>
            <div className="drawer-t">Asset Detail</div>
            <div className="drawer-id">{a.id}</div>
          </div>
          <button className="drawer-close" onClick={() => selectAsset(null)}>
            ×
          </button>
        </div>
        <DrawerBody
          asset={a}
          onSave={(vals) => {
            a.declared.hs = vals.hs;
            a.declared.qty = vals.qty;
            a.declared.unit = vals.unit;
            a.declared.gross = vals.gross;
            a.declared.pkgs = vals.pkgs;
            a.declared.value = vals.value;
            a.drifts = a.drifts;
            s.events.unshift({
              kind: 'doc',
              title: 'Declaration edited',
              detail: `${a.id} · HS ${a.declared.hs} · value ${fmtM(a.declared.value)}`,
              time: nowT(),
            });
            addToast(`Saved changes to ${a.id}.`, 'ok');
            refresh();
          }}
          onResolve={(i) => resolveDrift(a, i)}
          onReject={(i) => rejectDrift(a, i)}
          onTelemetry={() => {
            s.activeTab = 'tel';
            refresh();
          }}
          onDelete={() => {
            void (async () => {
              const ok = await new Promise<boolean>((resolve) =>
                setModal({
                  type: 'confirm',
                  title: 'Delete Asset',
                  msg: `Delete asset ${a.id}? This cannot be undone.`,
                  resolve,
                }),
              );
              if (ok) deleteAsset(a.id);
            })();
          }}
        />
      </aside>
    );
  };

  const renderRail = () => (
    <aside className="rail">
      <div className="tabs">
        {(['tel', 'rec', 'ev'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab${s.activeTab === tab ? ' on' : ''}`}
            onClick={() => {
              s.activeTab = tab;
              refresh();
            }}
          >
            {tab === 'tel' ? 'Telemetry' : tab === 'rec' ? 'Reconcile' : 'Events'}
            {tab === 'rec' && totalDrifts > 0 && <span className="cnt">{totalDrifts}</span>}
          </button>
        ))}
      </div>

      {s.activeTab === 'tel' && (
        <div className="pane on">
          {selectedAsset ? (
            <TelemetryPane asset={selectedAsset} />
          ) : (
            <div className="reconcile-ok" style={{ color: 'var(--dim)' }}>
              <span className="big" style={{ opacity: 0.3 }}>◇</span>
              Select an asset to view live twin telemetry.
            </div>
          )}
        </div>
      )}

      {s.activeTab === 'rec' && (
        <div className="pane on">
          <div className="filter-bar">
            {(['all', 'danger', 'warn'] as const).map((f) => (
              <button
                key={f}
                className={`filter-btn${s.driftFilter === f ? ' on' : ''}`}
                onClick={() => {
                  s.driftFilter = f;
                  refresh();
                }}
              >
                {f === 'all' ? 'All' : f === 'danger' ? 'Critical' : 'Warning'}
              </button>
            ))}
          </div>
          <ReconcilePane
            selected={selectedAsset}
            assets={s.assets}
            filter={s.driftFilter}
            onSelect={selectAsset}
            onResolve={resolveDrift}
            onReject={rejectDrift}
          />
        </div>
      )}

      {s.activeTab === 'ev' && (
        <div className="pane on">
          <div className="filter-bar">
            {(['all', 'iot', 'edi', 'cus', 'doc', 'alert'] as const).map((f) => (
              <button
                key={f}
                className={`filter-btn${s.eventFilter === f ? ' on' : ''}`}
                onClick={() => {
                  s.eventFilter = f;
                  refresh();
                }}
              >
                {f === 'all' ? 'All' : f.toUpperCase()}
              </button>
            ))}
            <button
              className="filter-btn"
              style={{ marginLeft: 'auto' }}
              onClick={() => {
                s.events = [];
                refresh();
                addToast('Event log cleared.', 'info');
              }}
            >
              Clear
            </button>
          </div>
          <EventsPane events={s.events} filter={s.eventFilter} />
        </div>
      )}
    </aside>
  );

  const renderStatusBar = () => (
    <footer className="statusbar">
      <div className="sb-stat">
        <span className={`dot${s.paused ? ' am' : ''}`} /> Twin engine <b>{s.paused ? 'paused' : 'running'}</b>
      </div>
      <div className="sb-stat">
        Last reconcile <b>{s.lastReconcile ?? '—'}</b>
      </div>
      <div className="sb-stat">
        Ingest <b>{s.eventCount}</b>
      </div>
      <div className="sb-stat">
        Speed <b>{s.speed}×</b>
      </div>
      <div style={{ flex: 1 }} />
      <div className="sb-stat">{s.selected ? `Inspecting ${s.selected}` : 'No asset selected'}</div>
      <button className="sb-btn" onClick={() => void resetTwin()}>
        Reset twin
      </button>
    </footer>
  );

  /* ---------- Final render ---------- */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div
        className={`app${s.leftCollapsed ? ' collapse-left' : ''}${s.rightCollapsed ? ' collapse-right' : ''}`}
      >
        {renderTopbar()}
        {renderSidebar()}

        <main className="main">
          {renderToolbar()}
          <div className="canvas-wrap" ref={canvasWrapRef}>
            <canvas className="twin-canvas" ref={canvasRef} />
            {renderGauge()}
            {renderLegend()}
            {renderZoomControls()}
            <div className="tip" ref={tipRef} />
            {renderDrawer()}
          </div>
        </main>

        {renderRail()}
        {renderStatusBar()}
      </div>

      {s.leftCollapsed && (
        <button
          className="edge-tab edge-tab-left show"
          title="Open left panel"
          onClick={toggleLeft}
        >
          ›
        </button>
      )}
      {s.rightCollapsed && (
        <button
          className="edge-tab edge-tab-right show"
          title="Open right panel"
          onClick={toggleRight}
        >
          ‹
        </button>
      )}

      {modal?.type === 'add' && (
        <AddAssetModal
          onClose={() => setModal(null)}
          onSubmit={(cargo) => {
            const asset = makeAsset(cargo, s.assets.length, s.nextId++);
            asset.u = 0.02;
            asset.stage = 0;
            s.assets.push(asset);
            s.events.unshift({
              kind: 'doc',
              title: 'Asset added',
              detail: `${asset.id} · ${cargo.name}`,
              time: nowT(),
            });
            recomputeFidelity();
            setModal(null);
            selectAsset(asset.id);
            addToast(`Asset ${asset.id} added.`, 'ok');
          }}
        />
      )}
      {modal?.type === 'inject' && (
        <InjectModal
          assets={s.assets}
          selectedId={s.selected}
          onClose={() => setModal(null)}
          onSubmit={(aid, fieldName, severity) => {
            const a = s.assets.find((x) => x.id === aid);
            if (!a) return;
            let tmpl: DriftTemplate | undefined;
            if (fieldName === 'random') {
              tmpl = pick(DRIFT_TEMPLATES.filter((d) => d.sev === severity));
            } else {
              tmpl = DRIFT_TEMPLATES.find((d) => d.field === fieldName);
            }
            if (!tmpl) return;
            const d = tmpl.mk(a);
            const drift: Drift = { field: tmpl.field, sev: tmpl.sev, ...d, at: nowShort() };
            a.drifts.push(drift);
            recomputeFidelity();
            s.events.unshift({
              kind: 'alert',
              title: `Injected — ${drift.field}`,
              detail: `${a.id} · ${drift.delta}`,
              time: nowT(),
            });
            setModal(null);
            addToast(`Injected ${drift.field} on ${a.id}.`, drift.sev === 'danger' ? 'err' : 'warn');
          }}
        />
      )}
      {modal?.type === 'confirm' && (
        <ConfirmModal
          title={modal.title}
          msg={modal.msg}
          onCancel={() => {
            modal.resolve(false);
            setModal(null);
          }}
          onOk={() => {
            modal.resolve(true);
            setModal(null);
          }}
        />
      )}
      {modal?.type === 'help' && <HelpModal onClose={() => setModal(null)} />}

      <div id="toasts">
        {toasts.map((t) => (
          <div className={`toast ${t.kind}`} key={t.id}>
            <span>{t.kind === 'ok' ? '✓' : t.kind === 'warn' ? '⚠' : t.kind === 'err' ? '✕' : '◇'}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ============================================================
   SUB-COMPONENTS
============================================================ */

function DrawerBody({
  asset,
  onSave,
  onResolve,
  onReject,
  onTelemetry,
  onDelete,
}: {
  asset: Asset;
  onSave: (vals: {
    hs: string;
    qty: number;
    unit: number;
    gross: number;
    pkgs: number;
    value: number;
  }) => void;
  onResolve: (idx: number) => void;
  onReject: (idx: number) => void;
  onTelemetry: () => void;
  onDelete: () => void;
}) {
  const hsRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLInputElement>(null);
  const grossRef = useRef<HTMLInputElement>(null);
  const pkgsRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hsRef.current) hsRef.current.value = asset.declared.hs;
    if (qtyRef.current) qtyRef.current.value = String(asset.declared.qty);
    if (unitRef.current) unitRef.current.value = String(asset.declared.unit);
    if (grossRef.current) grossRef.current.value = String(asset.declared.gross);
    if (pkgsRef.current) pkgsRef.current.value = String(asset.declared.pkgs);
    if (valueRef.current) valueRef.current.value = asset.declared.value.toFixed(2);
  });

  return (
    <div className="drawer-body">
      <div className="dr-section">
        <div className="dr-h">Identity</div>
        <div className="dr-meta">
          <b>{asset.cargo.name}</b>
          <br />
          Seal {asset.seal} · Origin {asset.declared.origin}
          <br />
          {asset.cargo.hazard && <span style={{ color: '#f87171' }}>⚠ DG {asset.cargo.hazard}</span>}
          {asset.cargo.tempCtl && <span style={{ color: '#22d3ee' }}>❄ Temperature controlled</span>}
          {asset.cargo.permit && (
            <>
              <br />
              <span style={{ color: '#fbbf24' }}>◆ Permit: {asset.cargo.permit}</span>
            </>
          )}
        </div>
      </div>

      <div className="dr-section">
        <div className="dr-h">Position</div>
        <div className="dr-meta">
          {Math.round(asset.u * 100)}% · {STAGES[asset.stage]}
          <br />
          Stage: <b>{STAGES[asset.stage]}</b> · Drag the chip on the canvas
        </div>
      </div>

      <div className="dr-section">
        <div className="dr-h">Declaration (editable)</div>
        <div className="dr-field">
          <label>HS Code</label>
          <input ref={hsRef} defaultValue={asset.declared.hs} />
        </div>
        <div className="dr-row">
          <div className="dr-field">
            <label>Quantity</label>
            <input ref={qtyRef} type="number" min="0" defaultValue={asset.declared.qty} />
          </div>
          <div className="dr-field">
            <label>Unit Value (MYR)</label>
            <input ref={unitRef} type="number" min="0" step="0.01" defaultValue={asset.declared.unit} />
          </div>
        </div>
        <div className="dr-row">
          <div className="dr-field">
            <label>Gross Weight (kg)</label>
            <input ref={grossRef} type="number" min="0" step="0.1" defaultValue={asset.declared.gross} />
          </div>
          <div className="dr-field">
            <label>Packages</label>
            <input ref={pkgsRef} type="number" min="1" defaultValue={asset.declared.pkgs} />
          </div>
        </div>
        <div className="dr-field">
          <label>Declared Value (MYR)</label>
          <input ref={valueRef} type="number" min="0" step="0.01" defaultValue={asset.declared.value.toFixed(2)} />
        </div>
        <div className="dr-actions">
          <button
            className="btn btn-cyan"
            onClick={() =>
              onSave({
                hs: hsRef.current?.value.trim() || '',
                qty: num(qtyRef.current?.value || '0'),
                unit: num(unitRef.current?.value || '0'),
                gross: num(grossRef.current?.value || '0'),
                pkgs: num(pkgsRef.current?.value || '1'),
                value: num(valueRef.current?.value || '0'),
              })
            }
          >
            💾 Save Changes
          </button>
        </div>
      </div>

      <div className="dr-section">
        <div className="dr-h">Active Drifts</div>
        {asset.drifts.length === 0 ? (
          <div className="no-drift">
            <span className="big">✓</span>
            Asset fully reconciled. No active divergences.
          </div>
        ) : (
          asset.drifts.map((d, i) => (
            <div className={`drift-item${d.sev === 'danger' ? ' danger' : ''}`} key={i}>
              <div className="dh">
                <span className="dn">{d.field}</span>
                <span className={`sev ${d.sev === 'danger' ? 'd' : 'w'}`}>
                  {d.sev === 'danger' ? 'Critical' : 'Warning'}
                </span>
              </div>
              <div className="diff">
                <span className="lbl">Declared</span>
                <span />
                <span className="pv">{d.declared}</span>
                <span className="lbl">Physical</span>
                <span />
                <span className="dv">{d.physical}</span>
              </div>
              <div className="delta">
                <span>▲</span>
                <span>
                  {d.delta} · {d.at}
                </span>
              </div>
              <div className="da">
                <button className="btn btn-green" onClick={() => onResolve(i)}>
                  ⟲ Reconcile
                </button>
                <button className="btn" onClick={() => onReject(i)}>
                  ✕ Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="dr-section">
        <div className="dr-h">Actions</div>
        <div className="dr-actions">
          <button className="btn" onClick={onTelemetry}>
            View Telemetry
          </button>
          <button className="btn btn-red" onClick={onDelete}>
            🗑 Delete Asset
          </button>
        </div>
      </div>
    </div>
  );
}

function TelemetryPane({ asset }: { asset: Asset }) {
  const tempOk = asset.cargo.tempCtl ? asset.telemetry.temp >= 2 && asset.telemetry.temp <= 8 : true;
  const humOk = asset.telemetry.humidity < 75;
  const shockOk = asset.telemetry.shock < 0.5;
  const batOk = asset.telemetry.battery > 25;
  const st = asset.drifts.some((d) => d.sev === 'danger') ? 'hold' : asset.status;
  const stMap: Record<string, string> = {
    in_transit: 'transit', at_port: 'port', customs: 'customs', hold: 'hold', released: 'released',
  };
  const stLabel: Record<string, string> = {
    in_transit: 'IN TRANSIT', at_port: 'AT PORT', customs: 'IN CUSTOMS', hold: 'ON HOLD', released: 'RELEASED',
  };

  const spTempRef = useRef<HTMLCanvasElement>(null);
  const spHumRef = useRef<HTMLCanvasElement>(null);
  const spShkRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (spTempRef.current) drawSparkline(spTempRef.current, asset.hist.temp, tempOk ? '#10b981' : '#ef4444');
    if (spHumRef.current) drawSparkline(spHumRef.current, asset.hist.humidity, humOk ? '#10b981' : '#f59e0b');
    if (spShkRef.current) drawSparkline(spShkRef.current, asset.hist.shock, shockOk ? '#10b981' : '#ef4444');
  });

  return (
    <>
      <div className="selcard">
        <div className="h">
          <span className="cid">{asset.id}</span>
          <span className={`st ${stMap[st] || 'transit'}`}>{stLabel[st] || 'IN TRANSIT'}</span>
        </div>
        <div className="meta">
          <b>{asset.cargo.name}</b>
          <br />
          Seal {asset.seal} · {asset.declared.origin} → MYPKG
          <br />
          {asset.cargo.qty.toLocaleString()} units · {asset.cargo.pkgs} pkgs · {asset.cargo.gross} kg
          {asset.cargo.hazard && (
            <>
              <br />
              <span style={{ color: '#f87171' }}>⚠ DG {asset.cargo.hazard}</span>
            </>
          )}
          {asset.cargo.tempCtl && (
            <>
              <br />
              <span style={{ color: '#22d3ee' }}>❄ Temperature controlled</span>
            </>
          )}
        </div>
      </div>

      <div className="sec-t">
        <span>Live Telemetry</span>
      </div>

      <div className="tel">
        <div className="tk">Container temperature</div>
        <div className={`tv ${tempOk ? 'ok' : 'bad'}`}>
          {asset.telemetry.temp.toFixed(1)}
          <span className="unit">°C</span>
        </div>
        <div className="spark">
          <canvas ref={spTempRef} />
        </div>
      </div>
      <div className="tel">
        <div className="tk">Relative humidity</div>
        <div className={`tv ${humOk ? 'ok' : 'warn'}`}>
          {asset.telemetry.humidity.toFixed(0)}
          <span className="unit">%</span>
        </div>
        <div className="spark">
          <canvas ref={spHumRef} />
        </div>
      </div>
      <div className="tel">
        <div className="tk">Shock / impact</div>
        <div className={`tv ${shockOk ? 'ok' : 'bad'}`}>
          {asset.telemetry.shock.toFixed(2)}
          <span className="unit">g</span>
        </div>
        <div className="spark">
          <canvas ref={spShkRef} />
        </div>
      </div>
      <div className="tel">
        <div className="tk">Door / seal state</div>
        <div className={`tv ${asset.telemetry.door === 'closed' ? 'ok' : 'bad'}`}>
          {asset.telemetry.door === 'closed' ? 'Closed' : 'OPEN'}
        </div>
      </div>
      <div className="tel">
        <div className="tk">Sensor battery</div>
        <div className={`tv ${batOk ? 'ok' : 'warn'}`}>
          {asset.telemetry.battery.toFixed(0)}
          <span className="unit">%</span>
        </div>
      </div>
      <div className="tel">
        <div className="tk">Signal strength</div>
        <div className="tv ok">
          {asset.telemetry.signal.toFixed(0)}
          <span className="unit">%</span>
        </div>
      </div>

      <div className="sec-t">
        <span>Declaration Twin</span>
      </div>
      <div className="tel">
        <div className="tk">HS classification</div>
        <div className="tv">{asset.declared.hs}</div>
      </div>
      <div className="tel">
        <div className="tk">Declared value</div>
        <div className="tv">{fmtM(asset.declared.value)}</div>
      </div>
      <div className="tel">
        <div className="tk">Gross weight</div>
        <div className="tv">{asset.declared.gross} kg</div>
      </div>
      <div className="tel">
        <div className="tk">Packages</div>
        <div className="tv">{asset.declared.pkgs}</div>
      </div>
    </>
  );
}

function ReconcilePane({
  selected,
  assets,
  filter,
  onSelect,
  onResolve,
  onReject,
}: {
  selected: Asset | null;
  assets: Asset[];
  filter: 'all' | 'warn' | 'danger';
  onSelect: (id: string) => void;
  onResolve: (asset: Asset, idx: number) => void;
  onReject: (asset: Asset, idx: number) => void;
}) {
  const target = selected ? [selected] : assets;
  let withDrift = target.filter((x) => x.drifts.length > 0);

  if (filter !== 'all') {
    withDrift = withDrift
      .map((x) => ({ ...x, drifts: x.drifts.filter((d) => d.sev === filter) }))
      .filter((x) => x.drifts.length > 0);
  }

  if (withDrift.length === 0) {
    return (
      <div className="reconcile-ok">
        <span className="big">✓</span>
        <b style={{ color: 'var(--green)' }}>Twin fully reconciled</b>
        <br />
        <span style={{ color: 'var(--muted)', fontSize: 11.5 }}>
          {selected
            ? 'This asset matches its digital record.'
            : `All ${assets.length} assets match.`}
        </span>
      </div>
    );
  }

  const totalCount = withDrift.reduce((sum, x) => sum + x.drifts.length, 0);

  return (
    <>
      {!selected && (
        <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: '0 0 10px', lineHeight: 1.5 }}>
          {totalCount} divergence(s) across {withDrift.length} asset(s). Click to inspect.
        </p>
      )}
      {withDrift.map((asset) => (
        <div key={asset.id}>
          {!selected && (
            <div
              style={{
                fontSize: 10,
                color: 'var(--dim)',
                fontFamily: 'ui-monospace, monospace',
                margin: '12px 0 6px',
                fontWeight: 700,
              }}
            >
              {asset.id}
            </div>
          )}
          {asset.drifts.map((d, idx) => {
            const realIdx = selected
              ? idx
              : assets.find((x) => x.id === asset.id)?.drifts.findIndex((dd) => dd === d) ?? idx;
            return (
              <div
                key={idx}
                className={`drift-item${d.sev === 'danger' ? ' danger' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => !selected && onSelect(asset.id)}
              >
                <div className="dh">
                  <span className="dn">{d.field}</span>
                  <span className={`sev ${d.sev === 'danger' ? 'd' : 'w'}`}>
                    {d.sev === 'danger' ? 'Critical' : 'Warning'}
                  </span>
                </div>
                <div className="diff">
                  <span className="lbl">Declared</span>
                  <span />
                  <span className="pv">{d.declared}</span>
                  <span className="lbl">Physical</span>
                  <span />
                  <span className="dv">{d.physical}</span>
                </div>
                <div className="delta">
                  <span>▲</span>
                  <span>{d.delta}</span>
                </div>
                <div className="da">
                  <button
                    className="btn btn-green"
                    onClick={(e) => {
                      e.stopPropagation();
                      const real = assets.find((x) => x.id === asset.id) ?? asset;
                      onResolve(real, realIdx);
                    }}
                  >
                    ⟲ Reconcile
                  </button>
                  <button
                    className="btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      const real = assets.find((x) => x.id === asset.id) ?? asset;
                      onReject(real, realIdx);
                    }}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}

function EventsPane({ events, filter }: { events: TwinEvent[]; filter: string }) {
  const list = filter === 'all' ? events : events.filter((e) => e.kind === filter);
  if (list.length === 0) {
    return (
      <div className="reconcile-ok" style={{ color: 'var(--dim)' }}>
        <span className="big" style={{ opacity: 0.3 }}>◇</span>
        {filter === 'all' ? 'Waiting for ingest…' : 'No events in this category.'}
      </div>
    );
  }
  const icon: Record<string, string> = { iot: '≋', edi: '⇄', cus: '⌂', alert: '!', doc: '▤' };
  return (
    <>
      {list.map((e, i) => (
        <div className="ev" key={i}>
          <div className={`ei ${e.kind}`}>{icon[e.kind] || '·'}</div>
          <div className="eb">
            <b>{e.title}</b>
            <span> — {e.detail}</span>
            <time>{e.time}</time>
          </div>
        </div>
      ))}
    </>
  );
}

/* ---------- Modals ---------- */
function AddAssetModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (cargo: Cargo) => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const hsRef = useRef<HTMLInputElement>(null);
  const originRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const valRef = useRef<HTMLInputElement>(null);
  const grossRef = useRef<HTMLInputElement>(null);
  const pkgsRef = useRef<HTMLInputElement>(null);
  const hazRef = useRef<HTMLInputElement>(null);
  const permitRef = useRef<HTMLInputElement>(null);
  const tempRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameRef.current) nameRef.current.value = '';
    if (hsRef.current) hsRef.current.value = '8471.30.00';
    if (originRef.current) originRef.current.value = 'CN';
    if (qtyRef.current) qtyRef.current.value = '100';
    if (valRef.current) valRef.current.value = '10';
    if (grossRef.current) grossRef.current.value = '100';
    if (pkgsRef.current) pkgsRef.current.value = '10';
    if (hazRef.current) hazRef.current.value = '';
    if (permitRef.current) permitRef.current.value = '';
    if (tempRef.current) tempRef.current.checked = false;
    setTimeout(() => nameRef.current?.focus(), 50);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const gross = parseFloat(grossRef.current?.value || '0') || 0;
    onSubmit({
      name: nameRef.current?.value.trim() || 'Unnamed cargo',
      hs: hsRef.current?.value.trim() || '0000.00.00',
      origin: originRef.current?.value.trim().toUpperCase() || 'XX',
      qty: parseInt(qtyRef.current?.value || '1') || 1,
      unit: parseFloat(valRef.current?.value || '0') || 0,
      gross,
      net: gross * 0.85,
      pkgs: parseInt(pkgsRef.current?.value || '1') || 1,
      hazard: hazRef.current?.value.trim() || null,
      permit: permitRef.current?.value.trim() || null,
      tempCtl: tempRef.current?.checked || false,
    });
  };

  return (
    <div className="modal-bg show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <h3>Add New Asset</h3>
        <label>
          Cargo name
          <input ref={nameRef} required placeholder="e.g. Wireless headphones" />
        </label>
        <div className="row">
          <label>
            HS Code <input ref={hsRef} defaultValue="8471.30.00" />
          </label>
          <label>
            Origin (ISO) <input ref={originRef} defaultValue="CN" maxLength={2} />
          </label>
        </div>
        <div className="row">
          <label>
            Quantity <input ref={qtyRef} type="number" defaultValue={100} min={1} />
          </label>
          <label>
            Unit value (MYR) <input ref={valRef} type="number" defaultValue={10} min={0} step={0.01} />
          </label>
        </div>
        <div className="row">
          <label>
            Gross weight (kg) <input ref={grossRef} type="number" defaultValue={100} min={0} />
          </label>
          <label>
            Packages <input ref={pkgsRef} type="number" defaultValue={10} min={1} />
          </label>
        </div>
        <div className="row">
          <label>
            Dangerous goods <input ref={hazRef} placeholder="UN3480" />
          </label>
          <label>
            Permit <input ref={permitRef} placeholder="e.g. Food safety" />
          </label>
        </div>
        <div className="cbrow">
          <input type="checkbox" ref={tempRef} /> Temperature controlled (reefer)
        </div>
        <div className="actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-cyan">
            Add Asset
          </button>
        </div>
      </form>
    </div>
  );
}

function InjectModal({
  assets,
  selectedId,
  onClose,
  onSubmit,
}: {
  assets: Asset[];
  selectedId: string | null;
  onClose: () => void;
  onSubmit: (aid: string, fieldName: string, severity: Sev) => void;
}) {
  const [assetId, setAssetId] = useState(selectedId || assets[0]?.id || '');
  const [fieldName, setFieldName] = useState('random');
  const [severity, setSeverity] = useState<'random' | Sev>('random');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const sev: Sev = severity === 'random' ? (Math.random() < 0.45 ? 'danger' : 'warn') : severity;
    onSubmit(assetId, fieldName, sev);
  };

  return (
    <div className="modal-bg show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <h3>Inject Drift Event</h3>
        <label>
          Asset
          <select value={assetId} onChange={(e) => setAssetId(e.target.value)}>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} — {a.cargo.name}
              </option>
            ))}
          </select>
        </label>
        <div className="row">
          <label>
            Drift type
            <select value={fieldName} onChange={(e) => setFieldName(e.target.value)}>
              <option value="random">Random</option>
              {DRIFT_TEMPLATES.map((d) => (
                <option key={d.field} value={d.field}>
                  {d.field} ({d.sev})
                </option>
              ))}
            </select>
          </label>
          <label>
            Severity
            <select value={severity} onChange={(e) => setSeverity(e.target.value as 'random' | Sev)}>
              <option value="random">Random</option>
              <option value="warn">Warning</option>
              <option value="danger">Critical</option>
            </select>
          </label>
        </div>
        <div className="actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-amber">
            Inject
          </button>
        </div>
      </form>
    </div>
  );
}

function ConfirmModal({
  title,
  msg,
  onOk,
  onCancel,
}: {
  title: string;
  msg: string;
  onOk: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-bg show" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal small">
        <h3>{title}</h3>
        <p>{msg}</p>
        <div className="actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-red" onClick={onOk}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-bg show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>Keyboard Shortcuts</h3>
        <div style={{ fontSize: 12, lineHeight: 1.9, color: 'var(--muted)' }}>
          <div><b style={{ color: 'var(--cyan)' }}>Space</b> · Play / Pause simulation</div>
          <div><b style={{ color: 'var(--cyan)' }}>→</b> · Step one tick</div>
          <div><b style={{ color: 'var(--cyan)' }}>F</b> · Fit view</div>
          <div><b style={{ color: 'var(--cyan)' }}>R</b> · Reconcile all</div>
          <div><b style={{ color: 'var(--cyan)' }}>I</b> · Open inject modal</div>
          <div><b style={{ color: 'var(--cyan)' }}>A</b> · Add new asset</div>
          <div><b style={{ color: 'var(--cyan)' }}>[</b> · Toggle left panel</div>
          <div><b style={{ color: 'var(--cyan)' }}>]</b> · Toggle right panel</div>
          <div><b style={{ color: 'var(--cyan)' }}>Esc</b> · Deselect / close panel</div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
            <b style={{ color: 'var(--cyan)' }}>Drag</b> on canvas to pan · <b style={{ color: 'var(--cyan)' }}>Scroll</b> to zoom
            <br />
            <b style={{ color: 'var(--cyan)' }}>Drag asset chip</b> along the route to reposition
          </div>
        </div>
        <div className="actions">
          <button type="button" className="btn btn-cyan" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}