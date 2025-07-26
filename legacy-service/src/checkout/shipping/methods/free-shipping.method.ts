import {
  FREE_SHIPPING_CONFIG_ATTRIBUTE,
  IFreeShippingMethod,
  SHIPPING_METHOD,
} from '../shipping.types'
import { AbstractShippingMethod } from './abstract-shipping.method'

// @Injectable()
export class FreeShippingMethod
  extends AbstractShippingMethod
  implements IFreeShippingMethod
{
  readonly code: SHIPPING_METHOD = SHIPPING_METHOD.FREE_SHIPPING
  readonly name: string
  readonly description: string
  readonly isActive: boolean
  readonly sortOrder: number
  readonly freeShippingSubtotal: number
  readonly specificErrMsg: string | null
  readonly sAllowSpecific: boolean
  readonly specificCountry: string | null
  readonly showMethod: boolean

  constructor(configData: any[]) {
    super()

    this.name =
      this.findConfigValue(configData, FREE_SHIPPING_CONFIG_ATTRIBUTE.TITLE) ||
      'Free Shipping'

    this.description =
      this.findConfigValue(
        configData,
        FREE_SHIPPING_CONFIG_ATTRIBUTE.DESCRIPTION,
      ) || 'Shipping is on us!'

    this.isActive =
      Number(
        this.findConfigValue(configData, FREE_SHIPPING_CONFIG_ATTRIBUTE.ACTIVE),
      ) === 1

    this.sortOrder = Number(
      this.findConfigValue(
        configData,
        FREE_SHIPPING_CONFIG_ATTRIBUTE.SORT_ORDER,
      ),
    )

    this.freeShippingSubtotal =
      Number(
        this.findConfigValue(
          configData,
          FREE_SHIPPING_CONFIG_ATTRIBUTE.FREE_SHIPPING_SUBTOTAL,
        ),
      ) || 0

    this.specificErrMsg = this.findConfigValue(
      configData,
      FREE_SHIPPING_CONFIG_ATTRIBUTE.SPECIFICERRMSG,
    )

    this.sAllowSpecific =
      Number(
        this.findConfigValue(
          configData,
          FREE_SHIPPING_CONFIG_ATTRIBUTE.SALLSPECIFIC,
        ),
      ) === 1

    this.specificCountry = this.findConfigValue(
      configData,
      FREE_SHIPPING_CONFIG_ATTRIBUTE.SPECIFICCOUNTRY,
    )

    this.showMethod =
      Number(
        this.findConfigValue(
          configData,
          FREE_SHIPPING_CONFIG_ATTRIBUTE.SHOWMETHOD,
        ),
      ) === 1
  }

  calculate() {
    return Promise.resolve(0)
  }
}
