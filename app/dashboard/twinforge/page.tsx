import {
  TwinForgeTopBar,
  TwinForgeSidebar,
  PortfolioGrid,
  LabGrid,
  SlaTable,
  OutcomesGrid,
  KpiTile,
} from '@/components/workflow-studio/digital-twin/twinforge';
import {
  DEMO_KPI,
  DEMO_LABS,
  DEMO_OUTCOMES,
  DEMO_PORTFOLIO,
  DEMO_SLA,
} from '@/lib/twinforge/demo-data';

export const dynamic = 'force-dynamic';

export default function TwinForgeOverview() {
  return (
    <div className="flex h-full flex-col">
      <TwinForgeTopBar />

      <div className="flex flex-1 min-h-0">
        <TwinForgeSidebar />

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          <header className="flex items-baseline justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-slate-100">
                TwinForge Studio
              </h1>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Subscribe · Connect · Simulate · Optimise
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-wide text-slate-600">
              DT-ISaaS · FIZ / FCZ · National Scale
            </span>
          </header>

          <section>
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              Portfolio KPIs
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {DEMO_KPI.map((kpi) => <KpiTile key={kpi.id} kpi={kpi} />)}
            </div>
          </section>

          <PortfolioGrid accounts={DEMO_PORTFOLIO} />

          <div className="grid gap-4 lg:grid-cols-2">
            <SlaTable metrics={DEMO_SLA} accounts={DEMO_PORTFOLIO} />
            <OutcomesGrid outcomes={DEMO_OUTCOMES} accounts={DEMO_PORTFOLIO} />
          </div>

          <LabGrid labs={[...DEMO_LABS]} />
        </main>
      </div>
    </div>
  );
}
