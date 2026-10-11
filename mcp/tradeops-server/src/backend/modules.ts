/**
 * Module adapters over the Trade OPS backend.
 *
 * Each adapter owns one of the six-module substrate areas (WMS·FIZ, WMS·FCZ,
 * Order Management, Trade OPS, Digital Twin, Custom Agents). Adapters are thin
 * typed wrappers over `BackendClient.call`, so the tool handlers stay free of
 * HTTP plumbing and can be unit-tested against a fake client.
 */

import type { BackendClient, BackendResult } from './client.js';

export class TradeOpsModules {
  constructor(private readonly client: BackendClient) {}

  // ---- Trade OPS -----------------------------------------------------------
  customs<T>(method: string, path: string, body?: unknown): Promise<BackendResult<T>> {
    return this.client.call<T>(method, `/tradeops/customs${path}`, body);
  }
  declarations<T>(body?: unknown): Promise<BackendResult<T>> {
    return this.client.call<T>('POST', '/tradeops/declarations', body);
  }

  // ---- WMS · FIZ -----------------------------------------------------------
  wmsFiz<T>(method: string, path: string, body?: unknown): Promise<BackendResult<T>> {
    return this.client.call<T>(method, `/wms/fiz${path}`, body);
  }

  // ---- WMS · FCZ -----------------------------------------------------------
  wmsFcz<T>(method: string, path: string, body?: unknown): Promise<BackendResult<T>> {
    return this.client.call<T>(method, `/wms/fcz${path}`, body);
  }

  // ---- Order Management ----------------------------------------------------
  orderMgmt<T>(method: string, path: string, body?: unknown): Promise<BackendResult<T>> {
    return this.client.call<T>(method, `/orders${path}`, body);
  }

  // ---- Digital Twin --------------------------------------------------------
  twin<T>(method: string, path: string, body?: unknown): Promise<BackendResult<T>> {
    return this.client.call<T>(method, `/digital-twin${path}`, body);
  }

  // ---- Custom Agents -------------------------------------------------------
  agents<T>(method: string, path: string, body?: unknown): Promise<BackendResult<T>> {
    return this.client.call<T>(method, `/agents${path}`, body);
  }

  // ---- IoT -----------------------------------------------------------------
  iot<T>(method: string, path: string, body?: unknown): Promise<BackendResult<T>> {
    return this.client.call<T>(method, `/iot${path}`, body);
  }
}
