import { CoreModule } from '@/core/core.module'
import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { Module } from '@nestjs/common'
import { ShippingRepo } from './shipping.repo'
import { ShippingService } from './shipping.service'

@Module({
  imports: [CoreModule],
  providers: [
    ShippingService,
    ShippingRepo,
    provideMagentoModel(MAGENTO_MODEL_NAME.CORE_CONFIG_DATA),
  ],
  exports: [ShippingService],
})
export class ShippingModule {}
