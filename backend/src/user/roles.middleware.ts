import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
@Injectable()
export class RolesMiddleware implements NestMiddleware {
  constructor(private allowed: string[] = []) {}
  use(req: any, _res: any, next: () => void) {
    if (this.allowed.length && !this.allowed.includes(req.user?.role)) throw new ForbiddenException();
    next();
  }
}
