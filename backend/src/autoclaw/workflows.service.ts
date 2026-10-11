import { Injectable, OnModuleInit } from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

@Injectable()
export class WorkflowsService implements OnModuleInit {
  workflows = new Map<string, unknown>();
  onModuleInit() {
    const dir = path.join(process.cwd(), '.autoclaw/workflows');
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.workflow.yaml'))) {
      const wf = YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      this.workflows.set(wf.id, wf);
    }
  }
}
