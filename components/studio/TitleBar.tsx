'use client';

export interface TitleBarProps {
  nodeCount: number;
  edgeCount: number;
}

export default function TitleBar({ nodeCount, edgeCount }: TitleBarProps) {
  return (
    <div className="flex items-center gap-2 border-b border-black bg-gradient-to-b from-[#1a2129] to-[#0f141b] px-2.5 text-[11px] text-[#9ca3af]">
      <div className="h-3.5 w-3.5 rounded-sm bg-gradient-to-br from-blue-500 to-purple-500" />
      <span>twinforge_studio__brokerdesk_v6 · {nodeCount} nodes · {edgeCount} edges</span>
      <div className="flex-1" />
      <div className="flex h-7">
        <button className="grid h-7 w-11 place-items-center text-[11px] text-[#9ca3af] hover:bg-[#1f2937]" title="Minimize">─</button>
        <button className="grid h-7 w-11 place-items-center text-[11px] text-[#9ca3af] hover:bg-[#1f2937]" title="Maximize">□</button>
        <button className="grid h-7 w-11 place-items-center text-[11px] text-[#9ca3af] hover:bg-red-600 hover:text-white" title="Close">✕</button>
      </div>
    </div>
  );
}