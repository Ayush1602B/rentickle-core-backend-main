import { CoreConfigData } from '@/core/config/models/core-config-data.model'
import {
  FREE_SHIPPING_CONFIG_ATTRIBUTE,
  IBaseShippingMethod,
  SHIPPING_METHOD,
} from '../shipping.types'
import { FreeShippingMethod } from './free-shipping.method'

export abstract class AbstractShippingMethod implements IBaseShippingMethod {
  abstract readonly name: string
  abstract readonly code: SHIPPING_METHOD
  abstract readonly description: string
  abstract readonly isActive: boolean
  abstract readonly sortOrder: number
  abstract readonly freeShippingSubtotal: number

  abstract calculate(): Promise<number>

  protected findConfigValue(
    configData: CoreConfigData[],
    configAttr: FREE_SHIPPING_CONFIG_ATTRIBUTE,
  ): string | null {
    const config = configData.find(
      (data) => data.path === `carriers/${this.code}/${configAttr}`,
    )
    return config ? config.value : null
  }

  isFreeShipping(): boolean {
    return this instanceof FreeShippingMethod
  }
}
