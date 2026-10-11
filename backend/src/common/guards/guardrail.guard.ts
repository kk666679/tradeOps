import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GUARDRAIL_KEY } from '../decorators/guardrail.decorator';
@Injectable()
export class GuardrailGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const ids = this.reflector.getAllAndOverride<string[]>(GUARDRAIL_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (!ids?.length) return true;
    const req = ctx.switchToHttp().getRequest();
    // Fail-closed: missing policy => block
    const policy = req.guardrails ?? {};
    for (const id of ids) if (!policy[id]) throw new ForbiddenException('Guardrail ' + id);
    return true;
  }
}
