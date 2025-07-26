import { CoreConfigData } from '@/core/config/models/core-config-data.model'
import { SalesFlatOrder } from '@/sales/order/models/sales-flat-order.model'
import {
  CASH_ON_DELIVERY_CONFIG_ATTRIBUTE,
  InitPaymentResponse,
  PAYMENT_METHOD,
  PAYUBIZ_CONFIG_ATTRIBUTE,
} from '../payment.types'

export abstract class AbstractPaymentMethod {
  abstract code: PAYMENT_METHOD
  abstract name: string
  abstract description: string
  abstract isActive: boolean
  abstract sortOrder: number

  abstract initPayment(order: SalesFlatOrder): Promise<InitPaymentResponse<any>>
  abstract validatePaymentResponseCallback(
    successResponse: any,
  ): Promise<boolean>

  protected findConfigValue(
    configData: CoreConfigData[],
    configAttr: CASH_ON_DELIVERY_CONFIG_ATTRIBUTE | PAYUBIZ_CONFIG_ATTRIBUTE,
  ): string | null {
    const config = configData.find(
      (data) => data.path === `payment/${this.code}/${configAttr}`,
    )
    return config ? config.value : null
  }
}
