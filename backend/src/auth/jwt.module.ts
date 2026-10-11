import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
@Module({ imports: [NestJwtModule.register({ global: true, secret: process.env.JWT_SECRET ?? 'dev-secret-please-change' })] })
export class JwtModule {}
