import { extractRequestMeta } from "../transport/headers.js";
export function enrichContext(rawParams) {
    return extractRequestMeta(rawParams?._meta);
}
//# sourceMappingURL=context.js.map