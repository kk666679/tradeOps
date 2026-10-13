import {
  TwinForgeTopBar, TwinForgeSidebar, SlaTable,
} from '@/components/workflow-studio/digital-twin/twinforge';
import { DEMO_PORTFOLIO, DEMO_SLA } from '@/lib/twinforge/demo-data';

export const metadata = { title: 'SLA Attainment' };
export const dynamic = 'force-dynamic';

export default function SlaPage() {
  return (
    <div className="flex h-full flex-col">
      <TwinForgeTopBar />
      <div className="flex flex-1 min-h-0">
        <TwinForgeSidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <SlaTable metrics={DEMO_SLA} accounts={DEMO_PORTFOLIO} />
        </main>
      </div>
    </div>
  );
}
