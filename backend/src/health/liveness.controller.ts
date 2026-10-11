import { Controller, Get } from '@nestjs/common';
@Controller('health/live')
export class LivenessController {
  @Get() live() { return { ok: true, at: new Date().toISOString() }; }
}
