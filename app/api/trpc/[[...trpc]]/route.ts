/**
 * /api/trpc — thin proxy to the Nest backend, which owns the tRPC router.
 *
 * The backend is the single source of truth for the API surface
 * (`backend/src/trpc/trpc.router.ts`); this route only forwards requests so
 * the browser can stay same-origin (cookies, auth headers, no CORS).
 */

const backendTrpcUrl = () => `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/trpc`;

const FORWARDED_HEADERS = ['authorization', 'cookie', 'content-type', 'accept', 'accept-language', 'x-requested-with'];

async function proxy(req: Request) {
  const url = new URL(req.url);
  const suffix = url.pathname.replace(/^\/api\/trpc/, '');
  const target = `${backendTrpcUrl()}${suffix}${url.search}`;

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }

  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer();

  try {
    const res = await fetch(target, { method: req.method, headers, body, redirect: 'manual' });
    const resHeaders = new Headers(res.headers);
    resHeaders.delete('content-encoding');
    resHeaders.delete('content-length');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: resHeaders });
  } catch (err) {
    return Response.json({ error: 'tRPC backend unreachable', detail: String(err) }, { status: 502 });
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };