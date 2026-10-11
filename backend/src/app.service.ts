import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  root() {
    return { ok: true, service: 'cfs-wms-backend', version: process.env.npm_package_version ?? '0.0.0' };
  }
}
