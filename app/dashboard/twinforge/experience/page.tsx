import {
  TwinForgeTopBar, TwinForgeSidebar, ExperiencePreview,
} from '@/components/workflow-studio/digital-twin/twinforge';

export const metadata = { title: 'Experience' };
export const dynamic = 'force-dynamic';

export default function ExperiencePage() {
  return (
    <div className="flex h-full flex-col">
      <TwinForgeTopBar />
      <div className="flex flex-1 min-h-0">
        <TwinForgeSidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <ExperiencePreview />
        </main>
      </div>
    </div>
  );
}
