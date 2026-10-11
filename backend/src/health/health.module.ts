import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ReadinessController } from './readiness.controller';
import { LivenessController } from './liveness.controller';
import { HealthService } from './health.service';
@Module({ controllers: [HealthController, ReadinessController, LivenessController], providers: [HealthService] })
export class HealthModule {}
