import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
@Injectable()
export class ExceptionRaisedHandler implements OnModuleInit {
  constructor(private bus: EventBusService) {}
  onModuleInit() { this.bus.on('exception-raised', this.handle.bind(this)); }
  async handle(payload: unknown) { void payload; }
}
