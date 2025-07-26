import { FreeShippingMethod } from './methods/free-shipping.method'

export enum SHIPPING_METHOD {
  FREE_SHIPPING = 'freeshipping',
}

export interface IBaseShippingMethod {
  name: string
  code: SHIPPING_METHOD
  description: string
  isActive: boolean
  sortOrder: number
}

export interface IFreeShippingMethod extends IBaseShippingMethod {
  freeShippingSubtotal: number
  specificErrMsg: string | null
  sAllowSpecific: boolean
  specificCountry: string | null
  showMethod: boolean
}

export enum FREE_SHIPPING_CONFIG_ATTRIBUTE {
  ACTIVE = 'active',
  TITLE = 'title',
  DESCRIPTION = 'description',
  NAME = 'name',
  FREE_SHIPPING_SUBTOTAL = 'free_shipping_subtotal',
  SPECIFICERRMSG = 'specificerrmsg',
  SALLSPECIFIC = 'sallowspecific',
  SPECIFICCOUNTRY = 'specificcountry',
  SHOWMETHOD = 'showmethod',
  SORT_ORDER = 'sort_order',
}

export type ShippingMethod = FreeShippingMethod
export const SHIPPING_METHOD_PREFIX = 'carriers'
