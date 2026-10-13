'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { DigitalTwinTopBar } from './shell/DigitalTwinTopBar';
import { DigitalTwinSidebar } from './shell/DigitalTwinSidebar';
import { DigitalTwinDock } from './shell/DigitalTwinDock';
import { DigitalTwinCanvas } from './canvas/DigitalTwinCanvas';
import { DigitalTwinInspector } from './inspector/DigitalTwinInspector';
import { useTwinStream } from './hooks/useTwinStream';
import { useTwinShortcuts } from './hooks/useTwinShortcuts';
import { useDigitalTwinStore } from './store/useDigitalTwinStore';

function StudioInner({ zoneId }: { zoneId: string }) {
  useTwinStream();
  useTwinShortcuts();

  const sidebarOpen = useDigitalTwinStore((s) => s.sidebarOpen);
  const dockOpen = useDigitalTwinStore((s) => s.dockOpen);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-slate-100">
      <DigitalTwinTopBar />
      <div className="flex-1 flex min-h-0">
        {sidebarOpen && <DigitalTwinSidebar zoneId={zoneId} />}
        <main className="flex-1 min-w-0 relative">
          <DigitalTwinCanvas />
        </main>
        <DigitalTwinInspector />
      </div>
      {dockOpen && <DigitalTwinDock />}
    </div>
  );
}

export function DigitalTwinStudio({ zoneId }: { zoneId: string }) {
  return (
    <ReactFlowProvider>
      <StudioInner zoneId={zoneId} />
    </ReactFlowProvider>
  );
}

export default DigitalTwinStudio;
