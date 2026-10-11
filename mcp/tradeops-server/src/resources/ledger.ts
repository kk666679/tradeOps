/**
 * Ledger event resources.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BondedLedger } from '../backend/ledger.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'resources:ledger' });

export async function registerLedgerResources(server: McpServer, ledger: BondedLedger): Promise<void> {
  // Ledger event lookup - static resource
  server.resource(
    'ledger-events',
    'tradeops://ledger/events',
    async () => {
      try {
        const events = ledger.query({ limit: 10 });
        return {
          contents: [
            {
              uri: 'tradeops://ledger/events',
              mimeType: 'application/json',
              text: JSON.stringify({ events, count: events.length }, null, 2),
            },
          ],
        };
      } catch (err) {
        log.error({ err: String(err) }, 'ledger events lookup failed');
        return {
          contents: [
            {
              uri: 'tradeops://ledger/events',
              mimeType: 'application/json',
              text: JSON.stringify({ error: String(err) }, null, 2),
            },
          ],
        };
      }
    },
  );

  // Ledger event by ID - template simulation
  // Note: MCP resource templates not fully supported; this simulates template behavior
  server.resource(
    'ledger-event-by-id',
    'tradeops://ledger/events/sample',
    async () => {
      try {
        const events = ledger.query({ limit: 1 });
        const event = events[0] || { eventId: 'sample', eventType: 'sample.event' };
        const uri = `tradeops://ledger/events/${event.eventId}`;
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(event, null, 2),
            },
          ],
        };
      } catch (err) {
        log.error({ err: String(err) }, 'ledger event lookup failed');
        return {
          contents: [
            {
              uri: 'tradeops://ledger/events/sample',
              mimeType: 'application/json',
              text: JSON.stringify({ error: String(err) }, null, 2),
            },
          ],
        };
      }
    },
  );

  // Device telemetry resource - stub for IoT integration
  server.resource(
    'device-telemetry',
    'tradeops://device/sample/telemetry',
    async () => {
      return {
        contents: [
          {
            uri: 'tradeops://device/sample/telemetry',
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                deviceId: 'sample-device',
                telemetry: [],
                note: 'Device telemetry resources managed by IoT webhook integration (Part B)',
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}
