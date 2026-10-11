import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
@Catch(TRPCError)
export class TrpcExceptionFilter implements ExceptionFilter {
  catch(err: TRPCError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res.status(200).json({ ok: false, code: err.code, message: err.message });
  }
}
