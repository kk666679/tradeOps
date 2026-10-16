import { AgentStatus } from '@/components/ai/agent-ui/agent-status';
import { TokenCounter } from '@/components/ai/meta/token-counter';
import { CostMeter } from '@/components/ai/meta/cost-meter';

async function getOverview() {
  return {
    activeAgents: 12,
    runningRuns: 4,
    tokensToday: 184_200,
    costToday: 12.47,
  };
}

export default async function DashboardPage() {
  const o = await getOverview();
  return (
    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="ai-panel p-3">
        <div className="ai-panel-title mb-2">Active agents</div>
        <div className="text-[24px] font-bold">{o.activeAgents}</div>
        <AgentStatus status="tool" />
      </div>
      <div className="ai-panel p-3">
        <div className="ai-panel-title mb-2">Running runs</div>
        <div className="text-[24px] font-bold">{o.runningRuns}</div>
      </div>
      <div className="ai-panel p-3">
        <div className="ai-panel-title mb-2">Tokens today</div>
        <TokenCounter input={o.tokensToday * 0.7} output={o.tokensToday * 0.3} compact />
      </div>
      <div className="ai-panel p-3">
        <div className="ai-panel-title mb-2">Cost today</div>
        <CostMeter usd={o.costToday} currency="USD" />
      </div>
    </div>
  );
}
