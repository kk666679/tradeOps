'use client';

import { TwinSandbox } from '@/components/digital-twin/simulation/TwinSandbox';
import { TwinWhatIfPanel } from '@/components/digital-twin/simulation/TwinWhatIfPanel';

export interface WhatIfPanelProps {
  className?: string;
  zone?: 'FIZ' | 'FCZ' | 'BONDED';
  tenantId?: string;
}

export function WhatIfPanel({ className, zone = 'FIZ', tenantId }: WhatIfPanelProps) {
  return (
    <section className={`space-y-6 ${className ?? ''}`} data-zone={zone} data-tenant={tenantId}>
      <TwinWhatIfPanel
        title="Scenario inputs"
        hint="Adjust the operating assumptions for the scenario."
        zone={zone === 'BONDED' ? undefined : zone}
      />
      <TwinSandbox
        title="Projected outcome"
        value="No results"
        hint="Run a simulation to populate projected outcomes."
        zone={zone === 'BONDED' ? undefined : zone}
      />
    </section>
  );
}

export default WhatIfPanel;
