import { assertScope } from "../auth/rbac";
export function authorize(actor, requiredScope) {
    assertScope(actor, requiredScope);
}
//# sourceMappingURL=authorize.js.map