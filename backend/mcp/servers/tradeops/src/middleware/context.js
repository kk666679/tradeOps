import { extractRequestMeta } from "../transport/headers";
export function enrichContext(rawParams) {
    return extractRequestMeta(rawParams?._meta);
}
//# sourceMappingURL=context.js.map