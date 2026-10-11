const channels = new Map();
export function broadcast(event) {
    for (const ch of channels.values()) {
        if (!ch.kinds.includes(event.kind))
            continue;
        if (event.kind === "resourceSubscriptions" && event.uri && !ch.resourceUris.includes(event.uri))
            continue;
        ch.res.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/event", params: event }) + "\n");
    }
}
export function handleSubscriptionsListen(req, res) {
    const body = req.body;
    const id = crypto.randomUUID();
    res.writeHead(200, {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-store",
        "Transfer-Encoding": "chunked",
    });
    res.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/subscribed", params: { channelId: id } }) + "\n");
    channels.set(id, { id, kinds: body.subscriptions, resourceUris: body.resourceUris ?? [], res });
    req.on("close", () => channels.delete(id));
}
//# sourceMappingURL=subscriptions.js.map