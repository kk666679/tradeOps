import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PasskeyService } from './passkey.service';

@Module({
  imports: [PassportModule, JwtModule.register({ global: true, secret: process.env.JWT_SECRET ?? 'dev-secret-please-change' })],
  providers: [AuthService, JwtStrategy, PasskeyService],
  exports: [AuthService],
})
export class AuthModule {}
