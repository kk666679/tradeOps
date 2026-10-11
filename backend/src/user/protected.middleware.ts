import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class ProtectedMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    if (!req.user) throw new UnauthorizedException();
    next();
  }
}
