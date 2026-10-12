import type { RequestMeta, ActorContext, TenantContext } from "../types/index.js";
export interface RequestContext {
    meta: RequestMeta;
    tenant?: TenantContext;
    actor?: ActorContext;
}
export declare function buildRequestContext(meta: RequestMeta): RequestContext;
