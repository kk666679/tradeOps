import { Injectable } from '@nestjs/common';
@Injectable()
export class RiskAgent {
  readonly name = 'risk';
  async run(input: unknown) { return { ok: true, agent: this.name, input }; }
}
