"use client";

import Link from "next/link";
import { 
  ArrowRight, Box, ShieldCheck, Cpu, Globe, Wallet, Hexagon, 
  Activity, Lock, Fingerprint, BrainCircuit, Leaf, Zap, Network, ArrowUpRight
} from "lucide-react";
import { useState, useEffect } from "react";

// --- 2026 Web3 智能钱包组件 (AA - Account Abstraction 模拟) ---
function SmartWalletButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // 模拟无感登录 (Passkey / Social Login)
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 800);
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all overflow-hidden group ${
        isConnected 
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
          : "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
      }`}
    >
      {isConnecting ? (
        <span className="flex items-center gap-2"><Activity className="w-4 h-4 animate-spin" /> Authenticating...</span>
      ) : isConnected ? (
        <><Fingerprint className="w-4 h-4" /> Smart Account: 0x7A...F91</>
      ) : (
        <><Wallet className="w-4 h-4 group-hover:scale-110 transition-transform" /> Sign in with Smart Wallet</>
      )}
    </button>
  );
}

// --- 2026 核心数据 (Bento Box 架构) ---
const features = [
  {
    title: "Agentic AI Orchestrator",
    description: "Autonomous multi-agent swarms negotiate freight rates, file customs declarations, and resolve exceptions 24/7.",
    icon: BrainCircuit,
    colSpan: "md:col-span-2",
    gradient: "from-purple-500/20 to-blue-500/20",
    iconColor: "text-purple-500",
  },
  {
    title: "ZK-Compliance",
    description: "Prove cargo origin and tariff eligibility using Zero-Knowledge Proofs. Privacy-preserving regulatory checks.",
    icon: ShieldCheck,
    colSpan: "md:col-span-1",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    title: "RWA Tokenization",
    description: "Mint warehouse receipts as Real-World Assets (RWAs) on-chain. Fractionalize high-value cargo.",
    icon: Hexagon,
    colSpan: "md:col-span-1",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    title: "Post-Quantum Security",
    description: "Enterprise data secured with lattice-based cryptography. Future-proof against quantum attacks.",
    icon: Lock,
    colSpan: "md:col-span-1",
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-500",
  },
  {
    title: "Green Supply Chain",
    description: "Real-time carbon footprint tracking per container. Automated ESG reporting powered by IoT.",
    icon: Leaf,
    colSpan: "md:col-span-1",
    gradient: "from-lime-500/20 to-green-500/20",
    iconColor: "text-lime-500",
  },
];

export default function MarketingHomePage() {
  // 模拟 2026 实时网络状态
  const [networkStatus, setNetworkStatus] = useState("Syncing...");
  useEffect(() => {
    const timer = setTimeout(() => setNetworkStatus("Optimistic Rollup L2 Active"), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center bg-[#050505] min-h-screen text-slate-200 overflow-hidden selection:bg-purple-500/30">
      
      {/* 1. HERO SECTION (Ambient Glow & Deep Space) */}
      <section className="w-full relative py-32 md:py-48 flex justify-center">
        {/* 2026 趋势：极光/环境光背景 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-emerald-600/30 blur-[120px] rounded-full pointer-events-none opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
              {networkStatus}
            </span>
          </div>

          <h1 className="mx-auto max-w-5xl text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            The Operating System for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-gradient-x">
              Global Trade 3.0
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-400 mb-12 font-light">
            TradeOps combines Agentic AI, Zero-Knowledge compliance, and Real-World Asset tokenization to bring trillion-dollar logistics infrastructure on-chain.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link href="/register" className="h-14 inline-flex items-center justify-center rounded-full bg-white text-black px-8 text-base font-semibold transition-transform hover:scale-105">
              Deploy Your Node <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <SmartWalletButton />
          </div>
        </div>
      </section>

      {/* 2. BENTO BOX FEATURE GRID (2026 UI Trend) */}
      <section className="w-full py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-16 md:text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Beyond Traditional WMS.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A modular, autonomous architecture designed for the next decade of trade.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(200px,auto)]">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={i} 
                  className={`group relative rounded-3xl bg-[#0A0A0A] border border-white/5 p-8 overflow-hidden hover:border-white/20 transition-all duration-500 ${feature.colSpan}`}
                >
                  {/* 内部渐变发光 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 mb-6 ${feature.iconColor}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">{feature.title}</h3>
                      <p className="text-slate-400 leading-relaxed font-light">{feature.description}</p>
                    </div>
                    <div className="mt-8 flex items-center text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      Explore Module <ArrowUpRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE AI & WEB3 SHOWCASE (Split Screen) */}
      <section className="w-full py-24 relative border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* 左侧：AI Agent 控制台 */}
            <div className="flex-1 space-y-8 w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Autonomous Agents at Work.</h2>
              <p className="text-lg text-slate-400 font-light">
                Stop manually keying in declarations. Our AI agents watch the blockchain for freight events, cross-reference HS codes, and settle duties instantly via smart contracts.
              </p>
              
              {/* 模拟终端界面 */}
              <div className="rounded-2xl bg-black border border-white/10 p-6 font-mono text-sm shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="space-y-3 text-slate-300">
                  <p className="text-emerald-400">$ ops-agent --init --zone=FCZ-01</p>
                  <p>[INFO] Initializing Neural Customs Agent...</p>
                  <p>[INFO] Connected to Ethereum L2 Rollup.</p>
                  <p className="text-blue-400">[ACTION] Detected Bill of Lading #BOL-9982</p>
                  <p>[SYSTEM] Auto-classifying HS Code: 8517.62.00</p>
                  <p className="text-purple-400">[SYSTEM] Generating ZK-Proof for Origin (MY to SG)</p>
                  <p className="text-emerald-500">[SUCCESS] Duty calculated: 0% (ATIGA Treaty applied).</p>
                  <p className="animate-pulse">_</p>
                </div>
              </div>
            </div>

            {/* 右侧：3D/玻璃拟态 RWA 资产卡片 */}
            <div className="flex-1 w-full max-w-md mx-auto perspective-1000">
              <div className="relative rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent p-[1px] transform transition-transform duration-700 hover:rotate-y-12 hover:rotate-x-6 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                <div className="rounded-[2rem] bg-black/80 backdrop-blur-2xl p-8 h-full border border-white/10">
                  
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg"><Box className="w-6 h-6 text-blue-400" /></div>
                      <div>
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Real-World Asset</p>
                        <p className="font-bold text-white text-lg">Refrigerated Container</p>
                      </div>
                    </div>
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-500 text-sm">Token Standard</span>
                      <span className="font-mono text-white text-sm">ERC-721 (RWA)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-500 text-sm">Valuation</span>
                      <span className="font-mono text-emerald-400 text-sm">$ 145,000 USDC</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-500 text-sm">Compliance</span>
                      <span className="font-mono text-blue-400 text-sm flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> ZK-Verified
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex justify-center items-center gap-2">
                    <Network className="w-5 h-5" /> Trade Asset
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CTA SECTION (Minimalist) */}
      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready for the future of trade?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">Deploy your enterprise node today and let agents handle the rest.</p>
          <Link href="/register" className="inline-flex h-14 items-center justify-center rounded-full bg-blue-600 px-10 text-base font-semibold text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform">
            Start Building
          </Link>
        </div>
      </section>
    </div>
  );
}
