import { Injectable } from '@nestjs/common';
@Injectable()
export class PasskeyService {
  async registerChallenge(userId: string) { return { userId, challenge: crypto.randomUUID() }; }
  async verifyRegistration(_attestation: unknown) { return { ok: true }; }
}
