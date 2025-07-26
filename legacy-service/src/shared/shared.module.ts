import { Module } from '@nestjs/common'
import { LoggingModule } from './logging/logger.module'
import { RetryService } from './utils/retry.util'

@Module({
  imports: [LoggingModule],
  providers: [RetryService],
  exports: [RetryService],
})
export class SharedModule {}
