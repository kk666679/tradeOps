import Link from "next/link";
import { ArrowRight, BrainCircuit, ShieldCheck, FileSearch } from "lucide-react";

export default function BrokersPage() {
  const features = [
    { title: "AI Document Extraction", desc: "Extract commercial invoices, packing lists, and B/L data with 99.9% accuracy using multimodal LLMs.", icon: BrainCircuit },
    { title: "Instant Tariff Engine", desc: "Resolve MFN and FTA duties instantly across 6-digit HS codes with an auditable source trail.", icon: FileSearch },
    { title: "ZK-Compliance Proofs", desc: "Prove origin and regulatory compliance to customs without exposing your client's sensitive trade secrets.", icon: ShieldCheck }
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
            <ShieldCheck className="w-4 h-4" /> Customs Brokerage
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Clear customs at the <br/> speed of AI.</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">Stop manually keying in declarations. Let autonomous agents draft, validate, and audit your customs entries.</p>
          <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-sm font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-colors">
            Start Clearing Faster <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* Features */}
        <div className="space-y-6 max-w-3xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex gap-6 p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors">
                <div className="shrink-0 mt-1">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Icon className="w-6 h-6" /></div>
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
