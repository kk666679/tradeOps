import * as React from 'react';
import { zoneChip } from './tone';

export interface CapabilityRow {
  domain: string;
  items: string[];
  zone: 'FIZ' | 'FCZ' | 'BOTH';
}

const DEFAULT_ROWS: CapabilityRow[] = [
  { domain: 'Trade OPS',        zone: 'BOTH', items: ['Declarations', 'HS classification', 'Duty & tax', 'Permits', 'Clearance', 'Compliance', 'Trade finance', 'Drawback'] },
  { domain: 'WMS',              zone: 'BOTH', items: ['Inbound', 'Outbound', 'Inventory', 'Slotting', 'Gate & ANPR', 'Bonded ledger', 'Exemption', 'Movements'] },
  { domain: 'FIZ pipeline',     zone: 'FIZ',  items: ['Raw material', 'Machinery', 'Production input', 'BOM & yield', 'Wastage', 'Subcontract', 'Finished goods'] },
  { domain: 'FCZ pipeline',     zone: 'FCZ',  items: ['Transhipment', 'Re-export', 'Break-bulk', 'Repacking', 'Entrepot', 'Value-add', 'Trading houses'] },
  { domain: 'Order management', zone: 'BOTH', items: ['Purchase', 'Manufacturing', 'Trading', 'Transhipment', 'Fulfilment', 'Approvals'] },
  { domain: 'Digital twin',     zone: 'BOTH', items: ['Zone graph', 'Scenario builder', 'What-if', 'Live metrics', 'Bottleneck Pareto'] },
  { domain: 'Custom agents',    zone: 'BOTH', items: ['Registry', 'Builder', 'Orchestration', 'Supervision', 'Policy', 'Monitoring', 'Audit', 'Memory', 'Evals'] },
  { domain: 'Integrations',     zone: 'BOTH', items: ['Customs gateway', 'ASYCUDA', 'ATIGA', 'RCEP', 'ERP', 'TMS', 'WMS', 'Webhooks', '@xyflow/react workflows'] },
];

export function CapabilityMatrix({ rows = DEFAULT_ROWS }: { rows?: CapabilityRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted text-xs uppercase text-muted-foreground">
          <tr>
            <th className="p-3 text-left">Domain</th>
            <th className="p-3 text-left">Capabilities</th>
            <th className="p-3 text-center">Zone</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.domain} className="border-b align-top last:border-0">
              <td className="p-3 font-medium">{r.domain}</td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {r.items.map((i) => <span key={i} className="rounded border bg-muted px-2 py-0.5 text-xs">{i}</span>)}
                </div>
              </td>
              <td className="p-3 text-center">
                {r.zone === 'BOTH' ? (
                  <div className="flex justify-center gap-1">
                    <span className={zoneChip('FIZ')}>FIZ</span>
                    <span className={zoneChip('FCZ')}>FCZ</span>
                  </div>
                ) : (
                  <span className={zoneChip(r.zone)}>{r.zone}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default CapabilityMatrix;
