import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { McpController } from './mcp.controller';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [McpController],
})
export class McpModule {}
