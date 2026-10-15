import { Injectable } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

// Root-level routers
import { AuthRouter } from '../auth/auth.router';
import { UserRouter } from '../user/user.router';
import { TenantRouter } from '../tenant/tenant.router';
import { DashboardRouter } from '../dashboard/dashboard.router';
import { TaskRouter } from '../modules/task/task.router';
import { InventoryRouter } from '../inventory/inventory.router';
import { LogisticsRouter } from '../logistics/logistics.router';
import { DigitalTwinRouter } from '../digital-twin/digital-twin.router';

// cargo/*
import { CargoRouter } from '../cargo/cargo.router';
import { BulkCargoRouter } from '../cargo/bulk/bulk-cargo.router';
import { FczCargoRouter } from '../cargo/fcz/fcz-cargo.router';
import { FizCargoRouter } from '../cargo/fiz/fiz-cargo.router';
import { HazmatRouter } from '../cargo/hazmat/hazmat.router';

// wms/*
import { BondedRouter } from '../wms/bonded/bonded.router';
import { ExemptionRouter } from '../wms/exemption/exemption.router';
import { ForecastingRouter } from '../wms/forecasting/forecasting.router';
import { GateRouter } from '../wms/gate/gate.router';
import { InboundRouter } from '../wms/inbound/inbound.router';
import { InventoryRouter as WmsInventoryRouter } from '../wms/inventory/inventory.router';
import { MovementRouter } from '../wms/movement/movement.router';
import { OutboundRouter } from '../wms/outbound/outbound.router';
import { SlottingRouter } from '../wms/slotting/slotting.router';

// trade-ops/*
import { AnalyticsRouter } from '../trade-ops/analytics/analytics.router';
import { ClearanceRouter } from '../trade-ops/clearance/clearance.router';
import { ComplianceRouter } from '../trade-ops/compliance/compliance.router';
import { DeclarationsRouter } from '../trade-ops/declarations/declarations.router';
import { DocumentsRouter } from '../trade-ops/documents/documents.router';
import { DutyRouter } from '../trade-ops/duty/duty.router';
import { HsClassificationRouter } from '../trade-ops/hs-classification/hs-classification.router';
import { HsCodeRulingsRouter } from '../trade-ops/hs-classification/hs-code-rulings.router';
import { PermitsRouter } from '../trade-ops/permits/permits.router';
import { TradeFinanceRouter } from '../trade-ops/trade-finance/trade-finance.router';

// order-management/*
import { ApprovalsRouter } from '../order-management/approvals/approvals.router';
import { CustomsRouter as OrderCustomsRouter } from '../order-management/customs/customs.router';
import { FulfilmentRouter } from '../order-management/fulfilment/fulfilment.router';
import { ManufacturingRouter } from '../order-management/manufacturing/manufacturing.router';
import { PurchaseRouter } from '../order-management/purchase/purchase.router';
import { TradingRouter } from '../order-management/trading/trading.router';
import { TranshipmentRouter as OrderTranshipmentRouter } from '../order-management/transhipment/transhipment.router';

// custom-agents/*
import { AuditRouter } from '../custom-agents/audit/audit.router';
import { BuilderRouter } from '../custom-agents/builder/builder.router';
import { CustomsAgentsRouter } from '../custom-agents/customs-agents/customs-agents.router';
import { EvalsRouter } from '../custom-agents/evals/evals.router';
import { MemoryRouter } from '../custom-agents/memory/memory.router';
import { MonitoringRouter } from '../custom-agents/monitoring/monitoring.router';
import { OrchestrationRouter } from '../custom-agents/orchestration/orchestration.router';
import { PolicyRouter } from '../custom-agents/policy/policy.router';
import { RegistryRouter } from '../custom-agents/registry/registry.router';
import { SupervisionRouter } from '../custom-agents/supervision/supervision.router';

// fiz/*
import { MachineryRouter } from '../fiz/machinery/machinery.router';
import { OperatorsRouter } from '../fiz/operators/operators.router';
import { ProductionRouter } from '../fiz/production/production.router';
import { SubcontractRouter } from '../fiz/subcontract/subcontract.router';
import { WastageRouter } from '../fiz/wastage/wastage.router';

// fcz/*
import { BreakBulkRouter } from '../fcz/break-bulk/break-bulk.router';
import { EntrepotRouter } from '../fcz/entrepot/entrepot.router';
import { ReexportRouter } from '../fcz/reexport/reexport.router';
import { TradingHousesRouter } from '../fcz/trading-houses/trading-houses.router';
import { TranshipmentRouter as FczTranshipmentRouter } from '../fcz/transhipment/transhipment.router';

// integration/*
import { AgentMeshRouter } from '../integration/agent-mesh/agent-mesh.router';
import { CustomsRouter as IntegrationCustomsRouter } from '../integration/customs/customs.router';
import { EdiRouter } from '../integration/edi/edi.router';
import { ErpRouter } from '../integration/erp/erp.router';
import { FizFczRouter } from '../integration/fiz-fcz/fiz-fcz.router';
import { TmsRouter } from '../integration/tms/tms.router';
import { WebhookRouter } from '../integration/webhook/webhook.router';
import { WmsExtRouter } from '../integration/wms-ext/wms-ext.router';
import { JkdmRouter } from '../integration/jkdm/jkdm.router';
import { JkdmService } from '../integration/jkdm/jkdm.service';
import { PrismaService } from '../prisma/prisma.service';
import { SeedService } from '../workflow/seed.service';
import { LoopExecutionService } from '../workflow/loop-execution.service';

/**
 * The single source of truth for the API surface.
 *
 * Every domain router is merged into one namespaced `appRouter`, which is:
 *  - served over HTTP by the Nest backend at `/api/trpc` (see main.ts), and
 *  - consumed by the Next.js frontend through the `/api/trpc` proxy,
 *    typed end-to-end via `export type AppRouter`.
 */
@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly auth: AuthService,
    private readonly userService: UserService,
    private readonly jkdmService: JkdmService,
    private readonly prisma: PrismaService,
    private readonly seedService: SeedService,
    private readonly loopExecutionService: LoopExecutionService,
  ) {}

  get appRouter() {
    return this.trpc.router({
      // --- identity & tenancy ---
      auth: new AuthRouter(this.trpc, this.auth).router,
      user: new UserRouter(this.trpc, this.userService).router,
      tenant: new TenantRouter(this.trpc).router,

      // --- core app ---
      dashboard: new DashboardRouter(this.trpc).router,
      task: new TaskRouter(this.trpc).router,
      inventory: new InventoryRouter(this.trpc).router,
      logistics: new LogisticsRouter(this.trpc).router,
      digitalTwin: new DigitalTwinRouter(this.trpc, this.prisma).router,

      // --- cargo ---
      cargo: this.trpc.router({
        main: new CargoRouter(this.trpc).router,
        bulk: new BulkCargoRouter(this.trpc).router,
        fcz: new FczCargoRouter(this.trpc).router,
        fiz: new FizCargoRouter(this.trpc).router,
        hazmat: new HazmatRouter(this.trpc).router,
      }),

      // --- warehouse management ---
      wms: this.trpc.router({
        bonded: new BondedRouter(this.trpc).router,
        exemption: new ExemptionRouter(this.trpc).router,
        forecasting: new ForecastingRouter(this.trpc).router,
        gate: new GateRouter(this.trpc).router,
        inbound: new InboundRouter(this.trpc).router,
        inventory: new WmsInventoryRouter(this.trpc).router,
        movement: new MovementRouter(this.trpc).router,
        outbound: new OutboundRouter(this.trpc).router,
        slotting: new SlottingRouter(this.trpc).router,
      }),

      // --- trade operations ---
      tradeOps: this.trpc.router({
        analytics: new AnalyticsRouter(this.trpc).router,
        clearance: new ClearanceRouter(this.trpc).router,
        compliance: new ComplianceRouter(this.trpc).router,
        declarations: new DeclarationsRouter(this.trpc).router,
        documents: new DocumentsRouter(this.trpc).router,
        duty: new DutyRouter(this.trpc).router,
        hsClassification: new HsClassificationRouter(this.trpc).router,
        hsCodeRulings: new HsCodeRulingsRouter(this.trpc).router,
        permits: new PermitsRouter(this.trpc).router,
        tradeFinance: new TradeFinanceRouter(this.trpc).router,
      }),

      // --- order management ---
      orderManagement: this.trpc.router({
        approvals: new ApprovalsRouter(this.trpc).router,
        customs: new OrderCustomsRouter(this.trpc).router,
        fulfilment: new FulfilmentRouter(this.trpc).router,
        manufacturing: new ManufacturingRouter(this.trpc).router,
        purchase: new PurchaseRouter(this.trpc).router,
        trading: new TradingRouter(this.trpc).router,
        transhipment: new OrderTranshipmentRouter(this.trpc).router,
      }),

      // --- autonomous agents ---
      customAgents: this.trpc.router({
        audit: new AuditRouter(this.trpc).router,
        builder: new BuilderRouter(this.trpc).router,
        customsAgents: new CustomsAgentsRouter(this.trpc).router,
        evals: new EvalsRouter(this.trpc).router,
        memory: new MemoryRouter(this.trpc).router,
        monitoring: new MonitoringRouter(this.trpc).router,
        orchestration: new OrchestrationRouter(
          this.trpc,
          this.seedService,
          this.loopExecutionService,
        ).router,
        policy: new PolicyRouter(this.trpc).router,
        registry: new RegistryRouter(this.trpc).router,
        supervision: new SupervisionRouter(this.trpc).router,
      }),

      // --- FIZ (Free Industrial Zone) ---
      fiz: this.trpc.router({
        machinery: new MachineryRouter(this.trpc).router,
        operators: new OperatorsRouter(this.trpc).router,
        production: new ProductionRouter(this.trpc).router,
        subcontract: new SubcontractRouter(this.trpc).router,
        wastage: new WastageRouter(this.trpc).router,
      }),

      // --- FCZ (Free Commercial Zone) ---
      fcz: this.trpc.router({
        breakBulk: new BreakBulkRouter(this.trpc).router,
        entrepot: new EntrepotRouter(this.trpc).router,
        reexport: new ReexportRouter(this.trpc).router,
        tradingHouses: new TradingHousesRouter(this.trpc).router,
        transhipment: new FczTranshipmentRouter(this.trpc).router,
      }),

      // --- external integrations ---
      integration: this.trpc.router({
        agentMesh: new AgentMeshRouter(this.trpc).router,
        customs: new IntegrationCustomsRouter(this.trpc).router,
        edi: new EdiRouter(this.trpc).router,
        erp: new ErpRouter(this.trpc).router,
        fizFcz: new FizFczRouter(this.trpc).router,
        tms: new TmsRouter(this.trpc).router,
        webhook: new WebhookRouter(this.trpc).router,
        wmsExt: new WmsExtRouter(this.trpc).router,
        jkdm: new JkdmRouter(this.trpc, this.jkdmService).router,
      }),
    });
  }
}
export type AppRouter = TrpcRouter['appRouter'];

