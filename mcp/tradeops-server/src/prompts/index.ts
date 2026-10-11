/**
 * Prompt registration aggregator — registers all 3 prompts with the MCP server.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerPreClearancePrompt } from './preClearance.js';
import { registerExceptionInvestigationPrompt } from './exceptionInvestigation.js';
import { registerEntrepotReconciliationPrompt } from './entrepotReconciliation.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'prompts' });

export function registerAllPrompts(server: McpServer): void {
  registerPreClearancePrompt(server);
  registerExceptionInvestigationPrompt(server);
  registerEntrepotReconciliationPrompt(server);

  log.info('registered all prompts');
}
