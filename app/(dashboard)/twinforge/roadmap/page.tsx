import {
  TwinForgeTopBar, TwinForgeSidebar, RoadmapTimeline,
} from '@/components/workflow-studio/digital-twin/twinforge';
import { DEMO_ROADMAP } from '@/lib/twinforge/demo-data';

export const metadata = { title: 'Roadmap' };
export const dynamic = 'force-dynamic';

export default function RoadmapPage() {
  return (
    <div className="flex h-full flex-col">
      <TwinForgeTopBar />
      <div className="flex flex-1 min-h-0">
        <TwinForgeSidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <RoadmapTimeline items={DEMO_ROADMAP} />
        </main>
      </div>
    </div>
  );
}
