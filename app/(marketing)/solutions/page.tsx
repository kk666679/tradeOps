import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Factory } from "lucide-react";

const solutions = [
  {
    title: "For Customs Brokers",
    description: "Automate HS classification, eliminate manual data entry, and generate ZK-proofs for tariff compliance.",
    href: "/solutions/brokers",
    icon: ShieldCheck,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    title: "For Freight Forwarders",
    description: "Tokenize Bills of Lading (eBL), settle fees instantly via smart contracts, and provide real-time tracking.",
    href: "/solutions/forwarders",
    icon: Truck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  {
    title: "For Manufacturers",
    description: "Track bonded inventory effortlessly, forecast raw material demand with AI, and finance via RWA tokenization.",
    href: "/solutions/manufacturers",
    icon: Factory,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  }
];

export default function SolutionsHubPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Every Entity</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Whether you are clearing goods, moving them across oceans, or manufacturing them, TradeOps is the operating system for your operations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <Link key={i} href={sol.href} className="group relative rounded-3xl bg-[#0A0A0A] border border-white/5 p-8 hover:border-white/20 hover:-translate-y-2 transition-all duration-300">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${sol.bg} ${sol.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{sol.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-8">{sol.description}</p>
                <div className="flex items-center text-sm font-semibold text-white">
                  Explore Solution <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
