import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
@Controller('health')
export class HealthController {
  constructor(private svc: HealthService) {}
  @Get() health() { return this.svc.snapshot(); }
}
