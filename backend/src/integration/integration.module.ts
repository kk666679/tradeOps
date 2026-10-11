import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { IotController } from './iot.controller';
import { IotService } from './iot.service';

@Module({
  imports: [AuthModule],
  controllers: [IotController],
  providers: [IotService],
  exports: [IotService],
})
export class IntegrationModule {}
