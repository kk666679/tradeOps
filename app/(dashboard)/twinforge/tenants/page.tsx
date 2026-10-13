import {
  TwinForgeTopBar, TwinForgeSidebar, TenantOnboarding,
} from '@/components/workflow-studio/digital-twin/twinforge';
import { DEMO_TENANT_ONBOARDING } from '@/lib/twinforge/demo-data';

export const metadata = { title: 'Tenants' };
export const dynamic = 'force-dynamic';

export default function TenantsPage() {
  return (
    <div className="flex h-full flex-col">
      <TwinForgeTopBar />
      <div className="flex flex-1 min-h-0">
        <TwinForgeSidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <TenantOnboarding
            stages={DEMO_TENANT_ONBOARDING}
            tenantName="Penang International Airport"
          />
        </main>
      </div>
    </div>
  );
}
