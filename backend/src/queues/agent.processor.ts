import { Injectable, OnModuleInit } from '@nestjs/common';
@Injectable()
export class AgentProcessor implements OnModuleInit {
  onModuleInit() { /* wire BullMQ Worker('cfs:agent', handler) */ }
}
