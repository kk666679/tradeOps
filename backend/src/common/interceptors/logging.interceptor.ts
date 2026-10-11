import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const t0 = Date.now();
    return next.handle().pipe(tap(() => {
      const ms = Date.now() - t0;
      const req = ctx.switchToHttp().getRequest();
      console.log(JSON.stringify({ method: req.method, url: req.url, ms }));
    }));
  }
}
