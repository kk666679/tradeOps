import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
@Injectable()
export class GatePassIssuedHandler implements OnModuleInit {
  constructor(private bus: EventBusService) {}
  onModuleInit() { this.bus.on('gate-pass-issued', this.handle.bind(this)); }
  async handle(payload: unknown) { void payload; }
}
