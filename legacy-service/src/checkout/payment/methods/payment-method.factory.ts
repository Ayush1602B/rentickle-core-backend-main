import { CoreConfigData } from '@/core/config/models/core-config-data.model'
import { AppConfigService } from '@/shared/config/config.service'
import { Injectable } from '@nestjs/common'
import { PAYMENT_METHOD, PaymentMethod } from '../payment.types'
import { CashOnDeliveryMethod } from './cod-payment.method'
import { PayubizMethod } from './payu/payu-payment.method'
import { PayuClient } from './payu/payu.client'

@Injectable()
export class PaymentMethodFactory {
  constructor(
    private readonly payubizClient: PayuClient,
    private readonly appConfigService: AppConfigService,
  ) {}

  create(
    code: PAYMENT_METHOD,
    configRows: CoreConfigData[],
  ): PaymentMethod | null {
    switch (code) {
      case PAYMENT_METHOD.PAYU_BIZ:
        return new PayubizMethod(
          this.payubizClient,
          this.appConfigService,
          configRows,
        )

      case PAYMENT_METHOD.CASH_ON_DELIVERY:
        return new CashOnDeliveryMethod(configRows)

      default:
        return null
    }
  }
}
