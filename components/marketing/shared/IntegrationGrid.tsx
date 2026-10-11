import * as React from 'react';

export const DEFAULT_INTEGRATIONS = [
  'Customs gateway','ASYCUDA','ATIGA','RCEP','ERP','TMS','WMS','Webhooks','Agent mesh','EDI',
] as const;

export function IntegrationGrid({ items = DEFAULT_INTEGRATIONS }: { items?: readonly string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {items.map((n) => (
        <div key={n} className="flex items-center justify-between rounded border bg-card px-3 py-2 text-xs transition hover:border-primary/40">
          <span className="font-mono">{n}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </div>
      ))}
    </div>
  );
}
export default IntegrationGrid;
