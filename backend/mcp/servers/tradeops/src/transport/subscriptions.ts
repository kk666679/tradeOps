// backend/mcp/servers/tradeops/src/transport/subscriptions.ts
// `subscriptions/listen` channel registry.

import type { Request, Response } from "express";

export type SubscriptionKind =
  | "toolsListChanged"
  | "resourcesListChanged"
  | "promptsListChanged"
  | "resourceSubscriptions";

export interface SubscriptionEvent {
  kind: SubscriptionKind;
  uri?: string;
  payload?: unknown;
}

interface Channel {
  id: string;
  kinds: SubscriptionKind[];
  resourceUris: string[];
  res: Response;
}

const channels = new Map<string, Channel>();

export function broadcast(event: SubscriptionEvent): void {
  for (const ch of channels.values()) {
    if (!ch.kinds.includes(event.kind)) continue;
    if (event.kind === "resourceSubscriptions" && event.uri && !ch.resourceUris.includes(event.uri)) continue;
    ch.res.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/event", params: event }) + "\n");
  }
}

export function handleSubscriptionsListen(req: Request, res: Response): void {
  const body = req.body as { subscriptions: SubscriptionKind[]; resourceUris?: string[] };
  const id = crypto.randomUUID();

  res.writeHead(200, {
    "Content-Type": "application/x-ndjson",
    "Cache-Control": "no-store",
    "Transfer-Encoding": "chunked",
  });
  res.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/subscribed", params: { channelId: id } }) + "\n");

  channels.set(id, { id, kinds: body.subscriptions, resourceUris: body.resourceUris ?? [], res });
  req.on("close", () => channels.delete(id));
}
