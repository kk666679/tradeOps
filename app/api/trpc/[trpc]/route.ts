/**
 * tRPC HTTP handler — shim.
 *
 * Returns 501 for all requests until a real tRPC setup exists.
 * This prevents 404s when the client shim is upgraded to make calls.
 *
 * Upgrade path:
 *   npm i @trpc/server
 *   Replace body with:
 *     import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
 *     import { appRouter } from "@/server/api/root";
 *     import { createContext } from "@/server/api/trpc";
 *     const handler = (req: Request) =>
 *       fetchRequestHandler({
 *         endpoint: "/api/trpc",
 *         req,
 *         router: appRouter,
 *         createContext,
 *       });
 *     export { handler as GET, handler as POST };
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      error: {
        message:
          "tRPC server not yet configured. See app/api/trpc/[trpc]/route.ts for the upgrade path.",
        code: "NOT_IMPLEMENTED",
      },
    },
    { status: 501 }
  );
}

export async function POST() {
  return GET();
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
