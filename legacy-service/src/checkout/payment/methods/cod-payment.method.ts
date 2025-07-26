import { CoreConfigData } from '@/core/config/models/core-config-data.model'
import {
  CASH_ON_DELIVERY_CONFIG_ATTRIBUTE,
  InitPaymentResponse,
  PAYMENT_METHOD,
} from '../payment.types'
import { AbstractPaymentMethod } from './abstract-payment.method'

export class CashOnDeliveryMethod extends AbstractPaymentMethod {
  readonly code: PAYMENT_METHOD = PAYMENT_METHOD.CASH_ON_DELIVERY
  readonly name: string
  readonly description: string
  readonly isActive: boolean
  readonly sortOrder: number

  protected orderStatus: string
  protected allowSpecific: boolean
  protected instructions: string
  protected minOrderTotal: number
  protected maxOrderTotal: number

  constructor(private readonly configData: CoreConfigData[]) {
    super()

    this.name =
      this.findConfigValue(
        this.configData,
        CASH_ON_DELIVERY_CONFIG_ATTRIBUTE.TITLE,
      ) || 'Cash on Delivery'

    this.description =
      this.findConfigValue(
        this.configData,
        CASH_ON_DELIVERY_CONFIG_ATTRIBUTE.DESCRIPTION,
      ) || 'Pay when you receive your order'

    this.isActive =
      Number(
        this.findConfigValue(
          this.configData,
          CASH_ON_DELIVERY_CONFIG_ATTRIBUTE.ACTIVE,
        ),
      ) === 1

    this.sortOrder = Number(
      this.findConfigValue(
        this.configData,
        CASH_ON_DELIVERY_CONFIG_ATTRIBUTE.SORT_ORDER,
      ),
    )

    this._generateConfig()
  }

  private _generateConfig() {
    this.orderStatus =
      this.findConfigValue(
        this.configData,
        CASH_ON_DELIVERY_CONFIG_ATTRIBUTE.ORDER_STATUS,
      ) || 'pending'

    this.allowSpecific =
      Number(
        this.findConfigValue(
          this.configData,
          CASH_ON_DELIVERY_CONFIG_ATTRIBUTE.ALLOWSPECIFIC,
        ),
      ) === 1

    this.instructions =
      this.findConfigValue(
        this.configData,
        CASH_ON_DELIVERY_CONFIG_ATTRIBUTE.INSTRUCTIONS,
      ) || ''

    this.minOrderTotal =
      Number(
        this.findConfigValue(
          this.configData,
          CASH_ON_DELIVERY_CONFIG_ATTRIBUTE.MIN_ORDER_TOTAL,
        ),
      ) || 0

    this.maxOrderTotal =
      Number(
        this.findConfigValue(
          this.configData,
          CASH_ON_DELIVERY_CONFIG_ATTRIBUTE.MAX_ORDER_TOTAL,
        ),
      ) || 0
  }

  initPayment(): Promise<InitPaymentResponse<any>> {
    throw new Error('Method not implemented.')
  }

  validatePaymentResponseCallback(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
