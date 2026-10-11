import { Injectable, OnModuleInit } from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

@Injectable()
export class ConfigLoaderService implements OnModuleInit {
  config: unknown = null;
  onModuleInit() {
    const p = path.join(process.cwd(), '.autoclaw/config.yaml');
    this.config = fs.existsSync(p) ? YAML.parse(fs.readFileSync(p, 'utf8')) : null;
  }
}
