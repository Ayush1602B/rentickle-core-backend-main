import { Module } from '@nestjs/common'
import { AppConfigService } from '@shared/config/config.service'
import { AppLogger } from './logger.service'

@Module({
  imports: [],
  providers: [AppConfigService, AppLogger],
  exports: [AppLogger],
})
export class LoggingModule {}
