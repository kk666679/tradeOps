import Link from "next/link";
import { Box, LayoutDashboard, Settings, Terminal, LogOut } from "lucide-react";
// import { Sidebar } from "@/components/navigation/sidebar";
// import { Topbar } from "@/components/navigation/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      {/* 侧边栏 (模拟你 components/navigation 中的组件) */}
      <aside className="w-64 border-r border-slate-800 bg-[#0A0A0A] flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link href="/" className="font-bold text-xl text-white flex items-center gap-2">
            <Box className="text-blue-500" /> TradeOps
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/dashboard/wms" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Terminal className="w-5 h-5" /> WMS Console
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" /> Exit to Web
          </Link>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-slate-800 bg-[#0A0A0A]/50 backdrop-blur-md flex items-center justify-between px-6">
          <div className="font-semibold text-lg">Operations Overview</div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-400">Status: <span className="text-emerald-400">Optimal</span></span>
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
