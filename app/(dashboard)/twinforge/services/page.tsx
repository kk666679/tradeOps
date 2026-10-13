import {
  TwinForgeTopBar,
  TwinForgeSidebar,
  ServiceCatalogue,
  ServiceDrawer,
} from '@/components/workflow-studio/digital-twin/twinforge';
import { SERVICES } from '@/lib/twinforge/catalog';

export const metadata = { title: 'Services' };
export const dynamic = 'force-dynamic';

export default function ServicesPage() {
  return (
    <div className="flex h-full flex-col">
      <TwinForgeTopBar />
      <div className="flex flex-1 min-h-0">
        <TwinForgeSidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <ServiceCatalogue services={SERVICES} />
          <ServiceDrawer />
        </main>
      </div>
    </div>
  );
}
