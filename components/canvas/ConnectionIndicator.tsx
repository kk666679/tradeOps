'use client';

import { useConnection } from '@xyflow/react';

export default function ConnectionIndicator() {
  const connection = useConnection();

  if (!connection.inProgress) {
    return (
      <div className="rounded-md border border-[#2d3748] bg-[#0b1424ee] px-2.5 py-1 font-mono text-[10px] text-[#9ca3af]">
        drag from a handle to wire · <b className="text-cyan-400">Del</b> removes selection
      </div>
    );
  }

  return (
    <div className="rounded-md border border-cyan-500 bg-[#0b1424ee] px-2.5 py-1 font-mono text-[10px] text-[#9ca3af]">
      wiring from <b className="text-cyan-400">{connection.fromHandle?.id || '?'}</b> · release on a target handle
    </div>
  );
}