# Implementation Plan: Part B - Digital Twin + IoT Integration

This plan details the implementation of IoT device registry, telemetry processing, webhook ingestion, SSE broadcasting, and React-based digital twin UI for the Trade OPS MCP server.

## Context

Part A (complete and locked):
- 27 MCP tools registered in `src/tools/index.ts`
- Immutable `LedgerEvent` schema in `src/types/events.ts` (DO NOT MODIFY)
- `BondedLedger` class with append/query/verifyHashChain in `src/backend/ledger.ts`
- `RateLimiter` class exists in `src/middleware/rateLimit.ts`
- RBAC tier map via `setToolTier()` in `src/auth/rbac.ts`
- 45 passing tests (tools.spec.ts, auth.spec.ts, ledger.spec.ts)

Part B deliverables (all additive):
- IoT device registry backed by ledger
- Telemetry normalizer with anomaly detection
- Webhook handler with HMAC validation, rate limiting, retry queue
- Zone graph state updater with deduplication
- SSE broadcaster for real-time telemetry
- 7 new MCP tools for IoT operations
- 4 new MCP resources for device/telemetry data
- HTTP endpoints: POST /webhooks/telemetry, GET /sse/:zoneId
- Digital Twin React component with enhanced zone visualization
- Comprehensive test suite

## Implementation Steps

- [ ] 1. Create IoT Device Registry (`src/iot/deviceRegistry.ts`)
      Device entity: `{ id, type (RFID|barcode|GPS|sensor|camera), zone, location, firmware, lastSeen, telemetrySchema }`. In-memory `Map<deviceId, Device>` backed by ledger using event types `iot.device.registered` and `iot.device.deregistered`. Zone constraint: must be one of `LEDGER_ZONES` from `src/types/events.ts`. DeviceId must be unique.
      
      **TypeScript signatures:**
      ```typescript
      export type DeviceType = 'RFID' | 'barcode' | 'GPS' | 'sensor' | 'camera';
      
      export interface Device {
        id: string;
        type: DeviceType;
        zone: LedgerZone; // from src/types/events.ts
        location?: string;
        firmware?: string;
        lastSeen: string; // ISO 8601
        telemetrySchema?: Record<string, unknown>;
      }
      
      export class DeviceRegistry {
        constructor(private ledger: BondedLedger);
        async register(device: Device): Promise<void>;
        async deregister(deviceId: string): Promise<void>;
        get(deviceId: string): Device | undefined;
        listByZone(zone: LedgerZone): Device[];
        all(): Device[];
        private hydrateFromLedger(): void; // reconstruct from ledger on init
      }
      ```
      
      Ledger event for registration: `{ zone: 'IOT', actor: 'system:iot-registry', eventType: 'iot.device.registered', deviceId, payload: device }`.
      
      Files: `src/iot/deviceRegistry.ts`
      
      Verify: `npm test -- deviceRegistry` (unit tests for CRUD, zone validation, uniqueness)

- [ ] 2. Create Telemetry Normalizer (`src/iot/telemetryNormalizer.ts`)
      Input: vendor-specific telemetry payload (arbitrary JSON). Output: normalized `{ sensorValue: number, unit: string, anomaly: boolean, raw: unknown }`. Anomaly flag set when value outside expected range for device type (configurable thresholds per device type).
      
      **TypeScript signatures:**
      ```typescript
      export interface NormalizedTelemetry {
        sensorValue: number;
        unit: string;
        anomaly: boolean;
        raw: unknown;
      }
      
      export interface TelemetryNormalizerOptions {
        thresholds?: Record<DeviceType, { min: number; max: number }>;
      }
      
      export class TelemetryNormalizer {
        constructor(opts?: TelemetryNormalizerOptions);
        normalize(deviceType: DeviceType, rawPayload: unknown): NormalizedTelemetry;
      }
      ```
      
      Default thresholds: RFID (0-100), barcode (0-100), GPS (-180 to 180 for coords), sensor (-50 to 150 for temp), camera (0-1 for motion).
      
      Files: `src/iot/telemetryNormalizer.ts`
      
      Verify: `npm test -- telemetryNormalizer` (unit tests for normalization, anomaly detection)

- [ ] 3. Create Webhook Handler (`src/iot/webhookHandler.ts`)
      Express middleware for POST /webhooks/telemetry. Validates: deviceId exists in registry, timestamp within 60s of server time, HMAC-SHA256 signature using secret from `process.env.WEBHOOK_SECRET`. Rate limiter: 1000 req/min per deviceId (use existing `RateLimiter` from `src/middleware/rateLimit.ts`). On success: normalize telemetry → append `LedgerEvent` with `{ zone: 'IOT', actor: 'device:<deviceId>', eventType: 'iot.telemetry.received', deviceId, payload: normalized }` → emit to SSE broadcaster. On failure: push to in-memory retry queue, retry 3x with exponential backoff (100ms, 200ms, 400ms).
      
      **TypeScript signatures:**
      ```typescript
      export interface WebhookPayload {
        deviceId: string;
        timestamp: string; // ISO 8601
        signature: string; // HMAC-SHA256 hex
        data: unknown;
      }
      
      export interface WebhookHandlerDeps {
        registry: DeviceRegistry;
        normalizer: TelemetryNormalizer;
        ledger: BondedLedger;
        broadcaster: SSEBroadcaster;
        secret: string;
      }
      
      export class WebhookHandler {
        private limiter: RateLimiter;
        private retryQueue: Array<{ payload: WebhookPayload; attempts: number }>;
        
        constructor(deps: WebhookHandlerDeps);
        handle(req: Request, res: Response): Promise<void>; // Express middleware
        private validateSignature(payload: WebhookPayload): boolean;
        private validateTimestamp(timestamp: string): boolean;
        private retryFailed(payload: WebhookPayload): Promise<void>;
      }
      ```
      
      Files: `src/iot/webhookHandler.ts`
      
      Verify: `npm test -- webhookHandler` (unit tests for validation, rate limit, retry logic)

- [ ] 4. Create Zone Graph Updater (`src/iot/zoneGraphUpdater.ts`)
      Listens for telemetry events from webhook handler. Extracts zone context: `{ currentZone, adjacentZones, crossZone }`. Updates zone state map: `Map<zoneId, { latestTelemetry, updatedAt }>`. Conflict resolution: last-write-wins by timestamp. Deduplication: ignore duplicate telemetry within 5s window (key: `deviceId+eventType+sensorValue`).
      
      **TypeScript signatures:**
      ```typescript
      export interface ZoneState {
        latestTelemetry: NormalizedTelemetry;
        updatedAt: string; // ISO 8601
      }
      
      export interface ZoneContext {
        currentZone: LedgerZone;
        adjacentZones: LedgerZone[];
        crossZone: boolean;
      }
      
      export class ZoneGraphUpdater {
        private zoneStates = new Map<string, ZoneState>();
        private dedupeCache = new Map<string, number>(); // key → timestamp
        
        onTelemetry(deviceId: string, zone: LedgerZone, telemetry: NormalizedTelemetry): void;
        getZoneState(zoneId: string): ZoneState | undefined;
        private extractZoneContext(deviceId: string, zone: LedgerZone): ZoneContext;
        private isDuplicate(deviceId: string, eventType: string, value: number): boolean;
      }
      ```
      
      Files: `src/iot/zoneGraphUpdater.ts`
      
      Verify: `npm test -- zoneGraphUpdater` (unit tests for deduplication, conflict resolution)

- [ ] 5. Create SSE Broadcaster (`src/iot/sseBroadcaster.ts`)
      EventEmitter-based broadcaster with per-zone channels. `subscribe(zoneId, res)` registers SSE client, sends heartbeat every 30s, removes stale after 30s inactivity. `broadcast(zoneId, event)` fans out to all subscribers for that zone. Broadcast schema: `{ type, deviceId, zoneId, telemetry, timestamp, anomaly }`.
      
      **TypeScript signatures:**
      ```typescript
      import { EventEmitter } from 'node:events';
      import type { Response } from 'express';
      
      export interface SSEEvent {
        type: string;
        deviceId: string;
        zoneId: string;
        telemetry: NormalizedTelemetry;
        timestamp: string;
        anomaly: boolean;
      }
      
      export class SSEBroadcaster extends EventEmitter {
        private subscribers = new Map<string, Set<Response>>(); // zoneId → clients
        private heartbeatIntervals = new Map<Response, NodeJS.Timeout>();
        
        subscribe(zoneId: string, res: Response): void;
        unsubscribe(zoneId: string, res: Response): void;
        broadcast(zoneId: string, event: SSEEvent): void;
        private sendHeartbeat(res: Response): void;
        private cleanupStale(): void;
      }
      ```
      
      Files: `src/iot/sseBroadcaster.ts`
      
      Verify: `npm test -- sseBroadcaster` (unit tests for subscription, broadcast, heartbeat)

- [ ] 6. Create IoT MCP Tools (`src/tools/iot.ts`)
      Implement 7 new MCP tools: `registerIoTDevice`, `deregisterIoTDevice`, `getDeviceStatus`, `listDevicesByZone`, `getDeviceTelemetry`, `anomalyReport`, `subscribeToZoneStream`. Follow the pattern in `src/tools/customs.ts`. Each tool returns `{ type: 'text', text: JSON.stringify(result) }[]`.
      
      **TypeScript signatures:**
      ```typescript
      export async function registerIoTDevice(args: any, ctx: RequestContext, deps: ToolDeps, approvalToken?: string): Promise<{ type: 'text'; text: string }[]>;
      export async function deregisterIoTDevice(args: any, ctx: RequestContext, deps: ToolDeps, approvalToken?: string): Promise<{ type: 'text'; text: string }[]>;
      export async function getDeviceStatus(args: any, ctx: RequestContext, deps: ToolDeps): Promise<{ type: 'text'; text: string }[]>;
      export async function listDevicesByZone(args: any, ctx: RequestContext, deps: ToolDeps): Promise<{ type: 'text'; text: string }[]>;
      export async function getDeviceTelemetry(args: any, ctx: RequestContext, deps: ToolDeps): Promise<{ type: 'text'; text: string }[]>;
      export async function anomalyReport(args: any, ctx: RequestContext, deps: ToolDeps): Promise<{ type: 'text'; text: string }[]>;
      export async function subscribeToZoneStream(args: any, ctx: RequestContext, deps: ToolDeps): Promise<{ type: 'text'; text: string }[]>;
      ```
      
      Add tool definitions to `src/tools/index.ts` `tools` array. Set RBAC tiers: `registerIoTDevice`/`deregisterIoTDevice` = 'write'; others = 'read'.
      
      Files: `src/tools/iot.ts`, `src/tools/index.ts` (modify)
      
      Verify: `npm test -- tools.spec.ts` (ensure tool count increases to 34, all IoT tools registered)

- [ ] 7. Create IoT MCP Resources (`src/resources/devices.ts`, `src/resources/telemetry.ts`)
      `devices.ts`: register `tradeops://iot/devices` (list all devices) and template `tradeops://iot/device/{deviceId}` (single device). Follow pattern in `src/resources/ledger.ts`.
      `telemetry.ts`: register template `tradeops://iot/telemetry/{zoneId}` (latest 20 telemetry events for zone) and `tradeops://iot/anomalies` (all anomaly events).
      
      **TypeScript signatures:**
      ```typescript
      // devices.ts
      export async function registerDeviceResources(server: McpServer, registry: DeviceRegistry): Promise<void>;
      
      // telemetry.ts
      export async function registerTelemetryResources(server: McpServer, ledger: BondedLedger): Promise<void>;
      ```
      
      Add both to `registerAllResources()` in `src/resources/index.ts`.
      
      Files: `src/resources/devices.ts`, `src/resources/telemetry.ts`, `src/resources/index.ts` (modify)
      
      Verify: `npm test -- resources.spec.ts` (ensure resource count increases, IoT resources accessible)

- [ ] 8. Add HTTP Endpoints to Transport Layer
      Research shows the MCP server runs on stdio or HTTP transport. The HTTP transport likely lives in a file handling the MCP protocol. Since no explicit `src/server.ts` or `src/transport/http.ts` was found, the HTTP server setup is likely in the main entry point or a transport module. Find the HTTP server setup (likely checking `bin` field in package.json: `./dist/index.js`). Add two new Express routes:
      - `POST /webhooks/telemetry` → mount `webhookHandler.handle` middleware
      - `GET /sse/:zoneId` → mount SSE broadcaster subscription
      
      These must mount BEFORE existing MCP routes to avoid conflicts.
      
      Files: Locate and modify HTTP transport setup (likely `src/transport/http.ts` or main entry point)
      
      Verify: `npm run build && node dist/index.js` (start server, curl POST /webhooks/telemetry with valid payload, curl GET /sse/IOT)

- [ ] 9. Create Digital Twin React Component (`components/DigitalTwin.tsx`)
      Enhanced React Flow component for zone visualization. Features: device overlay (icons per device type at zone nodes), telemetry drawer (side panel showing last 10 events), anomaly banner (dismissible top banner for critical anomalies), SSE subscription hook (`useZoneSSE`), device simulator button (sends mock POST to /webhooks/telemetry).
      
      Research shows existing project uses `@xyflow/react` (in root `package.json`). Look for existing zone graph components in `components/` to match the pattern. No React Flow components found yet, so this will be a new implementation.
      
      **TypeScript signatures:**
      ```typescript
      import { ReactFlow, Node, Edge } from '@xyflow/react';
      
      export interface DigitalTwinProps {
        initialZone?: LedgerZone;
        webhookEndpoint?: string; // default: http://localhost:8787/webhooks/telemetry
        sseEndpoint?: string; // default: http://localhost:8787/sse
      }
      
      function useZoneSSE(zoneId: string, endpoint: string): SSEEvent[];
      
      export function DigitalTwin(props: DigitalTwinProps): JSX.Element;
      ```
      
      Component structure:
      - React Flow canvas with zone nodes (FIZ, FCZ, CONTROL, CROSS, IOT)
      - Device icons overlaid on zone nodes (from `registry.listByZone()` via API)
      - Telemetry drawer (right side panel, collapsible, last 10 events)
      - Anomaly banner (top, dismissible, red background, shows latest anomaly)
      - Device simulator button (bottom right FAB, opens modal to POST mock telemetry)
      
      Files: `components/DigitalTwin.tsx`, `components/DigitalTwin.module.css` (optional)
      
      Verify: `npm run dev` (start Next.js dev server, navigate to /digital-twin, verify zone graph renders, SSE connects, simulator works)

- [ ] 10. Create Comprehensive Test Suite (`tests/iot.spec.ts`, `tests/integration.spec.ts`)
      Unit tests for all IoT modules: device CRUD, normalizer, HMAC validation, deduplication, rate limiting. Integration tests: register device → POST telemetry → assert ledger event → assert SSE broadcast. Error tests: malformed payload, expired timestamp, bad signature, device not found, rate limit exceeded.
      
      **Test structure:**
      ```typescript
      // tests/iot.spec.ts
      describe('DeviceRegistry', () => {
        it('registers a device and emits ledger event');
        it('deregisters a device');
        it('validates zone constraint');
        it('enforces deviceId uniqueness');
        it('lists devices by zone');
      });
      
      describe('TelemetryNormalizer', () => {
        it('normalizes RFID payload');
        it('detects anomaly for out-of-range value');
        it('preserves raw payload');
      });
      
      describe('WebhookHandler', () => {
        it('validates HMAC signature');
        it('rejects expired timestamp');
        it('enforces rate limit per deviceId');
        it('retries failed webhooks with exponential backoff');
        it('appends ledger event on success');
      });
      
      describe('ZoneGraphUpdater', () => {
        it('deduplicates telemetry within 5s window');
        it('resolves conflicts by last-write-wins');
      });
      
      describe('SSEBroadcaster', () => {
        it('subscribes client to zone channel');
        it('broadcasts event to all zone subscribers');
        it('sends heartbeat every 30s');
        it('cleans up stale connections');
      });
      
      // tests/integration.spec.ts
      describe('IoT Integration', () => {
        it('end-to-end: register → POST telemetry → ledger → SSE');
        it('error: device not found');
        it('error: bad signature');
        it('error: rate limit exceeded');
      });
      ```
      
      Ensure existing 45 Part A tests still pass (DO NOT MODIFY `tests/tools.spec.ts`, `tests/auth.spec.ts`, `tests/ledger.spec.ts`).
      
      Files: `tests/iot.spec.ts`, `tests/integration.spec.ts`
      
      Verify: `npm test` (all tests pass, Part A tests unchanged, new IoT tests pass)

- [ ] 11. Update TOOL_COUNT in `src/tools/index.ts`
      After adding 7 IoT tools, update the expected count from 27 to 34. Update the `tools.spec.ts` assertion to expect 34 tools.
      
      Files: `src/tools/index.ts` (modify TOOL_COUNT export), `tests/tools.spec.ts` (modify assertion)
      
      Verify: `npm test -- tools.spec.ts` (tool count test passes with 34)

- [ ] 12. Add Environment Variables and Documentation
      Add new environment variables to `.env.example`: `WEBHOOK_SECRET`, `IOT_WEBHOOK_PORT` (default: 8788), `IOT_RATE_LIMIT_DEFAULT` (default: 1000). Update README.md with IoT section describing the 7 new tools, 4 new resources, webhook/SSE endpoints, and digital twin UI.
      
      Files: `.env.example`, `README.md`
      
      Verify: Review `.env.example` for completeness, README for clarity

## Design Decisions

1. **In-memory device registry with ledger backing**: Devices are stored in a `Map` for fast lookup, but all mutations emit ledger events (`iot.device.registered`, `iot.device.deregistered`) so the registry can be reconstructed from the ledger on restart. This maintains the immutable audit trail.

2. **Telemetry normalizer with configurable thresholds**: Device types have different expected ranges (GPS coords vs. temperature). The normalizer accepts per-type thresholds in its constructor, with sensible defaults. Anomaly detection is a boolean flag in the normalized payload.

3. **Webhook validation with HMAC-SHA256**: Webhook payloads are signed with a shared secret. The handler recomputes the HMAC and rejects mismatches. Timestamp validation (60s window) prevents replay attacks.

4. **Rate limiting per deviceId**: The existing `RateLimiter` class supports arbitrary keys. The webhook handler uses `device:<deviceId>` as the key, allowing 1000 req/min per device (configurable via env var).

5. **Retry queue with exponential backoff**: Failed webhooks are pushed to an in-memory queue and retried 3 times with 100ms, 200ms, 400ms delays. This handles transient failures (e.g., ledger append timeout) without losing telemetry.

6. **Zone graph updater with deduplication**: IoT devices may send duplicate telemetry due to network retries. The updater maintains a 5s deduplication window keyed by `deviceId+eventType+sensorValue`. Conflicts (two devices updating the same zone) are resolved by last-write-wins based on timestamp.

7. **SSE broadcaster with per-zone channels**: Each zone gets its own EventEmitter channel. Clients subscribe to a zone and receive real-time telemetry events. Heartbeats every 30s keep connections alive; stale connections (no activity for 30s) are cleaned up.

8. **MCP tools for IoT**: 7 new tools follow the existing pattern: `registerIoTDevice`/`deregisterIoTDevice` require approval tokens (RBAC tier 'write'), while read tools (`getDeviceStatus`, `listDevicesByZone`, `getDeviceTelemetry`, `anomalyReport`, `subscribeToZoneStream`) are tier 'read'.

9. **MCP resources for IoT**: 4 new resources expose device and telemetry data via URI scheme `tradeops://iot/...`. This allows MCP clients to read device state and telemetry history without invoking tools.

10. **Digital Twin UI with React Flow**: The UI visualizes zones as nodes, devices as overlays, and telemetry as a live stream. The SSE subscription hook connects to `/sse/:zoneId` and updates the UI in real-time. The device simulator button allows testing without physical devices.

## Verification Strategy

Each step includes a verification command that runs the relevant tests or manual checks. The final integration test ensures all pieces work together:

1. Build the project: `npm run build`
2. Run all tests: `npm test` (expect 45 Part A tests + new IoT tests to pass)
3. Start the server: `MCP_TRANSPORT=http node dist/index.js`
4. Register a device via MCP tool: `curl -X POST http://localhost:8787/mcp -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"registerIoTDevice","arguments":{"device":{"id":"rfid-001","type":"RFID","zone":"IOT","lastSeen":"2024-01-01T00:00:00Z"}}},"id":1}'`
5. Send telemetry via webhook: `curl -X POST http://localhost:8787/webhooks/telemetry -H 'Content-Type: application/json' -d '{"deviceId":"rfid-001","timestamp":"2024-01-01T00:00:01Z","signature":"<HMAC>","data":{"tagId":"TAG-123","rssi":-50}}'`
6. Query telemetry via MCP tool: `curl -X POST http://localhost:8787/mcp -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"getDeviceTelemetry","arguments":{"deviceId":"rfid-001","limit":10}},"id":2}'`
7. Subscribe to SSE: `curl -N http://localhost:8787/sse/IOT` (expect heartbeats and telemetry events)
8. Open Digital Twin UI: `npm run dev` → navigate to `/digital-twin` → verify zone graph, device overlay, SSE connection, simulator

## Dependencies

No new npm dependencies required. All functionality uses existing packages:
- `express` (HTTP endpoints)
- `node:crypto` (HMAC validation)
- `node:events` (SSE broadcaster EventEmitter)
- `@modelcontextprotocol/sdk` (MCP tools/resources)
- `zod` (payload validation)
- `pino` (logging)
- `@xyflow/react` (already in root package.json for React Flow)

## File Summary

**New files (14):**
- `src/iot/deviceRegistry.ts`
- `src/iot/telemetryNormalizer.ts`
- `src/iot/webhookHandler.ts`
- `src/iot/zoneGraphUpdater.ts`
- `src/iot/sseBroadcaster.ts`
- `src/tools/iot.ts`
- `src/resources/devices.ts`
- `src/resources/telemetry.ts`
- `tests/iot.spec.ts`
- `tests/integration.spec.ts`
- `components/DigitalTwin.tsx`
- `components/DigitalTwin.module.css` (optional)
- `.env.example` (modify)
- `README.md` (modify)

**Modified files (3):**
- `src/tools/index.ts` (add IoT tools, update TOOL_COUNT)
- `src/resources/index.ts` (add IoT resources)
- HTTP transport setup (add POST /webhooks/telemetry, GET /sse/:zoneId)

**Unchanged files (locked from Part A):**
- `src/types/events.ts` (NEVER MODIFY)
- `tests/tools.spec.ts` (update assertion only)
- `tests/auth.spec.ts` (no changes)
- `tests/ledger.spec.ts` (no changes)

## Notes

- The LedgerEvent schema is immutable. All IoT events use existing fields: `zone='IOT'`, `actor='device:<deviceId>'`, `eventType='iot.telemetry.received'`, `deviceId=<deviceId>`, `payload=<normalized>`.
- The HTTP transport layer needs to be located and modified to add the webhook and SSE endpoints. The main entry point is `dist/index.js` (per package.json bin field).
- The Digital Twin UI is a standalone React component that can be integrated into the Next.js app at any route (suggested: `/digital-twin`).
- All new code must pass TypeScript strict checks (`npm run typecheck`) and tests (`npm test`).
