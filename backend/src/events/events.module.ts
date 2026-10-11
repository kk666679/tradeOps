import { Module } from '@nestjs/common';
import { EventBusService } from './event-bus.service';
import { CargoCreatedHandler } from './handlers/cargo-created.handler';
import { DeclarationSubmittedHandler } from './handlers/declaration-submitted.handler';
import { GatePassIssuedHandler } from './handlers/gate-pass-issued.handler';
import { AgentRunCompletedHandler } from './handlers/agent-run-completed.handler';
import { ExceptionRaisedHandler } from './handlers/exception-raised.handler';

@Module({
  providers: [EventBusService, CargoCreatedHandler, DeclarationSubmittedHandler, GatePassIssuedHandler, AgentRunCompletedHandler, ExceptionRaisedHandler],
  exports: [EventBusService],
})
export class EventsModule {}
