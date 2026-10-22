import { Global, Module } from '@nestjs/common';
import { v4 } from 'uuid';

export const UUID_GENERATOR = 'UUID_GENERATOR';

@Global()
@Module({
  providers: [
    {
      provide: UUID_GENERATOR,
      useValue: () => v4(),
    },
  ],
  exports: [UUID_GENERATOR],
})
export class CommonModule {}
