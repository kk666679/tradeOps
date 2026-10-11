import { Injectable, OnModuleInit } from '@nestjs/common';
@Injectable()
export class ForecastProcessor implements OnModuleInit {
  onModuleInit() { /* wire BullMQ Worker('cfs:forecast', handler) */ }
}
