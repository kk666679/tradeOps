import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { config } from "../config";
import { extractRequestMeta } from "./headers";
export function installHttpTransport(app, server) {
    app.post("/mcp", async (req, res) => {
        const body = req.body;
        const meta = extractRequestMeta(body?.params?._meta);
        if (!config.supportedProtocolVersions.includes(meta.protocolVersion)) {
            res.status(400).json({
                jsonrpc: "2.0",
                error: { code: -32600, message: `Unsupported protocolVersion=${meta.protocolVersion}` },
                id: null,
            });
            return;
        }
        const transport = new StreamableHTTPServerTransport({ enableJsonResponse: true });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    app.get("/health", (_req, res) => res.status(200).json({ ok: true }));
}
//# sourceMappingURL=http.js.map