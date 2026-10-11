/**
 * Typed client to the Trade OPS backend.
 *
 * The standalone MCP server must be deployable on its own, so this client is
 * intentionally thin: it speaks plain HTTP/JSON to `TRADEOPS_BACKEND_URL` and
 * degrades gracefully (returns typed errors) when the backend is unreachable.
 * Every method returns a discriminated result rather than throwing, so the
 * middleware layer can surface a structured MCP error block.
 */

import type { LedgerEvent } from '../types/events.js';
import { logger } from '../logger.js';

export type BackendResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

export interface BackendClientOptions {
  baseUrl: string;
  apiKey: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export class BackendClient {
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly log = logger.child({ component: 'backend-client' });

  constructor(private readonly opts: BackendClientOptions) {
    this.timeoutMs = opts.timeoutMs ?? 10_000;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  get baseUrl(): string {
    return this.opts.baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<BackendResult<T>> {
    const url = `${this.opts.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await this.fetchImpl(url, {
        method,
        headers: {
          'content-type': 'application/json',
          ...(this.opts.apiKey ? { authorization: `Bearer ${this.opts.apiKey}` } : {}),
        },
        body: body != null ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      const text = await res.text();
      const data = text ? (JSON.parse(text) as T) : (undefined as T);
      if (!res.ok) {
        return { ok: false, status: res.status, error: text.slice(0, 500) };
      }
      return { ok: true, data };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.log.warn({ url, method, err: msg }, 'backend request failed');
      return { ok: false, status: 0, error: msg };
    } finally {
      clearTimeout(timer);
    }
  }

  /** Readiness probe used by `/ready`. */
  async health(): Promise<BackendResult<{ status: string }>> {
    return this.request<{ status: string }>('GET', '/health');
  }

  /** Fetch the backend's ledger schema version for the drift guard. */
  async ledgerSchemaVersion(): Promise<BackendResult<{ schemaVersion: string }>> {
    return this.request<{ schemaVersion: string }>('GET', '/ledger/schema-version');
  }

  /** Fan out a sealed ledger event to the backend. */
  async appendLedgerEvent(event: LedgerEvent): Promise<BackendResult<{ eventId: string }>> {
    return this.request<{ eventId: string }>('POST', '/ledger/events', event);
  }

  /** Generic passthrough for tool handlers that proxy to backend endpoints. */
  async call<T>(method: string, path: string, body?: unknown): Promise<BackendResult<T>> {
    return this.request<T>(method, path, body);
  }

  /** Customs: get declaration status. */
  async getDeclarationStatus(
    declId: string,
  ): Promise<BackendResult<{ declarationId: string; status: string; entries: Array<{ hs: string; qty: number }> }>> {
    return this.request(
      'GET',
      `/customs/declarations/${declId}`,
    );
  }

  /** Customs: list declarations. */
  async queryDeclarationList(filters: {
    status?: string;
    limit?: number;
  }): Promise<BackendResult<{ declarations: Array<{ id: string; status: string; date: string }> }>> {
    const qs = new URLSearchParams();
    if (filters.status) qs.set('status', filters.status);
    if (filters.limit) qs.set('limit', String(filters.limit));
    return this.request(
      'GET',
      `/customs/declarations?${qs}`,
    );
  }

  /** Customs: create draft declaration. */
  async createDraftDeclaration(payload: {
    refs: string[];
    hsCode: string;
    qty: number;
    uom: string;
    value: number;
  }): Promise<BackendResult<{ declarationId: string; poId?: string }>> {
    return this.request(
      'POST',
      '/customs/declarations/draft',
      payload,
    );
  }

  /** Customs: validate entry. */
  async validateEntry(declId: string): Promise<BackendResult<{ valid: boolean; errors: string[] }>> {
    return this.request(
      'POST',
      `/customs/declarations/${declId}/validate`,
      {},
    );
  }

  /** HS: classify product. */
  async classifyProduct(payload: {
    description: string;
    countryOfOrigin?: string;
  }): Promise<BackendResult<{ hsCode: string; confidence: number }>> {
    return this.request(
      'POST',
      '/hs/classify',
      payload,
    );
  }

  /** HS: validate code. */
  async validateHsCode(hsCode: string): Promise<BackendResult<{ valid: boolean; description?: string }>> {
    return this.request(
      'GET',
      `/hs/codes/${hsCode}/validate`,
    );
  }

  /** Tariff: query by HS code. */
  async queryTariff(payload: {
    hsCode: string;
    countryOfOrigin?: string;
  }): Promise<BackendResult<{ rate: number; dutyCurrency: string; effectiveDate: string }>> {
    return this.request(
      'POST',
      '/tariff/query',
      payload,
    );
  }

  /** FIZ: get inventory snapshot. */
  async getFizInventory(): Promise<BackendResult<{ items: Array<{ sku: string; qty: number; location: string }> }>> {
    return this.request(
      'GET',
      '/zones/fiz/inventory',
    );
  }

  /** FCZ: get inventory snapshot. */
  async getFczInventory(): Promise<BackendResult<{ items: Array<{ sku: string; qty: number; zone: string }> }>> {
    return this.request(
      'GET',
      '/zones/fcz/inventory',
    );
  }

  /** HS: get rulings for a code. */
  async getHsRulings(hsCode: string): Promise<BackendResult<{ rulings: Array<{ id: string; ruling: string }> }>> {
    return this.request(
      'GET',
      `/hs/codes/${hsCode}/rulings`,
    );
  }

  /** Agents: get registry. */
  async getAgentRegistry(): Promise<BackendResult<{ agents: Array<{ id: string; role: string; active: boolean }> }>> {
    return this.request(
      'GET',
      '/agents/registry',
    );
  }
}
