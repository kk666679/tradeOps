/**
 * Entrepot reconciliation guidance prompt.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const EntrepotReconciliationArgsSchema = {
  period: z.string(),
  zone: z.string().optional(),
};

export function registerEntrepotReconciliationPrompt(server: McpServer): void {
  server.prompt(
    'entrepot-reconciliation',
    'Entrepot reconciliation workflow guidance',
    EntrepotReconciliationArgsSchema,
    async (args: any) => {
      const text = `
# Entrepot Reconciliation Workflow

## Period: ${args.period}
## Zone: ${args.zone || 'All zones'}

### Reconciliation Checklist

1. **Prepare Reconciliation Period**
   - Set period parameters: ${args.period}
   - Confirm zone scope: ${args.zone || 'Enterprise-wide'}
   - Gather supporting documentation

2. **Query Ledger Events**
   - Use \`ledger_query_events\` with period filter
   - Collect all entrepot-related events
   - Verify event completeness

3. **Reconcile Transfers**
   - Match inbound receipts to outbound shipments
   - Verify \`fcz_entrepot_match\` events
   - Check for unmatched transfers

4. **Verify Duty Status**
   - Review duty status in ledger events
   - Cross-check with backend tariff data
   - Identify suspended vs. paid duty items

5. **Calculate Totals**
   - Sum quantities by HS code
   - Calculate duties by status
   - Prepare reconciliation report

6. **Reconcile Differences**
   - Investigate discrepancies
   - Document exceptions
   - Initiate corrections if needed

7. **Approve and Close**
   - Review reconciliation results
   - Obtain approvals from zone managers
   - Use \`audit_period_close\` to finalize

### Key Metrics to Track

- Total inbound quantity and value
- Total outbound quantity and value
- Unmatched transfers (qty and value)
- Duty amounts by status

### Tools Available

- \`ledger_query_events\` — retrieve period events
- \`ledger_get_event\` — examine specific events
- \`fcz_entrepot_match\` — record matched transfers
- \`audit_period_close\` — finalize period

### References

- Entrepot Manual: https://entrepot.tradeops.local
- Duty Regulations: https://customs.local/duties
- Period Closure Guidelines: https://tradeops.local/periods
            `.trim();
      return {
        messages: [
          {
            role: 'user',
            content: { type: 'text', text },
          },
        ],
      };
    },
  );
}
