import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { IotController } from './iot.controller';
import { IotService } from './iot.service';
import { JkdmService } from './jkdm/jkdm.service';

@Module({
  imports: [AuthModule],
  controllers: [IotController],
  providers: [IotService, JkdmService],
  exports: [IotService, JkdmService],
})
export class IntegrationModule {}
