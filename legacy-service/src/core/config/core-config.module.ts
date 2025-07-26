import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { Module } from '@nestjs/common'
import { CoreConfigService } from './core-config.service'
import { CoreConfigDataRepo } from './repo/core-config-data.repo'

@Module({
  providers: [
    CoreConfigService,
    CoreConfigDataRepo,
    provideMagentoModel(MAGENTO_MODEL_NAME.CORE_CONFIG_DATA),
  ],
  exports: [CoreConfigService, CoreConfigDataRepo],
})
export class CoreConfigModule {}
