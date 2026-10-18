'use client';
import * as React from 'react';
import Link from "next/link";
import { Box, LayoutDashboard, Settings, Terminal, LogOut, Menu, X } from "lucide-react";
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 relative">
      {/* Mobile sidebar overlay */}
      <div className="fixed inset-0 z-20 bg-black/60 hidden md:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      {/* 侧边栏 */}
      <aside className={`fixed z-30 left-0 top-0 h-full w-64 border-r border-slate-800 bg-[#0A0A0A] flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:flex`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <Box className="text-blue-500" /> TradeOps
          </Link>
          <button className="ml-auto p-2 md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X className="w-5 h-5" />
          </button>
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
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden ${!sidebarOpen ? 'md:pl-0' : 'pl-0'}`}>
        <header className="h-16 border-b border-slate-800 bg-[#0A0A0A]/50 backdrop-blur-md flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <button className="p-2 md:hidden text-slate-400 hover:text-white" aria-label="Open sidebar" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-semibold text-lg hidden md:block">Operations Overview</div>
          </div>
<div className="flex items-center gap-4">
             <ThemeToggle />
             <span className="text-sm text-slate-400 hidden sm:block">Status: <span className="text-emerald-400">Optimal</span></span>
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
           </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 sm:p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
