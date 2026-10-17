import { Activity, Box, ShieldCheck, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Box className="w-5 h-5" /></div>
            <span className="text-emerald-400 text-sm flex items-center"><TrendingUp className="w-4 h-4 mr-1"/> +12%</span>
          </div>
          <p className="text-slate-400 text-sm">Total Containers</p>
          <h3 className="text-3xl font-bold text-white mt-1">14,209</h3>
        </div>
        
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Activity className="w-5 h-5" /></div>
          </div>
          <p className="text-slate-400 text-sm">Active AI Agents</p>
          <h3 className="text-3xl font-bold text-white mt-1">48</h3>
        </div>

        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><ShieldCheck className="w-5 h-5" /></div>
          </div>
          <p className="text-slate-400 text-sm">ZK-Proofs Verified</p>
          <h3 className="text-3xl font-bold text-white mt-1">8,921</h3>
        </div>
      </div>

      {/* 占位：这里是放置你 components/dashboard 下复杂图表或表格的地方 */}
      <div className="h-96 rounded-2xl bg-[#0A0A0A] border border-slate-800 p-6 flex flex-col items-center justify-center text-slate-500 border-dashed">
        <TerminalPlaceholder />
      </div>
    </div>
  );
}

function TerminalPlaceholder() {
  return (
    <div className="text-center">
      <p className="text-lg font-mono text-slate-400 mb-2">// components/dashboard/* ready to be injected here</p>
      <p className="text-sm">You have a massive library of dashboard components. Import them here!</p>
    </div>
  );
}
