/**
 * Agent and workflow resources.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendClient } from '../backend/client.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'resources:agents' });

export async function registerAgentResources(server: McpServer, backend: BackendClient): Promise<void> {
  // Agent registry resource
  server.resource(
    'agent-registry',
    'tradeops://agents/registry',
    async () => {
      try {
        const res = await backend.getAgentRegistry();
        return {
          contents: [
            {
              uri: 'tradeops://agents/registry',
              mimeType: 'application/json',
              text: JSON.stringify(res.ok ? res.data : { error: res.error }, null, 2),
            },
          ],
        };
      } catch (err) {
        log.error({ err: String(err) }, 'agent registry lookup failed');
        return {
          contents: [
            {
              uri: 'tradeops://agents/registry',
              mimeType: 'application/json',
              text: JSON.stringify({ error: String(err) }, null, 2),
            },
          ],
        };
      }
    },
  );
}
