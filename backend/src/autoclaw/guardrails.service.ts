import { Injectable, OnModuleInit } from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

@Injectable()
export class GuardrailsService implements OnModuleInit {
  guardrails: unknown[] = [];
  onModuleInit() {
    const dir = path.join(process.cwd(), '.autoclaw/guardrails');
    if (!fs.existsSync(dir)) return;
    this.guardrails = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml'))
      .map((f) => YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  }
  evaluate(action: string, ctx: unknown) { void action; void ctx; return { ok: true, blocks: [] as string[] }; }
}
