import { Injectable, OnModuleInit } from '@nestjs/common';
@Injectable()
export class LlmProcessor implements OnModuleInit {
  onModuleInit() { /* wire BullMQ Worker('cfs:llm', handler) */ }
}
