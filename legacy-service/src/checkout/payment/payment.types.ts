import { CashOnDeliveryMethod } from './methods/cod-payment.method'
import { PayubizMethod } from './methods/payu/payu-payment.method'

export enum PAYMENT_METHOD {
  CASH_ON_DELIVERY = 'cashondelivery',
  PAYU_BIZ = 'payubiz',
}

export interface IBasePaymentMethod {
  name: string
  code: PAYMENT_METHOD
  description: string
  isActive: boolean
  sortOrder: number

  initPayment(): Promise<void>
}

export interface ICashOnDeliveryMethod extends IBasePaymentMethod {
  orderStatus: string
  allowSpecific: boolean
  instructions: string
  minOrderTotal: number
  maxOrderTotal: number
}

export enum CASH_ON_DELIVERY_CONFIG_ATTRIBUTE {
  ACTIVE = 'active',
  TITLE = 'title',
  DESCRIPTION = 'description',
  ORDER_STATUS = 'order_status',
  ALLOWSPECIFIC = 'allowspecific',
  INSTRUCTIONS = 'instructions',
  MIN_ORDER_TOTAL = 'min_order_total',
  MAX_ORDER_TOTAL = 'max_order_total',
  SORT_ORDER = 'sort_order',
}

export enum PAYUBIZ_CONFIG_ATTRIBUTE {
  ACTIVE = 'active',
  TITLE = 'title',
  DESCRIPTION = 'description',
  MERCHANT_KEY = 'merchant_key',
  SALT = 'salt',
  TXN_RANDOM_NO = 'txn_random_no',
  DEBUGGING = 'debugging',
  CURRENCY_CONVERTOR = 'currency_convertor',
  TRANS_MODE = 'trans_mode',
  PG = 'Pg',
  BANKCODE = 'bankcode',
  SORT_ORDER = 'sort_order',
}

export type PaymentMethod = CashOnDeliveryMethod | PayubizMethod
export const PAYMENT_METHOD_PREFIX = 'payment'

export interface InitPaymentResponse<T> {
  formActionUrl: string
  formData: T
}
