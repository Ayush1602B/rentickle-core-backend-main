import { PaymentModule } from '@/checkout/payment/payment.module'
import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { EavModule } from '@/eav/eav.module'
import { AppCacheModule } from '@/shared/cache/cache.module'
import { SharedModule } from '@/shared/shared.module'
import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { SalesFlatOrderRepo } from './repo/sales-flat-order.repo'
import { LoggingModule } from '@/shared/logging/logger.module'

@Module({
  imports: [
    EavModule,
    PaymentModule,
    AppCacheModule,
    LoggingModule,
    SharedModule,
  ],
  providers: [
    OrderService,
    SalesFlatOrderRepo,
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_ORDER),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_ADDRESS),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_ITEM),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_PAYMENT),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_STATUS_HISTORY),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_GRID),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_DOCUMENT),
  ],
  exports: [OrderService, SalesFlatOrderRepo],
})
export class OrderModule {}
