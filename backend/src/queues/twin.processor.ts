import { Injectable, OnModuleInit } from '@nestjs/common';
@Injectable()
export class TwinProcessor implements OnModuleInit {
  onModuleInit() { /* wire BullMQ Worker('cfs:twin', handler) */ }
}
