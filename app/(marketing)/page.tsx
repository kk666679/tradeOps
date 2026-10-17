import Link from "next/link";
import { ArrowRight, Wallet, ShieldCheck, Box } from "lucide-react";
// 尝试引入你现有的 marketing 组件 (请根据你实际的导出名称调整)
// import { Hero } from "@/components/marketing/hero";
// import { Features } from "@/components/marketing/features";
// import { CTA } from "@/components/marketing/cta";

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* 如果 Hero 组件存在，可以直接 <Hero /> */}
      <section className="relative w-full py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-emerald-600/30 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Live: Mainnet Connected
        </div>
        
        <h1 className="max-w-4xl text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
          The Operating System for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Global Trade 3.0
          </span>
        </h1>
        <p className="max-w-2xl text-slate-400 mb-10 text-lg">
          Agentic AI, ZK-Compliance, and RWA Tokenization for Container Freight Stations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="h-12 inline-flex items-center justify-center rounded-full bg-blue-600 px-8 font-semibold hover:bg-blue-500 transition-colors">
            Enter Dashboard <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link href="/login" className="h-12 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 font-semibold hover:bg-white/10 transition-colors">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 container mx-auto max-w-6xl border-t border-white/10">
        <h2 className="text-3xl font-bold text-center mb-12">Enterprise Modules Wired</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* 这里你可以 map 你的 features 数据 */}
          <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-white/20 transition-all">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Immutable Ledger</h3>
            <p className="text-slate-400 text-sm">Zero-knowledge proofs for customs compliance.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-white/20 transition-all">
            <Box className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">RWA Tokenization</h3>
            <p className="text-slate-400 text-sm">Mint warehouse receipts directly on-chain.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-white/20 transition-all">
            <Wallet className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Wallet Auth</h3>
            <p className="text-slate-400 text-sm">Passkey & Account Abstraction login.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
