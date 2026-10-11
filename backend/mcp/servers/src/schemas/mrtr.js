"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputRequired = inputRequired;
exports.complete = complete;
exports.isInputRequired = isInputRequired;
function inputRequired(requests, message, mrtrToken) {
    return { resultType: "input_required", inputRequests: requests, message, mrtrToken };
}
function complete(data) {
    return { resultType: "complete", data };
}
function isInputRequired(r) {
    return typeof r === "object" && r !== null && r.resultType === "input_required";
}
//# sourceMappingURL=mrtr.js.map