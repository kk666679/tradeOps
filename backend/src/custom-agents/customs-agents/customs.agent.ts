import { Injectable } from '@nestjs/common';
@Injectable()
export class CustomsAgent {
  readonly name = 'customs';
  async run(input: unknown) { return { ok: true, agent: this.name, input }; }
}
