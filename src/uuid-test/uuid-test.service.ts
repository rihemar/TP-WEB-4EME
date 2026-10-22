import { Inject, Injectable } from '@nestjs/common';
import { UUID_GENERATOR } from '../common/common.module.js';

@Injectable()
export class UuidTestService {
  constructor(
    @Inject(UUID_GENERATOR) private readonly generateUuid: () => string,
  ) {}

  createUuid(): string {
    return this.generateUuid();
  }
}
