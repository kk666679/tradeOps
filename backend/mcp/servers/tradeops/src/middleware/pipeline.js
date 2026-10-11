export async function runPipeline(ctx, middlewares) {
    for (const m of middlewares)
        await m(ctx);
}
//# sourceMappingURL=pipeline.js.map