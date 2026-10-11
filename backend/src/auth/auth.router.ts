import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '../trpc/trpc.service';
import { requireAuth } from '../trpc/trpc.middleware';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './auth.schema';

/** Auth procedures — the single source of truth for authentication. */
@Injectable()
export class AuthRouter {
  constructor(private trpc: TrpcService, private auth: AuthService) {}
  get router() {
    return this.trpc.router({
      me: this.trpc.procedure.use(requireAuth).query(({ ctx }) => ctx.user),
      login: this.trpc.procedure.input(LoginInput).mutation(({ input }) => this.auth.login(input)),
      register: this.trpc.procedure.input(RegisterInput).mutation(({ input }) => this.auth.register(input)),
      refresh: this.trpc.procedure
        .input(z.object({ refresh: z.string() }))
        .mutation(({ input }) => this.auth.refresh(input.refresh)),
    });
  }
}
