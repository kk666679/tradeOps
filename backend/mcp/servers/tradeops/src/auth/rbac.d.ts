import type { ActorContext } from "../types";
export declare const ROLE_SCOPES: Record<ActorContext["role"], string[]>;
export declare function hasScope(actor: ActorContext, required: string): boolean;
export declare function assertScope(actor: ActorContext, required: string): void;
