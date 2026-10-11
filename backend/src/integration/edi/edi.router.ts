import { Injectable } from '@nestjs/common';
import { TrpcService } from '../../trpc/trpc.service';
import { createCrudRouter } from '../../trpc/createCrudRouter';
@Injectable()
export class EdiRouter {
  constructor(private trpc: TrpcService) {}
  get router() { return createCrudRouter(this.trpc, 'edi'); }
}
