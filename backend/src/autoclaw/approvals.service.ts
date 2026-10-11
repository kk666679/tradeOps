import { Injectable } from '@nestjs/common';
@Injectable()
export class ApprovalsService {
  async approve(runId: string, approver: string) { return { ok: true, runId, approver }; }
  async reject(runId: string, approver: string, reason: string) { return { ok: true, runId, approver, reason }; }
}
