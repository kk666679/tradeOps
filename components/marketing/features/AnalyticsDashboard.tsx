"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Box,
  Cpu,
  Globe,
  Hexagon,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

type AnalyticsLog = { text: string; type: string };

export default function AnalyticsDashboard({ logs = [
  { text: "AI Agent resolved HS Code dispute for shipment #8821", type: "ai" },
  { text: "ZK-Proof generated for EU origin cargo (Batch #44)", type: "web3" },
  { text: "Smart Contract escrow released: 45,000 USDC", type: "web3" },
  { text: "Demand forecast updated for Q3 warehouse capacity", type: "ai" },
] }: { logs?: AnalyticsLog[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const barData = [40, 70, 45, 90, 65, 85, 100, 60, 75, 95, 55, 80];
  const aiLogs = logs;

  if (!mounted) return null;

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
      
      {/* 仪表盘头部 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-sm font-mono text-slate-400 ml-4">TradeOps / Analytics_Overview</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Sync
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 左侧：KPI 和 主图表 (占据两列) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KPI 卡片区 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Box className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold text-emerald-400 flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-3 h-3 mr-0.5"/> 12%</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">Total Cargo</p>
              <h4 className="text-xl font-bold text-white">14,209</h4>
            </div>
            
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-bold text-emerald-400 flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-3 h-3 mr-0.5"/> 48</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">Active AI Agents</p>
              <h4 className="text-xl font-bold text-white">128</h4>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold text-slate-400">ERC-721</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">Tokenized RWA</p>
              <h4 className="text-xl font-bold text-white">$4.2M</h4>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Globe className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-bold text-emerald-400 flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-3 h-3 mr-0.5"/> 2.1s</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">Avg Clearance</p>
              <h4 className="text-xl font-bold text-white">0.8s</h4>
            </div>
          </div>

          {/* 柱状图区域 */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" /> Cargo Volume & Duty (30 Days)
                </h3>
              </div>
              <select className="bg-[#0A0A0A] border border-white/10 text-xs text-slate-300 rounded-lg px-2 py-1 outline-none">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
              </select>
            </div>
            
            {/* 纯 CSS 柱状图 */}
            <div className="h-48 flex items-end justify-between gap-2 md:gap-4">
              {barData.map((height, i) => (
                <div key={i} className="relative w-full group flex flex-col items-center justify-end h-full gap-2">
                  {/* Tooltip */}
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-bold px-2 py-1 rounded pointer-events-none">
                    ${height * 10}k
                  </div>
                  {/* 柱子 */}
                  <div 
                    className={`w-full max-w-[30px] rounded-t-sm transition-all duration-500 ${
                      i === 6 ? 'bg-gradient-to-t from-blue-600 to-purple-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/10 group-hover:bg-white/20'
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  {/* X 轴标签 (仅显示部分) */}
                  {i % 2 === 0 && <span className="text-[10px] text-slate-600 font-mono">{i + 1}d</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：AI & Web3 活动日志 */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#050505] border border-white/10 h-full relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Autonomous Activity
            </h3>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar font-mono text-xs">
              {aiLogs.map((log, i) => (
                <div key={i} className="flex gap-3 items-start p-2 rounded bg-white/[0.02] border border-white/5">
                  {log.type === 'ai' ? (
                    <span className="text-purple-400 shrink-0 mt-0.5"><Cpu className="w-3 h-3" /></span>
                  ) : (
                    <span className="text-emerald-400 shrink-0 mt-0.5"><Hexagon className="w-3 h-3" /></span>
                  )}
                  <span className="text-slate-400 leading-relaxed">{log.text}</span>
                </div>
              ))}
              <div className="p-2 rounded bg-white/[0.02] border border-white/5 flex gap-3 items-center animate-pulse">
                <span className="text-blue-400 shrink-0"><Zap className="w-3 h-3" /></span>
                <span className="text-slate-500 italic">Agent listening for events...</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                <span>Network Health</span>
                <span className="text-emerald-400">99.99%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '99.99%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
