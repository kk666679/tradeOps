import { Injectable } from '@nestjs/common';
@Injectable()
export class QueueService {
  async enqueue(queue: string, name: string, data: unknown) {
    // Wire BullMQ here.
    return { queue, name, data };
  }
}
