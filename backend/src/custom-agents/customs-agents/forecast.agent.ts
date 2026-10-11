import { Injectable } from '@nestjs/common';
@Injectable()
export class ForecastAgent {
  readonly name = 'forecast';
  async run(input: unknown) { return { ok: true, agent: this.name, input }; }
}
