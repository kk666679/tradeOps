'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types';
import { clock } from '@/lib/helpers';

export interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  approveOn: boolean;
  onToggleApprove: () => void;
}

export default function ChatPanel({
  messages, input, onInputChange, onSend, approveOn, onToggleApprove,
}: ChatPanelProps) {
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages.length]);

  return (
    <>
      <div ref={threadRef} className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto bg-[#131921] p-2">
        {messages.map((m) => {
          const bubbleCls =
            m.role === 'system' ? 'border-blue-500/20 bg-blue-500/[.06] text-[#9ca3af]'
            : m.role === 'user' ? 'border-[#374151] bg-[#1f2731]'
            : 'border-[#1e4976] bg-[#0f2a4a]';
          return (
            <div key={m.id} className="flex flex-col gap-[3px]">
              <div className={'rounded-md border px-2.5 py-2 text-[11.5px] leading-relaxed break-words ' + bubbleCls}>
                {m.text}
              </div>
              <div className="flex items-center gap-1.5 px-0.5 text-[9.5px] text-[#4b5563]">
                <span>{clock()}</span>
                <div className="flex-1" />
                <span>{m.role}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-none border-t border-[#1f2937] bg-[#0f141b] p-2">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder={'Message twinforge · brokerdesk-3.5-flash-studio.\nCommands: run · loop · status · manual · approve · clear'}
          className="min-h-[54px] w-full resize-none rounded border border-[#2d3748] bg-[#0a0e14] px-2 py-1.5 text-[11.5px] leading-snug text-[#e5e7eb] placeholder:text-[#4b5563] focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-none items-center gap-1.5 border-t border-[#1f2937] px-2 py-2">
        <button onClick={onToggleApprove}
          className={
            'flex items-center gap-1.5 rounded border px-2 py-[5px] text-[10.5px] font-semibold ' +
            (approveOn
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
              : 'border-[#2d3748] bg-[#131921] text-[#9ca3af]')
          }>
          <span>Approve</span>
          <span className={
            'relative h-[13px] w-[22px] rounded-full transition ' +
            (approveOn ? 'bg-emerald-500' : 'bg-[#374151]')
          }>
            <span className={
              'absolute top-[2px] h-[9px] w-[9px] rounded-full bg-white transition-all ' +
              (approveOn ? 'left-[11px]' : 'left-[2px]')
            } />
          </span>
        </button>
        <button onClick={onSend} title="Send"
          className="grid h-8 w-8 place-items-center rounded bg-blue-500 text-white hover:bg-blue-700">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </>
  );
}