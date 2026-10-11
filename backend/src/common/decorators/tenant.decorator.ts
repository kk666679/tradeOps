import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const Tenant = createParamDecorator((_d, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.tenantId;
});
