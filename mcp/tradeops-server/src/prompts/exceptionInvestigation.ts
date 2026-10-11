/**
 * Exception investigation guidance prompt.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const ExceptionInvestigationArgsSchema = {
  eventId: z.string(),
  zone: z.string(),
};

export function registerExceptionInvestigationPrompt(server: McpServer): void {
  server.prompt(
    'exception-investigation',
    'Exception investigation workflow guidance',
    ExceptionInvestigationArgsSchema,
    async (args: any) => {
      const text = `
# Exception Investigation Workflow

## Event: ${args.eventId}
## Zone: ${args.zone}

### Investigation Steps

1. **Retrieve Event Details**
   - Use \`ledger_get_event\` with eventId: ${args.eventId}
   - Review event type and zone
   - Examine payload and attached data

2. **Gather Context**
   - Query related events using \`ledger_query_events\`
   - Filter by zone: ${args.zone}
   - Look for preceding and subsequent events

3. **Analyze Root Cause**
   - Check for data inconsistencies
   - Verify against business rules
   - Identify contributing factors

4. **Determine Resolution**
   - Classify exception severity
   - Identify corrective actions
   - Escalate if needed

5. **Document Findings**
   - Record investigation results
   - Append investigation event to ledger
   - Notify stakeholders

### Exception Categories

- **Data Quality**: Missing or malformed fields
- **Business Logic**: Violates workflow rules
- **Authorization**: Unauthorized action attempted
- **System**: Backend or connectivity issues

### Tools Available

- \`ledger_get_event\` — retrieve exception event details
- \`ledger_query_events\` — find related events
- \`ledger_append_event\` — document investigation

### Escalation Contacts

- Customs Officer: customs@tradeops.local
- Zone Manager: zones@tradeops.local
- System Administrator: admin@tradeops.local
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
