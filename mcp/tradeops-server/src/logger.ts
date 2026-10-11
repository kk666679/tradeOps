/**
 * Structured logging via pino with `request_id` correlation.
 *
 * A single root logger is exported. Child loggers carry a `request_id` that
 * flows across an MCP tool call or an IoT webhook request, so a single
 * end-to-end trace can be reconstructed from the logs of either surface.
 */

import { pino, type Logger } from 'pino';
import { config } from './config.js';

const level = config.logging.level;

export const logger: Logger =
  config.logging.pretty && config.transport !== 'stdio'
    ? pino({
        level,
        base: { service: 'tradeops-mcp' },
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard' },
        },
      })
    : // stdio transports the MCP protocol over stdout — logs MUST go to
      // stderr or they corrupt the protocol stream.
      pino({
        level,
        base: { service: 'tradeops-mcp' },
      });

/** Generate a short, collision-resistant correlation id. */
export function newRequestId(): string {
  return `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Create a child logger bound to a `request_id` and any extra fields. */
export function withRequest(
  requestId: string,
  extra?: Record<string, unknown>,
): Logger {
  return logger.child({ request_id: requestId, ...extra });
}
