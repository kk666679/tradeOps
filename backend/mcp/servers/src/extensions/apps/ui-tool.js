"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiMeta = uiMeta;
exports.asUiResult = asUiResult;
function uiMeta(resourceUri, csp) {
    return { ui: { resourceUri, csp } };
}
function asUiResult(data, meta, initialState) {
    return { data, initialState, _meta: meta };
}
//# sourceMappingURL=ui-tool.js.map