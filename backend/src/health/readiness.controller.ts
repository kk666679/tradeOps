import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';
@Controller('health/ready')
export class ReadinessController {
  constructor(private svc: HealthService) {}
  @Get() async ready() {
    const ok = await this.svc.ready();
    if (!ok) throw new ServiceUnavailableException();
    return { ok: true };
  }
}
