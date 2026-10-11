/**
 * FIZ/FCZ inventory resources.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendClient } from '../backend/client.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'resources:inventory' });

export async function registerInventoryResources(server: McpServer, backend: BackendClient): Promise<void> {
  // FIZ inventory resource
  server.resource(
    'fiz-inventory',
    'tradeops://zone/fiz/inventory',
    async () => {
      try {
        const res = await backend.getFizInventory();
        return {
          contents: [
            {
              uri: 'tradeops://zone/fiz/inventory',
              mimeType: 'application/json',
              text: JSON.stringify(res.ok ? res.data : { error: res.error }, null, 2),
            },
          ],
        };
      } catch (err) {
        log.error({ err: String(err) }, 'getFizInventory failed');
        return {
          contents: [
            {
              uri: 'tradeops://zone/fiz/inventory',
              mimeType: 'application/json',
              text: JSON.stringify({ error: String(err) }, null, 2),
            },
          ],
        };
      }
    },
  );

  // FCZ inventory resource
  server.resource(
    'fcz-inventory',
    'tradeops://zone/fcz/inventory',
    async () => {
      try {
        const res = await backend.getFczInventory();
        return {
          contents: [
            {
              uri: 'tradeops://zone/fcz/inventory',
              mimeType: 'application/json',
              text: JSON.stringify(res.ok ? res.data : { error: res.error }, null, 2),
            },
          ],
        };
      } catch (err) {
        log.error({ err: String(err) }, 'getFczInventory failed');
        return {
          contents: [
            {
              uri: 'tradeops://zone/fcz/inventory',
              mimeType: 'application/json',
              text: JSON.stringify({ error: String(err) }, null, 2),
            },
          ],
        };
      }
    },
  );

  // Declaration status - template simulation
  // Note: MCP resource templates not fully supported; this simulates template behavior
  server.resource(
    'declaration-status',
    'tradeops://declaration/sample/status',
    async () => {
      try {
        const res = await backend.getDeclarationStatus('sample-decl-id');
        const uri = 'tradeops://declaration/sample-decl-id/status';
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(res, null, 2),
            },
          ],
        };
      } catch (err) {
        log.error({ err: String(err) }, 'getDeclarationStatus failed');
        return {
          contents: [
            {
              uri: 'tradeops://declaration/sample/status',
              mimeType: 'application/json',
              text: JSON.stringify({ error: String(err) }, null, 2),
            },
          ],
        };
      }
    },
  );
}
