import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcRouter } from './trpc.router';
import { TrpcContextFactory } from './trpc.context';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { IntegrationModule } from '../integration/integration.module';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [AuthModule, UserModule, IntegrationModule, WorkflowModule],
  providers: [TrpcService, TrpcRouter, TrpcContextFactory],
  exports: [TrpcService, TrpcRouter],
})
export class TrpcModule {}
