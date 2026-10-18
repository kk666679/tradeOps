"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Factory, TrendingUp, Layers, Sparkles, ShieldCheck,
  Activity, Wallet, Leaf, Boxes, Cpu, Zap, CheckCircle2, AlertTriangle,
  Clock, ArrowUpRight, Play, RefreshCw, ChevronRight, Gauge, Coins,
  Package, Flame,
} from "lucide-react";

/* ───────────────────────── helpers ───────────────────────── */

function CountUp({ value, duration = 1400, decimals = 0, prefix = "", suffix = "" }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(value * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <>
      {prefix}
      {v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}

function Ring({ pct, size = 36, stroke = 3, color = "#a855f7" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset .8s ease" }}
      />
    </svg>
  );
}

function Sparkline({ data, color = "#a855f7", height = 36 }) {
  const w = 100, h = height;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");
  const id = `spark-${color.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function MultiLine({ series, height = 130 }) {
  const w = 320, h = height;
  const all = series.flatMap((s) => s.data);
  const max = Math.max(...all) * 1.05;
  const min = Math.min(...all) * 0.9;
  const range = max - min || 1;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((y) => (
        <line key={y} x1={0} x2={w} y1={h * y} y2={h * y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 4" />
      ))}
      {series.map((s, si) => {
        const pts = s.data
          .map((v, i) => {
            const x = (i / (s.data.length - 1)) * w;
            const y = h - ((v - min) / range) * (h - 8) - 4;
            return `${x},${y}`;
          })
          .join(" ");
        return (
          <polyline
            key={si}
            points={pts}
            fill="none"
            stroke={s.color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ filter: `drop-shadow(0 0 6px ${s.color}55)` }}
          />
        );
      })}
    </svg>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function ManufacturersPage() {
  const [tab, setTab] = useState("ledger");
  const [now, setNow] = useState(null);

  /* live clock */
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* FIZ bonded ledger */
  const [materials, setMaterials] = useState([
    { sku: "LI-21700", name: "Lithium-ion cells 21700", qty: 8420, unit: "pcs", duty: 5, days: 9,  max: 45 },
    { sku: "AL-6061",  name: "Aluminium billet 6061",   qty: 1240, unit: "kg",  duty: 0, days: 18, max: 45 },
    { sku: "PCB-6L",   name: "PCB substrate 6-layer",   qty: 3150, unit: "pcs", duty: 0, days: 5,  max: 45 },
    { sku: "CU-08",    name: "Copper wire 0.8 mm",       qty: 620,  unit: "kg",  duty: 5, days: 27, max: 45 },
  ]);

  /* RWA */
  const [rwa, setRwa] = useState([
    { sku: "FIN-HEADPHONE", name: "Finished headphones — carton", value: 1_240_000, apy: 8.4, ltv: 65, tokens: 12400, tokenized: false },
    { sku: "FIN-LAPTOP",    name: "Finished laptops — pallet",    value: 2_880_000, apy: 7.1, ltv: 60, tokens: 28800, tokenized: false },
    { sku: "FIN-CABLE",     name: "Finished USB-C cables — reel", value: 410_000,   apy: 9.2, ltv: 70, tokens: 4100,  tokenized: false },
  ]);

  /* activity feed */
  const [events, setEvents] = useState([
    { id: 1, kind: "ok",   text: "FIZ bonded ledger synchronised with customs gateway", time: "just now" },
    { id: 2, kind: "warn", text: "PCB substrate depletes in 5 days — reorder suggested", time: "4m ago" },
    { id: 3, kind: "ai",   text: "Copilot flagged 2 SKUs as RWA-eligible", time: "18m ago" },
  ]);
  const pushEvent = (kind, text) =>
    setEvents((prev) => [{ id: Date.now(), kind, text, time: "just now" }, ...prev].slice(0, 8));

  /* predictive demand */
  const demand = useMemo(() => Array.from({ length: 14 }, (_, i) => 40 + Math.sin(i / 2) * 10 + i * 1.2 + (i % 3) * 2), []);
  const stock  = useMemo(() => Array.from({ length: 14 }, (_, i) => 122 - i * 5.4), []);
  const shortageDay = useMemo(() => {
    for (let i = 0; i < demand.length; i++) if (stock[i] < demand[i]) return i + 1;
    return null;
  }, [demand, stock]);

  /* derived KPIs */
  const bondedValue = 12_400_000;
  const dutySuspended = 620_000;
  const unlocked = rwa.filter((r) => r.tokenized).reduce((a, r) => a + r.value * (r.ltv / 100), 0);
  const nearDepletion = materials.filter((m) => m.days < 14).length;

  /* interactions */
  const runDeduction = () => {
    setMaterials((prev) =>
      prev.map((m) => {
        const used = Math.round(m.qty * (0.05 + Math.random() * 0.07));
        const newQty = Math.max(0, m.qty - used);
        return {
          ...m,
          qty: newQty,
          days: Math.max(1, m.days - (1 + Math.floor(Math.random() * 3))),
        };
      })
    );
    pushEvent("ai", "AI deducted raw materials as they entered production");
  };

  const tokenize = (sku) => {
    setRwa((prev) => prev.map((r) => (r.sku === sku ? { ...r, tokenized: true } : r)));
    const item = rwa.find((r) => r.sku === sku);
    pushEvent("ok", `${item?.name} tokenized — liquidity unlocked via DeFi lenders`);
  };

  const reorder = (sku) => {
    pushEvent("ok", `Purchase order raised for ${sku} — ETA 6 days`);
  };

  /* hero KPIs */
  const kpis = [
    { label: "Bonded value tracked",  value: bondedValue / 1_000_000, decimals: 1, prefix: "$", suffix: "M", icon: Boxes, color: "#a855f7" },
    { label: "Duty suspended",         value: dutySuspended / 1000,    decimals: 0, prefix: "$", suffix: "K", icon: ShieldCheck, color: "#22d3ee" },
    { label: "Production uptime",      value: 99.4,                    decimals: 1, suffix: "%",     icon: Gauge, color: "#22c55e" },
    { label: "RWA liquidity unlocked", value: unlocked / 1_000_000,    decimals: 2, prefix: "$", suffix: "M", icon: Coins, color: "#f59e0b" },
  ];

  const features = [
    {
      title: "Bonded Ledger (FIZ)",
      desc: "Seamlessly track duty-suspended raw materials. AI automatically deducts inventory as it enters the production line.",
      icon: Layers,
      metric: `${materials.length} SKUs · ${nearDepletion} near depletion`,
      tab: "ledger",
    },
    {
      title: "Predictive Demand",
      desc: "Forecast raw-material shortages weeks in advance using models trained on your historical production data.",
      icon: TrendingUp,
      metric: shortageDay ? `Shortage in ${shortageDay} days` : "No shortage forecast",
      tab: "forecast",
    },
    {
      title: "RWA Financing",
      desc: "Tokenize finished goods in the warehouse to access instant DeFi liquidity from global lenders.",
      icon: Factory,
      metric: `$${(unlocked / 1_000_000).toFixed(2)}M unlocked`,
      tab: "rwa",
    },
  ];

  return (
    <div className="relative bg-[#050505] min-h-screen text-white overflow-hidden">
      {/* ── background atmosphere ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(168,85,247,0.12) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-purple-600/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <div className="relative">
        {/* ── header ── */}
        <header className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 grid place-items-center text-[#04121f] font-black text-sm">
              B
            </span>
            <span className="text-sm font-semibold tracking-tight">
              BrokerDesk
              <span className="block text-[10px] font-normal text-slate-500 tracking-wider uppercase">
                Manufacturing
              </span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-xs text-slate-400">
            <a href="#dashboard" className="hover:text-white transition-colors">Live Demo</a>
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#cbam" className="hover:text-white transition-colors">CBAM</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-xs text-slate-400 hover:text-white transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-white text-[#050505] text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Get started <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* ── hero ── */}
        <section className="max-w-6xl mx-auto px-4 pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs mb-6">
            <Factory className="w-3.5 h-3.5" /> Manufacturing &amp; FIZ
            <span className="w-px h-3 bg-purple-500/30 mx-1" />
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Gateway live
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.05]">
            Never halt <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              the production line.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Gain absolute visibility into bonded inventory, automate compliance, and unlock capital through RWA tokenization — all from one operational cockpit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-purple-600 px-8 text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-purple-500 hover:shadow-[0_0_36px_rgba(168,85,247,0.55)] transition-all"
            >
              Optimize Production <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <a
              href="#dashboard"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 text-sm font-semibold text-slate-200 hover:bg-white/[0.06] transition-colors"
            >
              <Play className="mr-2 w-3.5 h-3.5" /> Preview live dashboard
            </a>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.label}
                  className="group relative rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 text-left hover:border-white/15 transition-colors overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold">
                      {k.label}
                    </span>
                    <Icon className="w-3.5 h-3.5" style={{ color: k.color }} />
                  </div>
                  <div className="text-2xl font-bold tabular-nums" style={{ color: k.color }}>
                    <CountUp value={k.value} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${k.color}, transparent)` }} />
                </div>
              );
            })}
          </div>
        </section>

        {/* ── live dashboard ── */}
        <section id="dashboard" className="max-w-6xl mx-auto px-4 pb-20">
          <div className="rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-px">
            <div className="rounded-3xl bg-[#08080a]/90 backdrop-blur-xl overflow-hidden">
              {/* dashboard header */}
              <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold">Production Cockpit</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {now ? now.toLocaleTimeString("en-GB") : "--:--:--"}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 ml-3 text-[10px] text-slate-500">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    FIZ · Port Klang
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    Line A · running
                  </span>
                </div>
                <div className="ml-auto flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="hidden md:inline">Synced with customs gateway</span>
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                </div>
              </div>

              {/* tab bar */}
              <div className="flex overflow-x-auto border-b border-white/[0.06] bg-black/20">
                {[
                  { id: "ledger",   label: "Bonded Ledger",      icon: Boxes },
                  { id: "forecast", label: "Predictive Demand",  icon: TrendingUp },
                  { id: "rwa",      label: "RWA Financing",      icon: Wallet },
                  { id: "cbam",     label: "CBAM Exposure",      icon: Leaf },
                ].map((t) => {
                  const Icon = t.icon;
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`relative flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                        active ? "text-white" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                      {active && (
                        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-purple-400 to-cyan-300" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* body */}
              <div className="grid lg:grid-cols-[1fr_300px]">
                <div className="p-5 min-h-[420px]">
                  {/* ── BONDED LEDGER ── */}
                  {tab === "ledger" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <MiniTile label="Bonded value" value="$12.4M" color="#a855f7" />
                        <MiniTile label="Duty suspended" value="$620K" color="#22d3ee" />
                        <MiniTile label="Near depletion" value={`${nearDepletion} SKUs`} color="#f59e0b" warn={nearDepletion > 0} />
                      </div>

                      <div className="space-y-1.5">
                        {materials.map((m) => {
                          const daysPct = Math.min(100, (m.days / m.max) * 100);
                          const warn = m.days < 14;
                          return (
                            <div
                              key={m.sku}
                              className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/15 transition-colors"
                            >
                              <div className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${warn ? "bg-amber-500/10 text-amber-400" : "bg-purple-500/10 text-purple-400"}`}>
                                {warn ? <Flame className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold truncate">{m.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  {m.sku} · {m.qty.toLocaleString()} {m.unit} · duty {m.duty}%
                                </div>
                              </div>
                              <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                                <Clock className="w-3 h-3" /> {m.days}d
                              </div>
                              <div className="relative shrink-0 grid place-items-center">
                                <Ring pct={daysPct} size={32} stroke={2.5} color={warn ? "#f59e0b" : "#a855f7"} />
                                <span className="absolute text-[8.5px] font-bold text-slate-300">
                                  {Math.round(daysPct)}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={runDeduction}
                        className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-xs font-bold transition-colors shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                      >
                        <Cpu className="w-3.5 h-3.5" /> Run AI deduction
                        <Sparkles className="w-3 h-3 opacity-70" />
                      </button>
                    </div>
                  )}

                  {/* ── PREDICTIVE DEMAND ── */}
                  {tab === "forecast" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold">14-day demand vs stock</div>
                          <div className="text-[10.5px] text-slate-500 mt-0.5">
                            Forecast from historical production data
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[10px]">
                          <span className="flex items-center gap-1.5 text-purple-300">
                            <span className="w-2 h-2 rounded-full bg-purple-400" /> Demand
                          </span>
                          <span className="flex items-center gap-1.5 text-cyan-300">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Stock
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-black/40 border border-white/[0.06] p-3">
                        <MultiLine
                          series={[
                            { data: demand, color: "#c084fc" },
                            { data: stock,  color: "#22d3ee" },
                          ]}
                        />
                      </div>

                      {shortageDay && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="text-amber-100/90">
                            <b>Stock crosses demand on day {shortageDay}.</b>{" "}
                            Raise purchase orders now to keep the line running.
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        {[
                          { sku: "LI-21700", name: "Lithium-ion cells 21700", cover: "9 days" },
                          { sku: "PCB-6L",   name: "PCB substrate 6-layer",   cover: "5 days" },
                          { sku: "CU-08",    name: "Copper wire 0.8 mm",      cover: "27 days" },
                        ].map((s) => (
                          <div key={s.sku} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                            <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-[11.5px] font-medium truncate">{s.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{s.sku}</div>
                            </div>
                            <span className="text-[10.5px] text-slate-400">{s.cover} cover</span>
                            <button
                              onClick={() => reorder(s.sku)}
                              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-white/5 hover:bg-white/10 text-[10.5px] font-semibold text-slate-200 transition-colors"
                            >
                              Reorder <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── RWA FINANCING ── */}
                  {tab === "rwa" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <MiniTile label="Total collateral" value="$4.53M" color="#a855f7" />
                        <MiniTile label="Liquidity unlocked" value={`$${(unlocked / 1_000_000).toFixed(2)}M`} color="#22c55e" />
                      </div>

                      <div className="space-y-1.5">
                        {rwa.map((r) => (
                          <div key={r.sku} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${r.tokenized ? "bg-emerald-500/10 text-emerald-400" : "bg-purple-500/10 text-purple-400"}`}>
                                {r.tokenized ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Coins className="w-3.5 h-3.5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold truncate">{r.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  {r.tokens.toLocaleString()} tokens · LTV {r.ltv}% · APY {r.apy}%
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-xs font-bold tabular-nums">${(r.value / 1000).toFixed(0)}K</div>
                                <div className="text-[10px] text-slate-500">valuation</div>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${r.tokenized ? "bg-emerald-400" : "bg-purple-500/40"}`}
                                  style={{ width: r.tokenized ? "100%" : "0%" }}
                                />
                              </div>
                              {r.tokenized ? (
                                <span className="text-[10px] font-bold text-emerald-400">Tokenized</span>
                              ) : (
                                <button
                                  onClick={() => tokenize(r.sku)}
                                  className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-purple-600 hover:bg-purple-500 text-[10.5px] font-bold transition-colors"
                                >
                                  Tokenize <ArrowUpRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── CBAM ── */}
                  {tab === "cbam" && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
                        <Leaf className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                        <div className="text-cyan-100/90">
                          <b>EU CBAM definitive regime, 2026.</b> Embedded emissions per tonne must be declared for covered goods.
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {[
                          { product: "Aluminium extrusions", code: "7604", intensity: 8.4, exposure: 92_000 },
                          { product: "Steel fasteners",      code: "7318", intensity: 6.1, exposure: 41_000 },
                          { product: "Copper wire",          code: "7408", intensity: 4.7, exposure: 28_000 },
                        ].map((p) => (
                          <div key={p.code} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                            <div className="w-8 h-8 rounded-lg grid place-items-center bg-cyan-500/10 text-cyan-300 shrink-0">
                              <Leaf className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold truncate">{p.product}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                HS {p.code} · {p.intensity} tCO₂e/t
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs font-bold tabular-nums">${(p.exposure / 1000).toFixed(0)}K</div>
                              <div className="text-[10px] text-slate-500">exposure</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl bg-black/40 border border-white/[0.06] p-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                          <span>Embedded intensity</span>
                          <span className="text-cyan-300">tCO₂e / tonne</span>
                        </div>
                        <Sparkline data={[5.2, 5.8, 6.1, 6.4, 6.0, 5.6, 5.2, 5.0, 4.8, 4.7]} color="#22d3ee" height={40} />
                      </div>
                    </div>
                  )}
                </div>

                {/* activity feed */}
                <div className="border-t lg:border-t-0 lg:border-l border-white/[0.06] p-4 bg-black/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      Live activity
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {events.map((e) => {
                      const Icon = e.kind === "warn" ? AlertTriangle : e.kind === "ai" ? Sparkles : CheckCircle2;
                      const tone =
                        e.kind === "warn"
                          ? "text-amber-400 bg-amber-500/10"
                          : e.kind === "ai"
                          ? "text-purple-300 bg-purple-500/10"
                          : "text-emerald-400 bg-emerald-500/10";
                      return (
                        <div key={e.id} className="flex items-start gap-2.5 text-[11px] leading-snug">
                          <div className={`w-5 h-5 rounded-md grid place-items-center shrink-0 mt-0.5 ${tone}`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-slate-300">{e.text}</div>
                            <div className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> {e.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── features ── */}
        <section id="features" className="max-w-4xl mx-auto px-4 pb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Three levers, one cockpit
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Click any card to jump straight into the live module.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setTab(f.tab);
                    document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="group w-full flex items-start gap-5 p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.02] transition-all text-left"
                >
                  <div className="shrink-0">
                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h3 className="text-base font-semibold">{f.title}</h3>
                      <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors shrink-0" />
                    </div>
                    <p className="text-slate-400 text-[13px] leading-relaxed">{f.desc}</p>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[10.5px] font-mono text-slate-500">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      {f.metric}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── CBAM / compliance band ── */}
        <section id="cbam" className="max-w-6xl mx-auto px-4 pb-20">
          <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-purple-500/[0.06] p-8 md:p-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10.5px] font-semibold mb-3">
                <Leaf className="w-3 h-3" /> EU CBAM · 2026
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">
                Emissions reporting, built in.
              </h3>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Every covered good carries its embedded intensity through the bonded ledger. Export a CBAM-ready declaration without a spreadsheet in sight.
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-full bg-white text-[#050505] px-6 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Start free trial <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Link>
              <a
                href="#dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  setTab("cbam");
                  document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 px-6 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
              >
                View CBAM module <ChevronRight className="ml-1 w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ── final CTA ── */}
        <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-slate-500 font-bold mb-4">
            <Zap className="w-3 h-3" /> Ready when you are
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Put the line on autopilot.
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Connect your ERP, import your bonded register, and watch shortage risk and liquidity appear in real time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-full bg-purple-600 px-7 text-sm font-bold shadow-[0_0_24px_rgba(168,85,247,0.35)] hover:bg-purple-500 transition-colors"
            >
              Create workspace <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-7 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Book a walkthrough
            </Link>
          </div>
        </section>

        {/* ── footer ── */}
        <footer className="border-t border-white/[0.06] py-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-500 to-cyan-400 grid place-items-center text-[#04121f] font-black text-[10px]">
                B
              </span>
              BrokerDesk Manufacturing · 2026
            </div>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-slate-300">Privacy</a>
              <a href="#" className="hover:text-slate-300">Terms</a>
              <a href="#" className="hover:text-slate-300">Security</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ───────────────────────── sub-components ───────────────────────── */

function MiniTile({ label, value, color = "#a855f7", warn = false }) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-2.5">
      <div className="text-[9.5px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
        {label}
      </div>
      <div
        className="text-sm font-bold tabular-nums"
        style={{ color: warn ? "#f59e0b" : color }}
      >
        {value}
      </div>
    </div>
  );
}