import { assertScope } from "../auth/rbac.js";
export function authorize(actor, requiredScope) {
    assertScope(actor, requiredScope);
}
//# sourceMappingURL=authorize.js.map