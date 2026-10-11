import { Injectable } from '@nestjs/common';
@Injectable()
export class InventoryAgent {
  readonly name = 'inventory';
  async run(input: unknown) { return { ok: true, agent: this.name, input }; }
}
