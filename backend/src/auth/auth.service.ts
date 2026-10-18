import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginInput, RegisterInput } from './auth.schema';

const GENERIC_AUTH_ERROR = 'Unable to authenticate with those credentials.';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || user.status !== 'ACTIVE' || !(await verify(user.passwordHash, input.password))) {
      throw new UnauthorizedException(GENERIC_AUTH_ERROR);
    }

    const access = await this.jwt.signAsync({ sub: user.id, email: user.email, tenantId: user.tenantId, role: user.role });
    return { ok: true, access };
  }

  async register(input: RegisterInput) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ConflictException('Unable to create an account with those details.');

    const password = await hash(input.password);
    const tenant = await this.prisma.tenant.create({
      data: { name: `${input.name}'s workspace`, slug: `workspace-${crypto.randomUUID()}` },
    });
    const user = await this.prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash: password, role: 'WAREHOUSE_STAFF', tenantId: tenant.id },
    });
    const access = await this.jwt.signAsync({ sub: user.id, email: user.email, tenantId: user.tenantId, role: user.role });
    return { ok: true, access, userId: user.id };
  }

  async refresh(refresh: string) { void refresh; throw new UnauthorizedException('Session refresh is not available.'); }
}
