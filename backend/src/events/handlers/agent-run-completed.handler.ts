import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
@Injectable()
export class AgentRunCompletedHandler implements OnModuleInit {
  constructor(private bus: EventBusService) {}
  onModuleInit() { this.bus.on('agent-run-completed', this.handle.bind(this)); }
  async handle(payload: unknown) { void payload; }
}
