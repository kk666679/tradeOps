import { Module } from '@nestjs/common';
import { ConfigLoaderService } from './config-loader.service';
import { AgentsService } from './agents.service';
import { SkillsService } from './skills.service';
import { GuardrailsService } from './guardrails.service';
import { WorkflowsService } from './workflows.service';
import { HooksService } from './hooks.service';
import { ApprovalsService } from './approvals.service';
import { AuditService } from './audit.service';

@Module({
  providers: [ConfigLoaderService, AgentsService, SkillsService, GuardrailsService, WorkflowsService, HooksService, ApprovalsService, AuditService],
  exports: [ConfigLoaderService, AgentsService, SkillsService, GuardrailsService, WorkflowsService, HooksService, ApprovalsService, AuditService],
})
export class AutoclawModule {}
