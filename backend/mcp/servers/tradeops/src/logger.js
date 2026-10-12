import { config } from "./config.js";
const LEVEL_RANK = { debug: 10, info: 20, warn: 30, error: 40 };
function currentLevel() {
    const raw = (process.env.MCP_LOG_LEVEL ?? "info").toLowerCase();
    return (raw in LEVEL_RANK ? raw : "info");
}
const REDACT = new Set([
    "password", "token", "secret", "authorization", "apiKey", "apikey",
    "jwt", "accessToken", "refreshToken", "cookie", "set-cookie",
]);
function redact(value) {
    if (value === null || typeof value !== "object")
        return value;
    if (Array.isArray(value))
        return value.map(redact);
    const out = {};
    for (const [k, v] of Object.entries(value)) {
        out[k] = REDACT.has(k.toLowerCase()) ? "[REDACTED]" : redact(v);
    }
    return out;
}
export const logger = {
    log(level, message, fields = {}) {
        if (LEVEL_RANK[level] < LEVEL_RANK[currentLevel()])
            return;
        const line = JSON.stringify({
            ts: new Date().toISOString(),
            level,
            service: config.serverName,
            version: config.serverVersion,
            message,
            ...redact(fields),
        });
        process.stderr.write(line + "\n");
    },
    debug: (m, f) => logger.log("debug", m, f),
    info: (m, f) => logger.log("info", m, f),
    warn: (m, f) => logger.log("warn", m, f),
    error: (m, f) => logger.log("error", m, f),
};
//# sourceMappingURL=logger.js.map