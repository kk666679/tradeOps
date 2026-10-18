import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/marketing/hero/Hero";
import FeatureGrid from "@/components/marketing/features/FeatureGrid";
import Stats from "@/components/marketing/stats/Stats";
import Testimonials from "@/components/marketing/testimonials/Testimonials";
import CTA from "@/components/marketing/cta/CTA";
import AnalyticsDashboard from "@/components/marketing/features/AnalyticsDashboard";
import { WalletInfoWrapper } from "@/components/web3/WalletInfoWrapper";
import { TrustBanner } from "@/components/marketing/TrustBanner";
import { AIChatWidget } from "@/components/marketing/AIChatWidget";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import Footer from "@/components/marketing/shell/Footer";

import { solutionsData, featuresData, statsData, aiLogsData } from "@/lib/data";

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col w-full bg-[#050505] text-white">
      {/* AI Chat Widget */}
      <AIChatWidget />

      {/* 1. Hero 区域 */}
      <section className="w-full">
        <Hero />
      </section>

      {/* 2. 新增：Cloud Banner + Marquee */}
      <TrustBanner />

      {/* 3. Zon Bebas 模块 */}
      <section className="w-full py-16 bg-[#050505] flex justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-300">Built for Malaysian Free Zones</h2>
            <p className="text-sm text-slate-500 mt-2">Comprehensive modules tailored for Zon Bebas operations.</p>
          </div>
          <div className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-emerald-500/30 to-purple-500/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <img src="/zon_bebas_logo_set.svg" alt="Zon Bebas Malaysia" className="relative w-full h-auto rounded-3xl border border-white/10 shadow-2xl bg-[#f4f7f9]" />
          </div>
        </div>
      </section>

      {/* 4. Features 网格 */}
      <section className="w-full py-24 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">Enterprise Modules Wired</h2>
          </div>
          <FeatureGrid features={featuresData} />
        </div>
      </section>

      {/* 5. Analytics Dashboard */}
      <section className="w-full py-12 bg-gradient-to-b from-[#050505] to-black relative">
        <div className="container mx-auto px-4">
          <AnalyticsDashboard logs={aiLogsData} />
        </div>
      </section>

      {/* 6. 解决方案循环 */}
      <section className="w-full py-24 bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Solutions for Every Entity</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {solutionsData.map((sol, i) => (
              <Link key={i} href={sol.href} className="group relative rounded-3xl bg-white/[0.02] border border-white/5 p-8 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${sol.bg} ${sol.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <DynamicIcon name={sol.iconName} className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{sol.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{sol.description}</p>
                <div className="flex items-center text-sm font-semibold text-white">
                  Explore <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 统计数据 */}
      <section className="w-full py-16 bg-[#050505]">
        <Stats stats={statsData as any} />
      </section>

      {/* 8. Web3 连接区 */}
      <section className="w-full py-24 bg-black flex justify-center border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Connect to the Trust Layer</h2>
          <div className="flex justify-center">
            <WalletInfoWrapper />
          </div>
        </div>
      </section>

      {/* 9. 客户评价 */}
      <section className="w-full py-24 bg-[#050505]">
        <Testimonials />
      </section>

      {/* 10. CTA */}
      <section className="w-full">
        <CTA />
      </section>

      <Footer />
    </div>
  );
}
