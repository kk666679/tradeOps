import { Injectable } from '@nestjs/common';
@Injectable()
export class ZoneAgent {
  readonly name = 'zone';
  async run(input: unknown) { return { ok: true, agent: this.name, input }; }
}
