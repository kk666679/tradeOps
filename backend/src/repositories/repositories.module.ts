import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from './user.repository';
import { TenantRepository } from './tenant.repository';
import { CargoRepository } from './cargo.repository';
import { InventoryRepository } from './inventory.repository';
import { SlotRepository } from './slot.repository';
import { DocumentRepository } from './document.repository';
import { DeclarationRepository } from './declaration.repository';
import { PermitRepository } from './permit.repository';
import { BondedRepository } from './bonded.repository';
import { ExemptionRepository } from './exemption.repository';
import { OrderRepository } from './order.repository';
import { LogisticsRepository } from './logistics.repository';
import { VendorRepository } from './vendor.repository';
import { AgentRepository } from './agent.repository';
import { AuditRepository } from './audit.repository';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [UserRepository, TenantRepository, CargoRepository, InventoryRepository, SlotRepository, DocumentRepository, DeclarationRepository, PermitRepository, BondedRepository, ExemptionRepository, OrderRepository, LogisticsRepository, VendorRepository, AgentRepository, AuditRepository],
  exports: [UserRepository, TenantRepository, CargoRepository, InventoryRepository, SlotRepository, DocumentRepository, DeclarationRepository, PermitRepository, BondedRepository, ExemptionRepository, OrderRepository, LogisticsRepository, VendorRepository, AgentRepository, AuditRepository],
})
export class RepositoriesModule {}
