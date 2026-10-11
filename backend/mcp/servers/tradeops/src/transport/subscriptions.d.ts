import type { Request, Response } from "express";
export type SubscriptionKind = "toolsListChanged" | "resourcesListChanged" | "promptsListChanged" | "resourceSubscriptions";
export interface SubscriptionEvent {
    kind: SubscriptionKind;
    uri?: string;
    payload?: unknown;
}
export declare function broadcast(event: SubscriptionEvent): void;
export declare function handleSubscriptionsListen(req: Request, res: Response): void;
