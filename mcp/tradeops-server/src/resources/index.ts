/**
 * Resource registration aggregator — registers all 8 resources with the MCP server.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BondedLedger } from '../backend/ledger.js';
import type { BackendClient } from '../backend/client.js';
import { registerInventoryResources } from './inventory.js';
import { registerLedgerResources } from './ledger.js';
import { registerHsResources } from './hs.js';
import { registerAgentResources } from './agents.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'resources' });

export async function registerAllResources(
  server: McpServer,
  deps: { ledger: BondedLedger; backend: BackendClient },
): Promise<void> {
  await registerInventoryResources(server, deps.backend);
  await registerLedgerResources(server, deps.ledger);
  await registerHsResources(server);
  await registerAgentResources(server, deps.backend);

  log.info('registered all resources');
}
