import { Injectable, OnModuleInit } from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

@Injectable()
export class AgentsService implements OnModuleInit {
  agents: unknown[] = [];
  onModuleInit() {
    const dir = path.join(process.cwd(), '.autoclaw/agents');
    if (!fs.existsSync(dir)) return;
    this.agents = fs.readdirSync(dir).filter((f) => f.endsWith('.agent.yaml'))
      .map((f) => YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  }
}
