import { CoreModule } from '@/core/core.module'
import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { AppConfigModule } from '@/shared/config/config.module'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PaymentMethodFactory } from './methods/payment-method.factory'
import { PayuClient } from './methods/payu/payu.client'
import { PaymentRepo } from './payment.repo'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
    CoreModule,
    AppConfigModule,
  ],
  providers: [
    PaymentService,
    PaymentRepo,
    PaymentMethodFactory,
    PayuClient,
    provideMagentoModel(MAGENTO_MODEL_NAME.CORE_CONFIG_DATA),
  ],
  exports: [PaymentService, PaymentRepo],
})
export class PaymentModule {}
