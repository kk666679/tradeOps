import { Injectable } from '@nestjs/common';
@Injectable()
export class DocumentAgent {
  readonly name = 'document';
  async run(input: unknown) { return { ok: true, agent: this.name, input }; }
}
