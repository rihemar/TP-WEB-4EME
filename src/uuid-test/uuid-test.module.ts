import { Module } from '@nestjs/common';
import { UuidTestController } from './uuid-test.controller.js';
import { UuidTestService } from './uuid-test.service.js';

@Module({
  controllers: [UuidTestController],
  providers: [UuidTestService]
})
export class UuidTestModule {}
