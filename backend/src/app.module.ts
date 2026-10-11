import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrpcModule } from './trpc/trpc.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TenantModule } from './tenant/tenant.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CargoModule } from './cargo/cargo.module';
import { TradeOpsModule } from './trade-ops/trade-ops.module';
import { FizModule } from './fiz/fiz.module';
import { FczModule } from './fcz/fcz.module';
import { WmsModule } from './wms/wms.module';
import { OrderManagementModule } from './order-management/order-management.module';
import { InventoryModule } from './inventory/inventory.module';
import { LogisticsModule } from './logistics/logistics.module';
import { DigitalTwinModule } from './digital-twin/digital-twin.module';
import { IntegrationModule } from './integration/integration.module';
import { CustomAgentsModule } from './custom-agents/custom-agents.module';
import { AutoclawModule } from './autoclaw/autoclaw.module';
import { AiModule } from './ai/ai.module';
import { McpModule } from './mcp/mcp.module';
import { RulesModule } from './rules/rules.module';
import { QueuesModule } from './queues/queues.module';
import { EventsModule } from './events/events.module';
import { HealthModule } from './health/health.module';
import { WorkersModule } from './workers/workers.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule, PrismaModule, TrpcModule, RepositoriesModule,
    AuthModule, UserModule, TenantModule, DashboardModule,
    CargoModule, TradeOpsModule, FizModule, FczModule,
    WmsModule, OrderManagementModule, InventoryModule, LogisticsModule,
    DigitalTwinModule, IntegrationModule, CustomAgentsModule, AutoclawModule,
    AiModule, McpModule, RulesModule, QueuesModule, EventsModule,
    HealthModule, WorkersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
