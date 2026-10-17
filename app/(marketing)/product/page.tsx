import { ShieldCheck, Box, Cpu } from "lucide-react";

export default function ProductPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">The Complete Operations Stack.</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-16 text-center max-w-2xl mx-auto">Every tool your CFS and Free Zone needs, from the gate to the final declaration.</p>
      
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center bg-white dark:bg-black/60 dark:backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl">
          <div className="bg-blue-50 dark:bg-blue-500/20 p-6 rounded-2xl text-blue-600 dark:text-blue-400"><Box className="w-12 h-12" /></div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Warehouse Management</h3>
            <p className="text-slate-600 dark:text-slate-400">Real-time visibility into inventory, automated slot allocation, and seamless gate-in/gate-out operations with weighbridge and ANPR integration.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center bg-white dark:bg-black/60 dark:backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl">
          <div className="bg-emerald-50 dark:bg-emerald-500/20 p-6 rounded-2xl text-emerald-600 dark:text-emerald-400"><ShieldCheck className="w-12 h-12" /></div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Customs Compliance Engine</h3>
            <p className="text-slate-600 dark:text-slate-400">Automated HS code classification, precise duty and tax calculation, and full audit trails ensuring you never miss a regulatory update.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center bg-white dark:bg-black/60 dark:backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl">
          <div className="bg-indigo-50 dark:bg-indigo-500/20 p-6 rounded-2xl text-indigo-600 dark:text-indigo-400"><Cpu className="w-12 h-12" /></div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Agentic AI Layer</h3>
            <p className="text-slate-600 dark:text-slate-400">Multi-agent workflows for document intake and compliance risk detection. Let AI handle the tedious work while you maintain total control.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
