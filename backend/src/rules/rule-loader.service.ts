import { Injectable, OnModuleInit } from '@nestjs/common';
import { RuleEngineService } from './rule-engine.service';
@Injectable()
export class RuleLoaderService implements OnModuleInit {
  constructor(private engine: RuleEngineService) {}
  onModuleInit() { /* load packs from lib/rules/packs at runtime */ }
}
