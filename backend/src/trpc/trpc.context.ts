import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

export interface TrpcCtx {
  db: PrismaService;
  user: { id: string; email: string; role: string; tenantId: string } | null;
  tenantId: string | null;
  req?: Request;
}

type CtxRequest = { headers?: Record<string, string | string[] | undefined> } | Request;

@Injectable()
export class TrpcContextFactory {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  /**
   * Builds the tRPC context from the incoming request.
   * Populates `user` / `tenantId` from a Bearer JWT so procedures can rely on
   * `requireAuth` / `requireTenant` / `requireRole` middleware.
   */
  async create(req?: CtxRequest): Promise<TrpcCtx> {
    const headers: any = (req as any)?.headers;
    console.warn('[trpc-context] req?', !!req, 'authHeader=', JSON.stringify(headers?.authorization ?? null));
    const raw: string | undefined =
      (typeof headers?.get === 'function' ? headers.get('authorization') : headers?.authorization) ??
      (typeof headers?.get === 'function' ? headers.get('Authorization') : headers?.Authorization);

    if (typeof raw === 'string' && raw.startsWith('Bearer ')) {
      try {
        const payload: any = await this.jwt.verifyAsync(raw.slice(7));
        const id = payload?.sub ?? payload?.userId;
        if (id) {
          const user = {
            id: String(id),
            email: String(payload?.email ?? ''),
            role: String(payload?.role ?? 'GUEST'),
            tenantId: String(payload?.tenantId ?? ''),
          };
          return { db: this.prisma, user, tenantId: user.tenantId || null, req: req as Request };
        }
      } catch (err) {
        // Invalid/expired token → anonymous context
        console.error('[trpc-context] token verify failed:', err);
      }
    }
    return { db: this.prisma, user: null, tenantId: null, req: req as Request };
  }
}
