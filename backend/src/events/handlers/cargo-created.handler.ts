import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
@Injectable()
export class CargoCreatedHandler implements OnModuleInit {
  constructor(private bus: EventBusService) {}
  onModuleInit() { this.bus.on('cargo-created', this.handle.bind(this)); }
  async handle(payload: unknown) { void payload; }
}
