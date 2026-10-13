import {
  TwinForgeTopBar, TwinForgeSidebar, MarketplaceGrid,
} from '@/components/workflow-studio/digital-twin/twinforge';
import { DEMO_MARKETPLACE } from '@/lib/twinforge/demo-data';

export const metadata = { title: 'Marketplace' };
export const dynamic = 'force-dynamic';

export default function MarketplacePage() {
  return (
    <div className="flex h-full flex-col">
      <TwinForgeTopBar />
      <div className="flex flex-1 min-h-0">
        <TwinForgeSidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <MarketplaceGrid apps={DEMO_MARKETPLACE} />
        </main>
      </div>
    </div>
  );
}
