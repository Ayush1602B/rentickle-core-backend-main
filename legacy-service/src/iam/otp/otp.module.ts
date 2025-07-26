import { DatabaseModule } from '@/database/db.module'
import { CORE_MODEL_NAME } from '@/database/db.types'
import { provideCoreModel } from '@/database/db.utils'
import { Module } from '@nestjs/common'
import { AppConfigModule } from '@shared/config/config.module'
import { OtpHelper } from './otp.helper'
import { OtpService } from './otp.service'
import { OtpRepo } from './repo/otp.repo'

@Module({
  imports: [AppConfigModule, DatabaseModule],
  providers: [
    OtpService,
    OtpHelper,
    OtpRepo,
    provideCoreModel(CORE_MODEL_NAME.OTP),
  ],
  exports: [OtpService],
})
export class OtpModule {}
