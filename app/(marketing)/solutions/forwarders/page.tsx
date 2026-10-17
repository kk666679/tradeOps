import Link from "next/link";
import { ArrowRight, Hexagon, Wallet, MessageSquare } from "lucide-react";

export default function ForwardersPage() {
  const features = [
    { title: "Tokenized eBL (NFT)", desc: "Mint electronic Bills of Lading as ERC-721 tokens. Transfer ownership instantly across the globe without courier delays.", icon: Hexagon },
    { title: "Smart Contract Escrow", desc: "Automate freight settlements. Funds are released in USDC instantly upon IoT verified port arrival.", icon: Wallet },
    { title: "RAG Customer Service", desc: "Provide 24/7 natural language tracking. Customers ask 'Where is my container?', our AI answers instantly using cargo data.", icon: MessageSquare }
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
            <Hexagon className="w-4 h-4" /> Freight Forwarding
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Move cargo, <br/> move value instantly.</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">Eliminate paperwork and payment delays. Use on-chain assets and smart contracts to settle transactions in seconds.</p>
          <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-8 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-500 transition-colors">
            Digitize Your Freight <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* Features */}
        <div className="space-y-6 max-w-3xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex gap-6 p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors">
                <div className="shrink-0 mt-1">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Icon className="w-6 h-6" /></div>
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
