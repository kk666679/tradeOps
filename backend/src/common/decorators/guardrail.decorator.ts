import { SetMetadata } from '@nestjs/common';
export const GUARDRAIL_KEY = 'guardrail';
export const Guardrail = (...ids: string[]) => SetMetadata(GUARDRAIL_KEY, ids);
