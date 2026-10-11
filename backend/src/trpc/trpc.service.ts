import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { TrpcCtx } from './trpc.context';

@Injectable()
export class TrpcService {
  trpc = initTRPC.context<TrpcCtx>().create({ transformer: superjson });
  router = this.trpc.router;
  procedure = this.trpc.procedure;
  middleware = this.trpc.middleware;
  mergeRouters = this.trpc.mergeRouters;
}
