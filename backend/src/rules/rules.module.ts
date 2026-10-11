import { Module } from '@nestjs/common';
import { RuleEngineService } from './rule-engine.service';
import { RuleLoaderService } from './rule-loader.service';
import {
  customsAct1967,
  salesTax2018,
  fizFczRegulations,
  bondedWarehouse,
  aseanAtiga,
  rcepOrigin,
  wcoHs2022,
} from './packs';

/** All bundled rule packs (each exports its own `rules` array). */
export const RULE_PACKS = [
  customsAct1967,
  salesTax2018,
  fizFczRegulations,
  bondedWarehouse,
  aseanAtiga,
  rcepOrigin,
  wcoHs2022,
];

@Module({
  providers: [RuleEngineService, RuleLoaderService],
  exports: [RuleEngineService, RuleLoaderService],
})
export class RulesModule {}
