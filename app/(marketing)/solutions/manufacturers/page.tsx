import Link from "next/link";
import { ArrowRight, Factory, TrendingUp, Layers } from "lucide-react";

export default function ManufacturersPage() {
  const features = [
    { title: "Bonded Ledger (FIZ)", desc: "Seamlessly track duty-suspended raw materials. AI automatically deducts inventory as it enters the production line.", icon: Layers },
    { title: "Predictive Demand", desc: "Forecast raw material shortages weeks in advance using TensorFlow models trained on your historical production data.", icon: TrendingUp },
    { title: "RWA Financing", desc: "Tokenize finished goods in the warehouse to access instant DeFi liquidity from global lenders.", icon: Factory }
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
            <Factory className="w-4 h-4" /> Manufacturing & FIZ
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Never halt <br/> the production line.</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">Gain absolute visibility into bonded inventory, automate compliance, and unlock capital through RWA tokenization.</p>
          <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-full bg-purple-600 px-8 text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-purple-500 transition-colors">
            Optimize Production <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* Features */}
        <div className="space-y-6 max-w-3xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex gap-6 p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors">
                <div className="shrink-0 mt-1">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Icon className="w-6 h-6" /></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
