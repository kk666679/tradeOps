// shared/transport/subscriptions-listen.ts
// `subscriptions/listen` — single long-lived POST-response stream.

import type { Request, Response } from "express";

export type SubscriptionKind =
  | "toolsListChanged"
  | "resourcesListChanged"
  | "promptsListChanged"
  | "resourceSubscriptions";

export interface SubscribeRequest {
  subscriptions: SubscriptionKind[];
  resourceUris?: string[];
  expiresInSeconds?: number;
}

export interface SubscriptionChannel {
  id: string;
  kinds: SubscriptionKind[];
  resourceUris: string[];
  emit(event: { kind: SubscriptionKind; uri?: string; payload?: unknown }): void;
  close(): void;
}

const channels = new Map<string, SubscriptionChannel>();

export function createSubscriptionChannel(
  id: string,
  req: SubscribeRequest,
): SubscriptionChannel {
  const listeners = new Set<(e: { kind: SubscriptionKind; uri?: string; payload?: unknown }) => void>();
  const channel: SubscriptionChannel = {
    id,
    kinds: req.subscriptions,
    resourceUris: req.resourceUris ?? [],
    emit(event) {
      if (!channel.kinds.includes(event.kind)) return;
      if (event.kind === "resourceSubscriptions" && event.uri && !channel.resourceUris.includes(event.uri)) return;
      for (const l of listeners) l(event);
    },
    close() {
      listeners.clear();
      channels.delete(id);
    },
  };
  channels.set(id, channel);
  return channel;
}

export function handleSubscriptionsListen(req: Request, res: Response): void {
  const body = req.body as SubscribeRequest;
  const channelId = crypto.randomUUID();
  const channel = createSubscriptionChannel(channelId, body);

  res.writeHead(200, {
    "Content-Type": "application/x-ndjson",
    "Cache-Control": "no-store",
    "Transfer-Encoding": "chunked",
  });

  res.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/subscribed", params: { channelId } }) + "\n");

  const originalEmit = channel.emit.bind(channel);
  (channel as { emit: typeof channel.emit }).emit = (event) => {
    originalEmit(event);
    res.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/event", params: event }) + "\n");
  };

  req.on("close", () => channel.close());
}
