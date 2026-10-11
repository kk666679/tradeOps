// backend/mcp/servers/tradeops/src/middleware/pipeline.ts
// Composable request pipeline. Each middleware is a function that either
// throws (rejects the call) or returns void (proceeds).

export type Middleware<T> = (ctx: T) => Promise<void> | void;

export async function runPipeline<T>(ctx: T, middlewares: Array<Middleware<T>>): Promise<void> {
  for (const m of middlewares) await m(ctx);
}
