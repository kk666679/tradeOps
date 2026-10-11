export function sanitizeStrings(value) {
    if (typeof value === "string")
        return stripControl(value);
    if (Array.isArray(value))
        return value.map(sanitizeStrings);
    if (value && typeof value === "object") {
        const out = {};
        for (const [k, v] of Object.entries(value)) {
            out[stripControl(k)] = sanitizeStrings(v);
        }
        return out;
    }
    return value;
}
function stripControl(s) {
    return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "");
}
//# sourceMappingURL=sanitize.js.map