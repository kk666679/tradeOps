import { Injectable } from '@nestjs/common';
@Injectable()
export class OpsAgent {
  readonly name = 'ops';
  async run(input: unknown) { return { ok: true, agent: this.name, input }; }
}
