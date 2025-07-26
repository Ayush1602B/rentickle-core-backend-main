import { CoreConfigData } from '@/core/config/models/core-config-data.model'
import { ADDRESS_TYPE } from '@/rmp/rmp.types'
import { SalesFlatOrder } from '@/sales/order/models/sales-flat-order.model'
import { SalesPaymentTransaction } from '@/sales/order/models/sales-payment-transaction.model'
import {
  MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS,
  MAGENTO_SALES_PAYMENT_TRANSACTION_TYPE,
} from '@/sales/order/order.types'
import { AppConfigService } from '@/shared/config/config.service'
import { PaymentInvalidTxnIdException } from '../../payment.error'
import {
  InitPaymentResponse,
  PAYMENT_METHOD,
  PAYUBIZ_CONFIG_ATTRIBUTE,
} from '../../payment.types'
import { AbstractPaymentMethod } from '../abstract-payment.method'
import { PayuClient } from './payu.client'
import { PayuPaymentApiRequestDto } from './payu.types'

export class PayubizMethod extends AbstractPaymentMethod {
  readonly code: PAYMENT_METHOD = PAYMENT_METHOD.PAYU_BIZ
  readonly name: string
  readonly description: string
  readonly isActive: boolean
  readonly sortOrder: number

  protected merchantKey: string | null
  protected salt: string | null
  protected txnRandomNo: string | null
  protected debugging: boolean
  protected currencyConvertor: boolean
  protected transMode: string | null
  protected pg: string | null
  protected bankcode: string | null

  constructor(
    private readonly payubizClient: PayuClient,
    private readonly appConfigService: AppConfigService,
    private readonly configData: CoreConfigData[],
  ) {
    super()

    this.name =
      this.findConfigValue(this.configData, PAYUBIZ_CONFIG_ATTRIBUTE.TITLE) ||
      'PayU Biz'

    this.description =
      this.findConfigValue(
        this.configData,
        PAYUBIZ_CONFIG_ATTRIBUTE.DESCRIPTION,
      ) || 'PayU Biz Payment Gateway'

    this.isActive =
      Number(
        this.findConfigValue(this.configData, PAYUBIZ_CONFIG_ATTRIBUTE.ACTIVE),
      ) === 1

    this.sortOrder = Number(
      this.findConfigValue(
        this.configData,
        PAYUBIZ_CONFIG_ATTRIBUTE.SORT_ORDER,
      ),
    )

    this.generateConfig()
  }

  private generateConfig() {
    this.merchantKey = this.findConfigValue(
      this.configData,
      PAYUBIZ_CONFIG_ATTRIBUTE.MERCHANT_KEY,
    )

    this.salt = this.findConfigValue(
      this.configData,
      PAYUBIZ_CONFIG_ATTRIBUTE.SALT,
    )

    this.txnRandomNo = this.findConfigValue(
      this.configData,
      PAYUBIZ_CONFIG_ATTRIBUTE.TXN_RANDOM_NO,
    )

    this.debugging =
      Number(
        this.findConfigValue(
          this.configData,
          PAYUBIZ_CONFIG_ATTRIBUTE.DEBUGGING,
        ),
      ) === 1

    this.currencyConvertor =
      Number(
        this.findConfigValue(
          this.configData,
          PAYUBIZ_CONFIG_ATTRIBUTE.CURRENCY_CONVERTOR,
        ),
      ) === 1

    this.transMode = this.findConfigValue(
      this.configData,
      PAYUBIZ_CONFIG_ATTRIBUTE.TRANS_MODE,
    )

    this.pg = this.findConfigValue(this.configData, PAYUBIZ_CONFIG_ATTRIBUTE.PG)

    this.bankcode = this.findConfigValue(
      this.configData,
      PAYUBIZ_CONFIG_ATTRIBUTE.BANKCODE,
    )
  }

  private _generatePaymentPayload(
    order: SalesFlatOrder,
    paymentTxn: SalesPaymentTransaction,
  ): PayuPaymentApiRequestDto {
    const orderIncrementId = order.incrementId
    const orderAddresses = order.SalesFlatOrderAddresses
    const orderShippingAddress = orderAddresses.find(
      (address) => address.addressType === ADDRESS_TYPE.SHIPPING,
    )

    const payload = new PayuPaymentApiRequestDto({
      txnid: paymentTxn.txnId!,
      amount: Number(order.grandTotal).toFixed(2),
      productinfo: `Initial Payment For #${orderIncrementId}`,
      firstname: order.customerFirstname || 'Guest',
      email: order.customerEmail!,
      phone: orderShippingAddress!.telephone!,
      surl: `${this.appConfigService.getOrThrow('API_BASE_URL')}/checkout/${orderIncrementId}/payment/payu/success`,
      furl: `${this.appConfigService.getOrThrow('API_BASE_URL')}/checkout/${orderIncrementId}/payment/payu/failure`,
    })

    return payload
  }

  initPayment(
    order: SalesFlatOrder,
  ): Promise<InitPaymentResponse<PayuPaymentApiRequestDto>> {
    const latestPaymentTxn = (order.SalesPaymentTransactions || []).find(
      (txn) =>
        txn.txnType === MAGENTO_SALES_PAYMENT_TRANSACTION_TYPE.SALE &&
        txn.status === MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS.PENDING &&
        txn.isClosed === 0,
    )

    if (!latestPaymentTxn) {
      throw new PaymentInvalidTxnIdException(
        'No pending transaction found to initiate payment',
      )
    }

    if (!latestPaymentTxn.txnId) {
      throw new PaymentInvalidTxnIdException(
        'Transaction ID is not available in the payment transaction',
      )
    }

    const payload = this._generatePaymentPayload(order, latestPaymentTxn)
    const merchantKey = this.payubizClient.merchantKey
    const hash = this.payubizClient.generateHash(payload)

    latestPaymentTxn.requestDto = JSON.stringify(payload)

    return Promise.resolve({
      formActionUrl: this.payubizClient.getPaymentFormActionUrl(),
      formData: { ...payload, key: merchantKey, hash },
    })
  }

  validatePaymentResponseCallback(
    successResponse: PayuPaymentApiRequestDto,
  ): Promise<boolean> {
    const isHashValid = this.payubizClient.validateHash(
      successResponse.hash,
      successResponse,
    )

    return Promise.resolve(isHashValid)
  }
}
