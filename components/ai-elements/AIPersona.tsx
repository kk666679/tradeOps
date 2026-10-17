"use client";

import { Bot, MessageSquare, X } from "lucide-react";
import { useState } from "react";

export function AIPersona() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-72 rounded-2xl bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 p-4 shadow-2xl animate-in slide-in-from-bottom-4 fade-in">
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">AI Agent</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Hello! I am your TradeOps AI Agent. I can help you resolve HS codes, track cargo, or draft customs declarations. How can I assist you today?
          </p>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:scale-110 transition-transform"
      >
        <div className="absolute inset-0 rounded-full bg-blue-400 blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <Bot className="relative z-10 w-7 h-7 text-white" />
      </button>
    </div>
  );
}
