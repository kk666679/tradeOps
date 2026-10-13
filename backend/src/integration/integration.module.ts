import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { IotController } from './iot.controller';
import { IotService } from './iot.service';
import { JkdmService } from './jkdm/jkdm.service';
import { JkdmRouter } from './jkdm/jkdm.router';

@Module({
  imports: [AuthModule],
  controllers: [IotController],
  providers: [IotService, JkdmService, JkdmRouter],
  exports: [IotService, JkdmService, JkdmRouter],
})
export class IntegrationModule {}
