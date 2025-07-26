import {
  SalesFlatQuoteAddress,
  SalesFlatQuoteAddressAttributes,
} from '@/checkout/cart/models/sales-flat-quote-address.model'
import { SalesFlatQuoteItem } from '@/checkout/cart/models/sales-flat-quote-item.model'
import { SalesFlatQuotePayment } from '@/checkout/cart/models/sales-flat-quote-payment.model'
import { SalesFlatQuote } from '@/checkout/cart/models/sales-flat-quote.model'
import { OnPayuPaymentFailureInputDto } from '@/checkout/checkout/api/dto/on-payu-payment-failure.dto'
import { OnPayuPaymentSuccessInputDto } from '@/checkout/checkout/api/dto/on-payu-payment-success.dto'
import { CheckoutInvalidPaymentResponseException } from '@/checkout/checkout/checkout.error'
import { PaymentRepo } from '@/checkout/payment/payment.repo'
import { PaymentMethod } from '@/checkout/payment/payment.types'
import { CustomerAddressEntity } from '@/customer/customer/models/customer-address-entity.model'
import { DEFAULT_STORE_ID } from '@/database/db.types'
import { MAGENTO_ENTITY_TYPE_ID } from '@/eav/eav.types'
import { EavEntityTypeRepo } from '@/eav/repo/eav-entity-type.repo'
import { CoreCacheService } from '@/shared/cache/services/core-cache.service'
import { AppLogger } from '@/shared/logging/logger.service'
import { DEFAULT_CURRENCY_CODE } from '@/shared/shared.interface'
import { RetryService } from '@/shared/utils/retry.util'
import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { Op } from 'sequelize'
import { SalesFlatOrderAddress } from './models/sales-flat-order-address.model'
import { SalesFlatOrderItem } from './models/sales-flat-order-item.model'
import { SalesFlatOrderPayment } from './models/sales-flat-order-payment.model'
import { SalesFlatOrderStatusHistory } from './models/sales-flat-order-status-history.model'
import { SalesFlatOrder } from './models/sales-flat-order.model'
import { SalesPaymentTransaction } from './models/sales-payment-transaction.model'
import {
  OrderEmptyCartException,
  OrderInvalidCartException,
  OrderInvalidEntityException,
  OrderInvalidPaymentMethodException,
  OrderNotFoundException,
  OrderUnableToCreateException,
  OrderUnauthorisedPaymentException,
  ShippingAddressNotFoundException,
} from './order.error'
import {
  MAGENTO_ORDER_STATE,
  MAGENTO_ORDER_STATUS,
  MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS,
  MAGENTO_SALES_PAYMENT_TRANSACTION_TYPE,
  ORDER_CACHE_KEY,
  ORDER_CACHE_KEY_BUILDERS,
  ORDER_CACHE_TTL,
} from './order.types'
import { SalesFlatOrderRepo } from './repo/sales-flat-order.repo'

interface IOrderService {
  convertCartToOrder: (cart: SalesFlatQuote) => Promise<SalesFlatOrder>
  getByIncrementId: (incrementId: string) => Promise<SalesFlatOrder | null>
  validateAndGetByIncrementId: (incrementId: string) => Promise<SalesFlatOrder>
  initiateTransaction(order: SalesFlatOrder): Promise<SalesPaymentTransaction>
  confirmPayment: (
    order: SalesFlatOrder,
    paymentResponse: OnPayuPaymentSuccessInputDto,
  ) => Promise<void>
  declinePayment: (
    order: SalesFlatOrder,
    paymentResponse: OnPayuPaymentFailureInputDto,
  ) => Promise<void>
  confirmOrder: (order: SalesFlatOrder) => Promise<void>
  updateShippingAddressFromCustomerAddress: (
    order: SalesFlatOrder,
    customerAddress: CustomerAddressEntity,
  ) => Promise<SalesFlatOrderAddress>
}

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    private readonly logger: AppLogger,
    private readonly salesFlatOrderRepo: SalesFlatOrderRepo,
    private readonly eavEntityRepo: EavEntityTypeRepo,
    private readonly paymentRepo: PaymentRepo,
    private readonly coreCacheService: CoreCacheService,
    private readonly retryService: RetryService,
  ) {}

  /**
   * Generates a secure protect code of the desired length.
   * @param {number} length - Length of the protect code (default is 6).
   * @returns {string} - Generated protect code.
   */
  private _generateRandomStr(length = 6) {
    // Define the possible characters for the protect code
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let protectCode = ''

    // Generate a random string by selecting random characters
    for (let i = 0; i < length; i = i + 1) {
      const randomIndex = crypto.randomInt(0, characters.length)
      protectCode += characters[randomIndex]
    }

    return protectCode
  }

  async convertCartToOrder(cart: SalesFlatQuote): Promise<SalesFlatOrder> {
    if (cart.itemsCount === 0) {
      throw new OrderEmptyCartException(
        'Cart is empty. Cannot convert to order.',
      )
    }

    const newOrder = await this._createOrder(cart)
    await this._reserveOrderId(newOrder)

    cart.isActive = 0
    return newOrder
  }

  private async _acquireLock(incrementId: string): Promise<boolean> {
    const lockKey =
      ORDER_CACHE_KEY_BUILDERS[ORDER_CACHE_KEY.RESERVE_ORDER_ID](incrementId)
    const lockTtl = ORDER_CACHE_TTL.RESERVE_ORDER_ID
    const lockValue = this._generateRandomStr(10)

    const existingLock = await this.coreCacheService.get(lockKey)

    if (existingLock) {
      this.logger.warn(
        `Lock already exists for incrementId ${incrementId}. Existing lock: ${existingLock}`,
      )
      return false
    }

    const isLocked = await this.coreCacheService.set(
      lockKey,
      lockValue,
      lockTtl,
    )
    return isLocked
  }

  async _reserveOrderId(order: SalesFlatOrder): Promise<void> {
    const eavEntity = await this.eavEntityRepo.findOneByPk(
      MAGENTO_ENTITY_TYPE_ID.ORDER.toString(),
    )

    if (!eavEntity) {
      throw new OrderInvalidEntityException('EAV entity not found for order.')
    }

    const [eavEntityStore] = await eavEntity.getEavEntityStores({
      where: {
        storeId: {
          [Op.or]: [order.storeId, DEFAULT_STORE_ID],
        },
      },
    })

    if (!eavEntityStore) {
      throw new OrderInvalidEntityException(
        'EAV entity store not found for order.',
      )
    }

    const incrementPrefix = eavEntityStore.incrementPrefix
    const lastIncrementId = eavEntityStore.incrementLastId

    if (!incrementPrefix || !lastIncrementId) {
      throw new OrderInvalidEntityException(
        'Increment prefix not found for order.',
      )
    }

    const incrementPadChar = eavEntity.incrementPadChar
    const incrementPadLength = eavEntity.incrementPadLength
    const incrementPerStore = eavEntity.incrementPerStore

    const numericPartMatch = lastIncrementId.slice(1)
    if (!numericPartMatch) {
      throw new OrderInvalidEntityException(
        'Unable to place order, please try again.',
      )
    }

    let lastIdNumber = parseInt(numericPartMatch, 10)
    if (isNaN(lastIdNumber)) {
      throw new OrderInvalidEntityException(
        'Unable to place order, please try again.',
      )
    }

    while (true) {
      const newIdNumber = lastIdNumber + incrementPerStore
      const paddedIdNumber = newIdNumber
        .toString()
        .padStart(incrementPadLength, incrementPadChar)

      const candidateIncrementId = `${incrementPrefix}${paddedIdNumber}`

      const isLocked = await this._acquireLock(candidateIncrementId)
      if (isLocked) {
        order.incrementId = candidateIncrementId

        // ✅ Persist new incrementLastId
        eavEntityStore.incrementLastId = candidateIncrementId
        await eavEntityStore.save()

        break
      }

      lastIdNumber = newIdNumber
    }
  }

  private async _createOrder(cart: SalesFlatQuote): Promise<SalesFlatOrder> {
    const store = await cart.getCoreStore()
    const cartShippingAddress = cart.getShippingAddress()
    const cartPayment = await cart.getSalesFlatQuotePayment()

    if (!cartShippingAddress) {
      throw new OrderInvalidCartException(
        'Cart does not have a shipping address.',
      )
    }

    const newOrder = new SalesFlatOrder({
      state: MAGENTO_ORDER_STATE.NEW,
      status: MAGENTO_ORDER_STATUS.PENDING,
      storeId: cart.storeId,
      protectCode: this._generateRandomStr(),
      baseToGlobalRate: 1,
      baseToOrderRate: 1,
      storeToBaseRate: 1,
      storeToOrderRate: 1,
      totalPaid: 0,
      emailSent: 0,
      baseShippingDiscountAmount: 0,
      shippingDiscountAmount: 0,
      orderCurrencyCode: DEFAULT_CURRENCY_CODE,
      hiddenTaxAmount: 0,
      baseHiddenTaxAmount: 0,
      shippingHiddenTaxAmount: 0,
      baseShippingHiddenTaxAmnt: 0,
      hiddenTaxInvoiced: 0,
      baseHiddenTaxInvoiced: 0,
      hiddenTaxRefunded: 0,
      baseHiddenTaxRefunded: 0,
      paypalIpnCustomerNotified: 0,
      creditpointAmount: 0,
      baseCreditpointAmount: 0,
      creditpointAmountInvoiced: 0,
      baseCreditpointAmountInvoiced: 0,
      creditpointAmountRefunded: 0,
      baseCreditpointAmountRefunded: 0,
    })

    // Copy fields from cart to new order
    this._copyFieldsFromCart(newOrder, cart, cartShippingAddress)

    // Convert cart items to order items
    await Promise.all(
      cart.SalesFlatQuoteItems.map(async (cartItem) => {
        const newOrderItem = await this._convertCartItemToOrderItem(cartItem)

        newOrderItem.setStore(store)
        newOrder.addItem(newOrderItem)
      }),
    )

    await Promise.all([
      cart.SalesFlatQuoteAddresses.map(async (cartAddress) => {
        const newOrderAddress =
          await this._convertCartAddressToOrderAddress(cartAddress)

        newOrder.addAddress(newOrderAddress)
      }),
    ])

    const orderPayment = await this._convertCartPaymentToOrderPayment(
      cartShippingAddress,
      cartPayment,
    )

    newOrder.setPayment(orderPayment)

    const statusHistoryRecord = await this._createOrderStatusHistory()
    newOrder.addStatusHistory(statusHistoryRecord)

    return Promise.resolve(newOrder)
  }

  private _copyFieldsFromCart(
    newOrder: SalesFlatOrder,
    cart: SalesFlatQuote,
    cartShippingAddress: SalesFlatQuoteAddress,
  ): SalesFlatOrder {
    newOrder.setAttributes({
      quoteId: cart.entityId,
      isVirtual: cart.isVirtual,
      storeId: cart.storeId,
      customerId: cart.customerId,
      totalQtyOrdered: cart.itemsQty,
      customerIsGuest: cart.customerIsGuest,
      customerNoteNotify: cart.customerNoteNotify,
      customerGroupId: cart.customerGroupId,
      baseCurrencyCode: cart.baseCurrencyCode,
      customerEmail: cart.customerEmail,
      customerFirstname: cart.customerFirstname,
      customerLastname: cart.customerLastname,
      customerMiddlename: cart.customerMiddlename,
      customerPrefix: cart.customerPrefix,
      customerSuffix: cart.customerSuffix,
      customerTaxvat: cart.customerTaxvat,
      remoteIp: cart.remoteIp,
      totalItemCount: cart.itemsCount,
      globalCurrencyCode: cart.globalCurrencyCode,
      storeCurrencyCode: cart.storeCurrencyCode,
      couponCode: cart.couponCode,
    })

    newOrder.setAttributes({
      shippingDescription: cartShippingAddress.shippingDescription,
      baseDiscountAmount: cartShippingAddress.baseDiscountAmount,
      baseGrandTotal: cartShippingAddress.baseGrandTotal,
      baseShippingAmount: cartShippingAddress.baseShippingAmount,
      baseShippingTaxAmount: cartShippingAddress.baseShippingTaxAmount,
      baseSubtotal: cartShippingAddress.baseSubtotal,
      baseTaxAmount: cartShippingAddress.baseTaxAmount,
      discountAmount: cartShippingAddress.discountAmount,
      grandTotal: cartShippingAddress.grandTotal,
      shippingAmount: cartShippingAddress.shippingAmount,
      shippingTaxAmount: cartShippingAddress.shippingTaxAmount,
      subtotal: cartShippingAddress.subtotal,
      taxAmount: cartShippingAddress.taxAmount,
      baseSubtotalInclTax: cartShippingAddress.baseSubtotalTotalInclTax,
      baseTotalDue: cartShippingAddress.baseGrandTotal,
      subtotalInclTax: cartShippingAddress.subtotalInclTax,
      totalDue: cartShippingAddress.grandTotal,
      weight: cartShippingAddress.weight,
      discountDescription: cartShippingAddress.discountDescription,
      shippingMethod: cartShippingAddress.shippingMethod,
      shippingInclTax: cartShippingAddress.shippingInclTax,
      baseShippingInclTax: cartShippingAddress.baseShippingInclTax,
      refundableDeposit: cartShippingAddress.refundableDeposit,
      baseRefundableDeposit: cartShippingAddress.baseRefundableDeposit,
      depositDiscount: cartShippingAddress.depositDiscount,
      baseDepositDiscount: cartShippingAddress.baseDepositDiscount,
    })

    return newOrder
  }

  private async _convertCartItemToOrderItem(
    cartItem: SalesFlatQuoteItem,
  ): Promise<SalesFlatOrderItem> {
    const newOrderItem = new SalesFlatOrderItem({
      orderId: 0,
      parentItemId: null,
      quoteItemId: cartItem.itemId,
      productId: cartItem.productId,
      productType: cartItem.productType,
      productOptions: await cartItem.serializeProductOptions(),
      weight: cartItem.weight,
      isVirtual: cartItem.isVirtual,
      sku: cartItem.sku,
      name: cartItem.name,
      description: cartItem.description,
      appliedRuleIds: cartItem.appliedRuleIds,
      additionalData: cartItem.additionalData,
      freeShipping: cartItem.freeShipping,
      isQtyDecimal: cartItem.isQtyDecimal,
      noDiscount: cartItem.noDiscount,
      qtyBackordered: 0,
      qtyCanceled: 0,
      qtyInvoiced: 0,
      qtyOrdered: cartItem.qty,
      qtyRefunded: 0,
      qtyShipped: 0,
      baseCost: cartItem.baseCost || 0,
      price: cartItem.customPrice || cartItem.price,
      basePrice: cartItem.originalCustomPrice || cartItem.basePrice,
      originalPrice: cartItem.price,
      baseOriginalPrice: cartItem.originalCustomPrice || cartItem.basePrice,
      taxPercent: cartItem.taxPercent,
      taxAmount: cartItem.taxAmount,
      baseTaxAmount: cartItem.baseTaxAmount,
      taxInvoiced: 0,
      baseTaxInvoiced: 0,
      discountPercent: cartItem.discountPercent,
      discountAmount: cartItem.discountAmount,
      baseDiscountAmount: cartItem.baseDiscountAmount,
      discountInvoiced: 0,
      baseDiscountInvoiced: 0,
      amountRefunded: 0,
      baseAmountRefunded: 0,
      rowTotal: cartItem.rowTotal,
      baseRowTotal: cartItem.baseRowTotal,
      rowInvoiced: 0,
      baseRowInvoiced: 0,
      rowWeight: cartItem.rowWeight,
      priceInclTax: cartItem.priceInclTax,
      basePriceInclTax: cartItem.basePriceInclTax,
      rowTotalInclTax: cartItem.rowTotalInclTax,
      baseRowTotalInclTax: cartItem.baseRowTotalInclTax,
      hiddenTaxAmount: 0,
      baseHiddenTaxAmount: 0,
      isNominal: 0,
      giftMessageAvailable: 0,
      baseWeeeTaxAppliedAmount: cartItem.baseWeeeTaxAppliedAmount,
      baseWeeeTaxAppliedRowAmnt: cartItem.baseWeeeTaxAppliedRowAmnt,
      weeeTaxAppliedAmount: cartItem.weeeTaxAppliedAmount,
      weeeTaxAppliedRowAmount: cartItem.weeeTaxAppliedRowAmount,
      weeeTaxApplied: cartItem.weeeTaxApplied,
      weeeTaxDisposition: cartItem.weeeTaxDisposition,
      weeeTaxRowDisposition: cartItem.weeeTaxRowDisposition,
      baseWeeeTaxRowDisposition: cartItem.baseWeeeTaxRowDisposition,
      refundableDeposit: cartItem.refundableDeposit,
      baseRefundableDeposit: cartItem.baseRefundableDeposit,
      rentalStartDatetime: cartItem.rentalStartDatetime,
      rentalEndDatetime: cartItem.rentalEndDatetime,
      rentalType: cartItem.rentalType,
      depositDiscount: cartItem.depositDiscount,
      baseDepositDiscount: cartItem.baseDepositDiscount,
      depositDiscountPercent: cartItem.depositDiscountPercent,
    })

    newOrderItem.SalesFlatQuoteItem = cartItem
    cartItem.SalesFlatOrderItem = newOrderItem

    return newOrderItem
  }

  private _convertCartAddressToOrderAddress(
    cartAddress: SalesFlatQuoteAddressAttributes,
  ): Promise<SalesFlatOrderAddress> {
    const newOrderAddress = new SalesFlatOrderAddress({
      customerAddressId: cartAddress.customerAddressId,
      quoteAddressId: cartAddress.addressId,
      regionId: cartAddress.regionId,
      customerId: cartAddress.customerId,
      fax: cartAddress.fax,
      cityId: cartAddress.cityId,
      region: cartAddress.region,
      postcode: cartAddress.postcode,
      lastname: cartAddress.lastname,
      street: cartAddress.street,
      city: cartAddress.city,
      email: cartAddress.email,
      telephone: cartAddress.telephone,
      countryId: cartAddress.countryId,
      firstname: cartAddress.firstname,
      addressType: cartAddress.addressType,
      prefix: cartAddress.prefix,
      middlename: cartAddress.middlename,
      suffix: cartAddress.suffix,
      company: cartAddress.company,
      vatId: cartAddress.vatId,
      vatIsValid: cartAddress.vatIsValid,
      vatRequestId: cartAddress.vatRequestId,
      vatRequestDate: cartAddress.vatRequestDate,
      vatRequestSuccess: cartAddress.vatRequestSuccess,
    })

    return Promise.resolve(newOrderAddress)
  }

  private _convertCartPaymentToOrderPayment(
    cartShippingAddress: SalesFlatQuoteAddressAttributes,
    cartPayment: SalesFlatQuotePayment,
  ): Promise<SalesFlatOrderPayment> {
    const newOrderPayment = new SalesFlatOrderPayment({
      parentId: 0,
      baseShippingCaptured: 0,
      shippingCaptured: 0,
      amountRefunded: 0,
      baseAmountPaid: 0,
      amountCanceled: 0,
      baseAmountAuthorized: 0,
      baseAmountPaidOnline: 0,
      baseAmountRefundedOnline: 0,
      baseShippingAmount: cartShippingAddress.baseShippingAmount,
      shippingAmount: cartShippingAddress.shippingAmount,
      amountPaid: 0,
      amountAuthorized: 0,
      baseAmountOrdered: cartShippingAddress.baseGrandTotal,
      baseShippingRefunded: 0,
      shippingRefunded: 0,
      baseAmountRefunded: 0,
      amountOrdered: cartShippingAddress.grandTotal,
      baseAmountCanceled: 0,
      quotePaymentId: cartPayment.paymentId,
      additionalData: cartPayment.additionalData,
      ccExpMonth: cartPayment.ccExpMonth,
      ccSsStartYear: cartPayment.ccSsStartYear,
      method: cartPayment.method,
      ccSsStartMonth: cartPayment.ccSsStartMonth,
      ccExpYear: cartPayment.ccExpYear,
      additionalInformation: cartPayment.additionalInformation,
    })

    return Promise.resolve(newOrderPayment)
  }

  private _createOrderStatusHistory(): Promise<SalesFlatOrderStatusHistory> {
    const newOrderStatusHistory = new SalesFlatOrderStatusHistory({
      parentId: 0,
      isCustomerNotified: 0,
      isVisibleOnFront: 0,
      comment: '',
      status: MAGENTO_ORDER_STATUS.PENDING,
      entityName: 'order',
    })

    return Promise.resolve(newOrderStatusHistory)
  }

  getByIncrementId(incrementId: string): Promise<SalesFlatOrder | null> {
    return SalesFlatOrder.findOne({
      where: {
        incrementId,
      },
    })
  }

  private async _validateOrderBeforeConfirm(
    order: SalesFlatOrder,
  ): Promise<{ paymentMethod: PaymentMethod }> {
    const orderPayment = await order.loadSalesOrderPayment()
    const orderPaymentMethodCode = orderPayment.method
    if (!orderPaymentMethodCode) {
      throw new OrderInvalidPaymentMethodException(
        'No payment method found for the order!',
      )
    }

    const paymentMethod = await this.paymentRepo.getByCode(
      orderPaymentMethodCode,
    )
    if (!paymentMethod) {
      throw new OrderInvalidPaymentMethodException('Payment method not found')
    }

    const orderReservedIdLockKey = ORDER_CACHE_KEY_BUILDERS[
      ORDER_CACHE_KEY.RESERVE_ORDER_ID
    ](order.incrementId!)

    const orderReservedId = await this.coreCacheService.get<string>(
      orderReservedIdLockKey,
    )

    if (!orderReservedId) {
      throw new OrderUnableToCreateException(
        'Unable to place order, please try again.',
      )
    }

    return {
      paymentMethod,
    }
  }

  async confirmPayment(
    order: SalesFlatOrder,
    paymentResponse: OnPayuPaymentSuccessInputDto,
  ): Promise<void> {
    const orderPayment = await order.loadSalesOrderPayment()
    const { paymentMethod } = await this._validateOrderBeforeConfirm(order)

    const isResponseValid =
      await paymentMethod.validatePaymentResponseCallback(paymentResponse)
    if (!isResponseValid) {
      throw new CheckoutInvalidPaymentResponseException(
        'Payment response is invalid',
      )
    }

    const [paymentTxn] = await order.getSalesPaymentTransactions({
      where: {
        txnId: paymentResponse.txnid,
        txnType: MAGENTO_SALES_PAYMENT_TRANSACTION_TYPE.SALE,
        status: MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS.PENDING,
      },
    })

    if (
      !paymentTxn ||
      paymentTxn.txnAmount !== Number(paymentResponse.amount) ||
      paymentTxn.txnId !== paymentResponse.txnid ||
      order.customerEmail !== paymentResponse.email
    ) {
      throw new CheckoutInvalidPaymentResponseException(
        'Payment response is invalid',
      )
    }

    orderPayment.amountPaid = Number(paymentResponse.amount)
    orderPayment.baseAmountPaid = Number(paymentResponse.amount)
    orderPayment.baseAmountPaidOnline = Number(paymentResponse.amount)
    orderPayment.baseAmountPaidOnline = Number(paymentResponse.amount)
    orderPayment.amountAuthorized = Number(paymentResponse.amount)
    orderPayment.baseAmountAuthorized = Number(paymentResponse.amount)

    paymentTxn.status = MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS.SUCCESS
    paymentTxn.responseDto = JSON.stringify(paymentResponse)
    paymentTxn.isClosed = 1

    orderPayment.addTransaction(paymentTxn)
    order.SalesFlatOrderPayment = orderPayment
  }

  async declinePayment(
    order: SalesFlatOrder,
    paymentResponse: OnPayuPaymentFailureInputDto,
  ): Promise<void> {
    const orderPayment = await order.getSalesFlatOrderPayment()
    const { paymentMethod } = await this._validateOrderBeforeConfirm(order)

    const isResponseValid =
      await paymentMethod.validatePaymentResponseCallback(paymentResponse)
    if (!isResponseValid) {
      throw new CheckoutInvalidPaymentResponseException(
        'Payment response is invalid',
      )
    }

    const [paymentTxn] = await order.getSalesPaymentTransactions({
      where: {
        txnId: paymentResponse.txnid,
        txnType: MAGENTO_SALES_PAYMENT_TRANSACTION_TYPE.SALE,
        status: MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS.PENDING,
      },
    })

    if (
      !paymentTxn ||
      paymentTxn.txnAmount !== Number(paymentResponse.amount) ||
      paymentTxn.txnId !== paymentResponse.txnid ||
      order.customerEmail !== paymentResponse.email
    ) {
      throw new CheckoutInvalidPaymentResponseException(
        'Payment response is invalid',
      )
    }

    paymentTxn.status = MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS.FAILURE
    paymentTxn.responseDto = JSON.stringify(paymentResponse)
    paymentTxn.isClosed = 0

    orderPayment.addTransaction(paymentTxn)
    order.SalesFlatOrderPayment = orderPayment
  }

  confirmOrder(order: SalesFlatOrder): Promise<void> {
    const orderPayment = order.SalesFlatOrderPayment
    if (!orderPayment) {
      throw new OrderUnauthorisedPaymentException(
        'Payment not found for the order!',
      )
    }

    const paymentTxn = (orderPayment.SalesPaymentTransactions || []).find(
      (txn) => txn.txnId === orderPayment.lastTransId,
    )

    if (
      !paymentTxn ||
      (orderPayment.amountPaid !== order.grandTotal &&
        paymentTxn.isSaleSuccess())
    ) {
      throw new OrderUnauthorisedPaymentException(
        'Unauthorised payment for the order!',
      )
    }

    order.state = MAGENTO_ORDER_STATE.PROCESSING
    order.status = MAGENTO_ORDER_STATUS.PROCESSING
    order.baseTotalPaid = orderPayment.baseAmountPaid
    order.totalPaid = orderPayment.amountPaid
    order.baseTotalDue = 0
    order.totalDue = 0

    return Promise.resolve()
  }

  async initiateTransaction(
    order: SalesFlatOrder,
  ): Promise<SalesPaymentTransaction> {
    const orderPayment = order.SalesFlatOrderPayment
    if (!orderPayment) {
      throw new OrderUnauthorisedPaymentException(
        'Payment not found for the order!',
      )
    }

    const existingPaymentTxn = await orderPayment.getSalesPaymentTransactions()
    const orderIncrementId = order.incrementId

    if (!orderIncrementId) {
      throw new OrderUnableToCreateException(
        'Unable to place order, please try again.',
      )
    }

    let newTxnId = orderIncrementId

    while (true) {
      let newTxnGenId = newTxnId
      const existingTxn = existingPaymentTxn.find(
        (txn) => txn.txnId === newTxnGenId,
      )
      if (!existingTxn) {
        newTxnId = newTxnGenId
        break
      }
      newTxnGenId = `${orderIncrementId}-${this._generateRandomStr(10)}`
    }

    const newPaymentTxn = new SalesPaymentTransaction({
      txnType: MAGENTO_SALES_PAYMENT_TRANSACTION_TYPE.SALE,
      status: MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS.PENDING,
      parentId: null,
      orderId: order.entityId,
      paymentId: orderPayment.entityId,
      txnId: newTxnId,
      txnAmount: orderPayment.amountOrdered,
      isClosed: 0,
    })

    orderPayment.lastTransId = newPaymentTxn.txnId

    orderPayment.addTransaction(newPaymentTxn)
    order.addPaymentTransaction(newPaymentTxn)

    return Promise.resolve(newPaymentTxn)
  }

  async validateAndGetByIncrementId(
    incrementId: string,
  ): Promise<SalesFlatOrder> {
    const order = await this.salesFlatOrderRepo.findOne({
      where: {
        incrementId: incrementId,
      },
    })

    if (!order) {
      throw new OrderNotFoundException(
        `Order with increment ID ${incrementId} not found.`,
      )
    }

    return order
  }

  private async _validateAndGetOrderShippingAddress(
    order: SalesFlatOrder,
  ): Promise<SalesFlatOrderAddress> {
    order.SalesFlatOrderAddresses = await order.getSalesFlatOrderAddresses()
    const orderShippingAddress = order.getShippingAddress()

    if (!orderShippingAddress) {
      throw new ShippingAddressNotFoundException(
        `Shipping address not found for order ID ${order.incrementId}.`,
      )
    }

    return orderShippingAddress
  }

  async updateShippingAddressFromCustomerAddress(
    order: SalesFlatOrder,
    customerAddress: CustomerAddressEntity,
  ): Promise<SalesFlatOrderAddress> {
    const orderShippingAddress =
      await this._validateAndGetOrderShippingAddress(order)

    const addressAttributeMap = await customerAddress.toAttributeMap()
    orderShippingAddress.setAttributes({
      customerAddressId: customerAddress.entityId,
      regionId: addressAttributeMap.region_id,
      customerId: customerAddress.parentId,
      fax: addressAttributeMap.fax,
      cityId: addressAttributeMap.city_id,
      region: addressAttributeMap.region,
      postcode: addressAttributeMap.postcode,
      lastname: addressAttributeMap.lastname,
      street: addressAttributeMap.street,
      city: addressAttributeMap.city,
      telephone: addressAttributeMap.telephone,
      countryId: addressAttributeMap.country_id,
      firstname: addressAttributeMap.firstname,
      addressType: orderShippingAddress.addressType,
      prefix: addressAttributeMap.prefix,
      middlename: addressAttributeMap.middlename,
      suffix: addressAttributeMap.suffix,
      company: addressAttributeMap.company,
      vatId: addressAttributeMap.vat_id,
      vatIsValid: addressAttributeMap.vat_is_valid,
      vatRequestId: addressAttributeMap.vat_request_id,
      vatRequestDate: addressAttributeMap.vat_request_date,
      vatRequestSuccess: addressAttributeMap.vat_request_succes,
    })

    return orderShippingAddress
  }

  // async resolveOrderShippingAddress(
  //   order: SalesFlatOrder,
  //   customerAddress: CustomerAddressEntityWithAttributeValues,
  // ): Promise<SalesFlatOrder> {
  //   const orderShippingAddress =
  //     await this._validateAndGetOrderShippingAddress(order)

  //   await this._customerAddressToOrderShippingAddress(
  //     orderShippingAddress,
  //     customerAddress,
  //   )

  //   return order
  // }
}
