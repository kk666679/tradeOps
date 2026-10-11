import { Injectable, OnModuleInit } from '@nestjs/common';
@Injectable()
export class EmbeddingProcessor implements OnModuleInit {
  onModuleInit() { /* wire BullMQ Worker('cfs:embedding', handler) */ }
}
