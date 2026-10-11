/**
 * Pre-clearance guidance prompt.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const PreClearanceArgsSchema = {
  declId: z.string(),
  hsCode: z.string().optional(),
  countryOfOrigin: z.string().optional(),
};

export function registerPreClearancePrompt(server: McpServer): void {
  server.prompt(
    'pre-clearance',
    'Pre-clearance workflow guidance',
    PreClearanceArgsSchema,
    async (args: any) => {
      const text = `
# Pre-Clearance Workflow Guidance

## Declaration: ${args.declId}

### Steps to Complete Pre-Clearance

1. **Verify Documentation**
   - Check invoice, packing list, and bill of lading
   - Confirm HS code: ${args.hsCode || 'Not provided'}
   - Verify country of origin: ${args.countryOfOrigin || 'Not provided'}

2. **Conduct Initial Inspection**
   - Physical inspection of goods
   - Match against declared quantity and description
   - Check for any signs of tampering or damage

3. **Verify Customs Data**
   - Cross-reference against declared HS code
   - Check tariff classification
   - Verify duty status

4. **Approve or Escalate**
   - If compliant: approve entry
   - If discrepancies found: escalate to customs officer
   - Document any exceptions

5. **Complete Processing**
   - Generate clearance certificate
   - Update ledger with clearance status
   - Notify relevant parties

### Tools Available

- \`customs_validate_entry\` — validate the entry
- \`customs_query_tariff\` — check applicable tariffs
- \`hs_validate_code\` — verify HS code

### References

- Trade OPS Documentation: https://tradeops.local/docs
- Customs Manual: https://customs.local/manual
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
