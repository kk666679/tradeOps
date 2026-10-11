import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ClearanceGateway } from './clearance/clearance.gateway';

/**
 * TradeOps domain module.
 *
 * The clearance WebSocket gateway is auto-discovered by Nest from the
 * `@WebSocketGateway` decorator, so no WebSocketsModule import is required.
 * This module wires the shared repositories so the per-domain services
 * (clearance, compliance, declarations, documents, duty, hs-classification,
 * permits, trade-finance, analytics) can be injected by the tRPC routers
 * merged into `TrpcRouter`.
 */
@Module({
  imports: [RepositoriesModule],
  providers: [ClearanceGateway],
})
export class TradeOpsModule {}