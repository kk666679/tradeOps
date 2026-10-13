import {
  TwinForgeTopBar, TwinForgeSidebar, OutcomesGrid,
} from '@/components/workflow-studio/digital-twin/twinforge';
import { DEMO_OUTCOMES, DEMO_PORTFOLIO } from '@/lib/twinforge/demo-data';

export const metadata = { title: 'Outcomes' };
export const dynamic = 'force-dynamic';

export default function OutcomesPage() {
  return (
    <div className="flex h-full flex-col">
      <TwinForgeTopBar />
      <div className="flex flex-1 min-h-0">
        <TwinForgeSidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <OutcomesGrid outcomes={DEMO_OUTCOMES} accounts={DEMO_PORTFOLIO} />
        </main>
      </div>
    </div>
  );
}
