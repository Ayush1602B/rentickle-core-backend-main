import { CatalogProductEntity } from '@/catalog/product/models/catalog-product-entity.model'
import { CatalogProductOptionTypeValue } from '@/catalog/product/models/catalog-product-option-type-value.model'
import { MAGENTO_PRODUCT_ATTRIBUTE_CODE } from '@/catalog/product/product.types'
import {
  CART_CHECKOUT_METHOD,
  CART_CONFIG_KEY,
  CART_ITEM_OPTION_CODE,
} from '@/checkout/cart/cart.types'
import { CoreConfigDataRepo } from '@/core/config/repo/core-config-data.repo'
import { CoreStore } from '@/core/store/models/core-store.model'
import {
  CustomerAddressEntity,
  CustomerAddressEntityWithAttributeValues,
} from '@/customer/customer/models/customer-address-entity.model'
import { CustomerEntity } from '@/customer/customer/models/customer-entity.model'
import { DEFAULT_STORE_VIEW_ID } from '@/database/db.types'
import { ADDRESS_TYPE } from '@/rmp/rmp.types'
import { MagentoRPCService } from '@/rpc/rpc.service'
import { MAGENTO_RPC_METHOD } from '@/rpc/rpc.types'
import { DEFAULT_CURRENCY_CODE } from '@/shared/shared.interface'
import { Injectable } from '@nestjs/common'
import { serialize } from 'php-serialize'
import { Op } from 'sequelize'
import { CheckoutCartOwnerException } from '../checkout/checkout.error'
import { PaymentMethod } from '../payment/payment.types'
import { ShippingMethod } from '../shipping/shipping.types'
import { AddToCartInputDto } from './api/dto/add-to-cart.dto'
import {
  CartItemSelectedOptionsDto,
  CartTotalItemDto,
} from './api/dto/common.dto'
import { CartCalculator } from './cart.calculator'
import {
  CartInvalidAddressException,
  CartInvalidException,
  CartInvalidProductException,
  CartNotFoundException,
} from './cart.error'
import { SalesFlatQuoteAddress } from './models/sales-flat-quote-address.model'
import { SalesFlatQuoteItemOption } from './models/sales-flat-quote-item-option.model'
import { SalesFlatQuoteItem } from './models/sales-flat-quote-item.model'
import { SalesFlatQuotePayment } from './models/sales-flat-quote-payment.model'
import { SalesFlatQuoteShippingRate } from './models/sales-flat-quote-shipping-rate.model'
import { SalesFlatQuote } from './models/sales-flat-quote.model'
import { SalesFlatQuoteRepo } from './repo/sales-flat-quote.repo'

interface ICartService {
  getById(cartId: number): Promise<SalesFlatQuote | null>

  validateAndGetById(cartId: number): Promise<SalesFlatQuote>

  validateCartForCheckout(cart: SalesFlatQuote): Promise<void>

  resolveCartOrCreate(
    quoteId: number | null,
    store: CoreStore,
  ): Promise<SalesFlatQuote>

  addItemToCart(params: {
    cart: SalesFlatQuote
    store: CoreStore
    dto: AddToCartInputDto
  }): Promise<SalesFlatQuoteItem>

  updateItemQuantity(
    cart: SalesFlatQuote,
    cartItem: SalesFlatQuoteItem,
    newQty: number,
  ): Promise<SalesFlatQuote>

  removeItemFromCart(
    cart: SalesFlatQuote,
    Item: SalesFlatQuoteItem,
  ): Promise<SalesFlatQuote>

  validateCartOwnership(
    cart: SalesFlatQuote,
    customer: CustomerEntity,
  ): Promise<void>

  applyShippingToCart: (
    cart: SalesFlatQuote,
    shippingMethod: ShippingMethod,
  ) => Promise<void>

  setBillingAddress: (
    cart: SalesFlatQuote,
    customerAddress: CustomerAddressEntity,
  ) => Promise<SalesFlatQuote>

  setShippingAddress: (
    cart: SalesFlatQuote,
    customerAddress: CustomerAddressEntity,
  ) => Promise<SalesFlatQuote>

  setPaymentMethodToCart: (
    cart: SalesFlatQuote,
    paymentMethod: PaymentMethod,
  ) => Promise<void>

  validateItemInCart: (
    cart: SalesFlatQuote,
    itemId: number,
  ) => SalesFlatQuoteItem

  applyCouponToCart(cart: SalesFlatQuote, couponCode: string): Promise<void>
  removeCouponFromCart(cart: SalesFlatQuote): Promise<void>
  assignCartToCustomer(
    cart: SalesFlatQuote,
    customer: CustomerEntity,
  ): Promise<void>

  collectTotals(cart: SalesFlatQuote): Promise<CartTotalItemDto[]>
}

@Injectable()
export class CartService implements ICartService {
  constructor(
    private readonly salesFlatQuoteRepo: SalesFlatQuoteRepo,
    private readonly cartCalculator: CartCalculator,
    private readonly coreConfigDataRepo: CoreConfigDataRepo,
    private readonly magentoRpcService: MagentoRPCService,
  ) {}

  getById(cartId: number): Promise<SalesFlatQuote | null> {
    return this.salesFlatQuoteRepo.findOneByPk(cartId.toString())
  }

  async validateAndGetById(cartId: number): Promise<SalesFlatQuote> {
    const cart =
      await this.salesFlatQuoteRepo.findCartWithItemsAndAddresses(cartId)
    if (!cart) {
      throw new CartNotFoundException(`Cart with ID ${cartId} not found`)
    }

    return cart
  }

  async validateCartForCheckout(cart: SalesFlatQuote): Promise<void> {
    const store = await cart.loadStore()
    const guestCheckoutEntry = await this.coreConfigDataRepo.findOne({
      where: {
        path: CART_CONFIG_KEY.ALLOW_GUEST_CHECKOUT,
        scopeId: {
          [Op.or]: [store.storeId, DEFAULT_STORE_VIEW_ID],
        },
      },
    })

    if (!guestCheckoutEntry || guestCheckoutEntry.value !== '1') {
      if (!cart.customerId || cart.customerIsGuest === 1) {
        throw new CartInvalidException(
          'Guest checkout is not allowed for this store.',
        )
      }
    }

    if (cart.isVirtual) {
      throw new CartInvalidException(
        'Cart is virtual and cannot be checked out.',
      )
    }

    if (cart.isMultiShipping) {
      throw new CartInvalidException(
        'Cart is set for multi-shipping and cannot be checked out.',
      )
    }

    if (cart.isActive === 0) {
      throw new CartInvalidException(
        'Cart is inactive and cannot be checked out.',
      )
    }

    if (cart.itemsCount === 0) {
      throw new CartInvalidException('Cart is empty and cannot be checked out.')
    }
  }

  async resolveCartOrCreate(
    cartId: number | null,
    store: CoreStore,
  ): Promise<SalesFlatQuote> {
    if (cartId) {
      const cart =
        await this.salesFlatQuoteRepo.findCartWithItemsAndAddresses(cartId)

      if (cart) {
        return cart
      }
    }

    const newCart = new SalesFlatQuote({
      storeId: store.storeId,
      isActive: 1,
      isVirtual: 0,
      isMultiShipping: 0,
      itemsCount: 0,
      itemsQty: 0,
      storeToBaseRate: 1,
      storeToQuoteRate: 1,
      baseCurrencyCode: DEFAULT_CURRENCY_CODE,
      storeCurrencyCode: DEFAULT_CURRENCY_CODE,
      quoteCurrencyCode: DEFAULT_CURRENCY_CODE,
      grandTotal: 0,
      baseGrandTotal: 0,
      checkoutMethod: CART_CHECKOUT_METHOD.GUEST,
      customerId: null,
      customerTaxClassId: null,
      customerGroupId: null,
      customerEmail: null,
      customerPrefix: null,
      customerFirstname: null,
      customerMiddlename: null,
      customerLastname: null,
      customerSuffix: null,
      customerDob: null,
      customerNote: null,
      customerNoteNotify: 1,
      customerIsGuest: 1,
      remoteIp: null,
      appliedRuleIds: null,
      reservedOrderId: null,
      passwordHash: null,
      couponCode: null,
      globalCurrencyCode: DEFAULT_CURRENCY_CODE,
      baseToGlobalRate: 1,
      origOrderId: 0,
      subtotal: 0,
      baseSubtotal: 0,
      triggerRecollect: 0,
      isPersistent: 0,
    })

    newCart.SalesFlatQuoteAddresses = this._createCartAddresses(newCart)
    newCart.SalesFlatQuotePayment = await this._createFlatQuotePayment(newCart)
    newCart.SalesFlatQuoteItems = []
    newCart.setStore(store)

    await this._collectCartTotals(newCart)

    return newCart
  }

  private _createFlatQuotePayment(
    cart: SalesFlatQuote,
  ): Promise<SalesFlatQuotePayment> {
    const cartPayment = new SalesFlatQuotePayment({
      quoteId: cart.entityId,
      method: 'checkmo',
      ccExpMonth: 0,
      ccExpYear: 0,
      ccSsStartMonth: 0,
      ccSsStartYear: 0,
    })

    return Promise.resolve(cartPayment)
  }

  private async _findMatchingCartItem(
    items: SalesFlatQuoteItem[],
    normalizedOptions: string,
  ): Promise<SalesFlatQuoteItem | null> {
    for (const item of items) {
      const serialized = await item.serializeProductOptions()
      if (serialized === normalizedOptions) {
        return item
      }
    }
    return null
  }

  async addItemToCart(params: {
    cart: SalesFlatQuote
    product: CatalogProductEntity
    childProduct: CatalogProductEntity | null
    store: CoreStore
    dto: AddToCartInputDto
  }): Promise<SalesFlatQuoteItem> {
    const { cart, dto, product, childProduct } = params
    const normalizeOptions = (options: CartItemSelectedOptionsDto): string => {
      const sortedKeys = Object.keys(options).sort()
      const normalized = sortedKeys.reduce((acc, key) => {
        acc[key] = options[key]
        return acc
      }, {} as CartItemSelectedOptionsDto)
      return JSON.stringify(normalized)
    }

    const { qty, selectedOptions } = dto
    const addedProductItems = cart.SalesFlatQuoteItems.filter(
      (item) => item.productId === product.entityId,
    )

    const normalizedOptions = normalizeOptions(selectedOptions)
    const existingItem = await this._findMatchingCartItem(
      addedProductItems,
      normalizedOptions,
    )

    let cartItem: SalesFlatQuoteItem
    if (existingItem) {
      cartItem = existingItem
      cartItem.qty = Number(cartItem.qty) + Number(qty)

      const product = await existingItem.getCatalogProductEntity()
      cartItem.CatalogProductEntity = product

      await this.cartCalculator.calculateCart(cart)
      await this._collectCartTotals(cart)

      return cartItem
    }

    cartItem = await this._createCartItem(cart, product, childProduct, qty)

    cartItem.SalesFlatQuoteItemOptions = this._createCartItemOptions(dto)
    cart.SalesFlatQuoteItems = cart.SalesFlatQuoteItems
      ? [...cart.SalesFlatQuoteItems, cartItem]
      : [cartItem]

    cartItem.sku = await this.appendOptionSkusToProductSku(cartItem, product)
    cartItem.CatalogProductEntity = product

    await this.cartCalculator.calculateCart(cart)
    await this._collectCartTotals(cart)
    return cartItem
  }

  /**
   * Creates a new SalesFlatQuoteItem using product data.
   */
  private async _createCartItem(
    cart: SalesFlatQuote,
    product: CatalogProductEntity,
    childProduct: CatalogProductEntity | null,
    qty: number,
  ): Promise<SalesFlatQuoteItem> {
    const productAttributes = await product.getAttributes()
    await product.loadAttributeValues()

    const productNameAttribute = productAttributes.find(
      (attr) => attr.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.NAME,
    )
    const productPriceAttribute = productAttributes.find(
      (attr) => attr.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.PRICE,
    )
    const [productName, productBasePrice] = await Promise.all([
      product.getVarcharAttributeValue(productNameAttribute!.attributeId),
      product.getDecimalAttributeValue(productPriceAttribute!.attributeId),
    ])

    return new SalesFlatQuoteItem({
      quoteId: 0,
      productId: product.entityId,
      storeId: cart.storeId,
      parentItemId: null,
      isVirtual: 0,
      sku: product.sku,
      name: productName,
      freeShipping: 0,
      isQtyDecimal: 0,
      noDiscount: 0,
      weight: 0,
      qty,
      price: Number(productBasePrice) || 0,
      basePrice: Number(productBasePrice) || 0,
      customPrice: null,
      discountPercent: 0,
      discountAmount: 0,
      baseDiscountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      baseTaxAmount: 0,
      rowTotal: 0,
      baseRowTotal: 0,
      rowTotalWithDiscount: 0,
      rowWeight: 0,
      productType: product.typeId,
      priceInclTax: 0,
      basePriceInclTax: 0,
      rowTotalInclTax: 0,
      baseRowTotalInclTax: 0,
      hiddenTaxAmount: 0,
      baseHiddenTaxAmount: 0,
      weeeTaxDisposition: 0,
      weeeTaxRowDisposition: 0,
      baseWeeeTaxDisposition: 0,
      baseWeeeTaxRowDisposition: 0,
      weeeTaxApplied: null,
      weeeTaxAppliedAmount: 0,
      weeeTaxAppliedRowAmount: 0,
      baseWeeeTaxAppliedAmount: 0,
      baseWeeeTaxAppliedRowAmnt: 0,
      refundableDeposit: 0,
      baseRefundableDeposit: 0,
      depositDiscount: 0,
      baseDepositDiscount: 0,
      depositDiscountPercent: 0,
    })
  }

  /**
   * Replicates Magento 1's URL encoding.
   * Base64 encodes the input, then replaces '+' with '-', '/' with '_', and '=' with ','.
   */
  private magentoUrlEncode(input: string): string {
    const base64Encoded = Buffer.from(input, 'utf8').toString('base64')
    return base64Encoded
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, ',')
  }

  /**
   * Generates a jQuery-style JSONP callback string.
   * Format: "jQuery" + random number + "_" + current timestamp.
   */
  private generateJQueryCallback(): string {
    const randomPart = Math.floor(Math.random() * 1000000000000) // e.g., 12-digit random number
    const timestamp = Date.now()
    return `jQuery${randomPart}_${timestamp}`
  }

  /**
   * Creates SalesFlatQuoteItemOptions from the selected options.
   */
  private _createCartItemOptions({
    productId,
    qty,
    selectedOptions,
    currentUrl,
  }: AddToCartInputDto): SalesFlatQuoteItemOption[] {
    const optionIdsOption = new SalesFlatQuoteItemOption({
      itemId: 0,
      productId,
      code: CART_ITEM_OPTION_CODE.OPTION_IDS,
      value: Object.keys(selectedOptions).join(','),
    })
    const optionsList = Object.entries(selectedOptions).map(
      ([optionId, optionValue]) =>
        new SalesFlatQuoteItemOption({
          itemId: 0,
          productId,
          code: `option_${optionId}`,
          value: optionValue,
        }),
    )

    const uenc = this.magentoUrlEncode(currentUrl || '')
    const callback = this.generateJQueryCallback()
    const timestamp = Date.now().toString()

    const buyRequestData = {
      uenc,
      product: productId.toString(),
      form_key: '1HxF6Xz50GXNIbVZ', // to change to obtain from session or configuration.
      callback,
      options: selectedOptions,
      _: timestamp,
      qty: qty,
    }

    const serializedBuyRequest = serialize(buyRequestData)
    // Create the info_buyRequest option entry.
    const infoBuyRequestOption = new SalesFlatQuoteItemOption({
      itemId: 0,
      productId,
      code: CART_ITEM_OPTION_CODE.INFO_BUY_REQUEST,
      value: serializedBuyRequest,
    })

    return [infoBuyRequestOption, optionIdsOption, ...optionsList]
  }

  /**
   * Creates or resets cart addresses for shipping and billing.
   */
  private _createCartAddresses(cart: SalesFlatQuote): SalesFlatQuoteAddress[] {
    const baseAddressData = {
      quoteId: cart.entityId,
      customerId: cart.customerId,
      saveInAddressBook: 0,
      email: null,
      prefix: null,
      firstname: null,
      middlename: null,
      lastname: null,
      suffix: null,
      company: null,
      street: null,
      city: null,
      region: null,
      regionId: null,
      postcode: null,
      countryId: null,
      telephone: null,
      fax: null,
      cityId: null,
      sameAsBilling: 0,
      freeShipping: 0,
      collectShippingRates: 0,
      shippingMethod: null,
      shippingDescription: null,
      weight: 0,
      subtotal: 0,
      baseSubtotal: 0,
      subtotalWithDiscount: 0,
      baseSubtotalWithDiscount: 0,
      taxAmount: 0,
      baseTaxAmount: 0,
      shippingAmount: 0,
      baseShippingAmount: 0,
      shippingTaxAmount: 0,
      baseShippingTaxAmount: 0,
      discountAmount: 0,
      baseDiscountAmount: 0,
      grandTotal: 0,
      baseGrandTotal: 0,
      customerNotes: null,
      appliedTaxes: null,
      discountDescription: null,
      shippingDiscountAmount: 0,
      baseShippingDiscountAmount: 0,
      subtotalInclTax: 0,
      baseSubtotalTotalInclTax: 0,
      hiddenTaxAmount: 0,
      baseHiddenTaxAmount: 0,
      shippingHiddenTaxAmount: 0,
      baseShippingHiddenTaxAmnt: 0,
      shippingInclTax: 0,
      baseShippingInclTax: 0,
      vatId: null,
      vatIsValid: null,
      vatRequestId: null,
      vatRequestDate: null,
      vatRequestSuccess: null,
      giftMessageId: null,
      creditpointAmount: 0,
      baseCreditpointAmount: 0,
      refundableDeposit: 0,
      baseRefundableDeposit: 0,
      depositDiscount: 0,
      baseDepositDiscount: 0,
    }

    const shippingAddress = new SalesFlatQuoteAddress({
      ...baseAddressData,
      addressType: ADDRESS_TYPE.SHIPPING,
    })
    const billingAddress = new SalesFlatQuoteAddress({
      ...baseAddressData,
      addressType: ADDRESS_TYPE.BILLING,
    })

    const shippingRate = new SalesFlatQuoteShippingRate()

    shippingAddress.SalesFlatQuoteShippingRate = shippingRate
    shippingRate.SalesFlatQuoteAddress = shippingAddress

    return [shippingAddress, billingAddress]
  }

  /**
   * Appends the SKUs from selected options (if available) to the base product SKU.
   * Iterates over each quote item option starting with "option_", retrieves the corresponding
   * product option's type value, and if it has a SKU, appends it.
   */
  private async appendOptionSkusToProductSku(
    cartItem: SalesFlatQuoteItem,
    product: CatalogProductEntity,
  ): Promise<string> {
    let finalSku = product.sku
    // Retrieve the product options (including option type values).
    const productOptions = await product.getCatalogProductOptions({
      include: [
        {
          model: CatalogProductOptionTypeValue,
        },
      ],
    })

    for (const optionEntry of cartItem.SalesFlatQuoteItemOptions) {
      if (optionEntry.code.startsWith('option_')) {
        const optionId = parseInt(optionEntry.code.split('_')[1], 10)
        const selectedValue = optionEntry.value
        // Find the matching product option.
        const prodOption = productOptions.find(
          (opt) => opt.optionId === optionId,
        )
        if (!prodOption) {
          continue
        }
        // Retrieve the option type values.
        const typeValues = await prodOption.getCatalogProductOptionTypeValues()
        // Look for the type value that matches the selected value (assumed to be numeric).
        const selectedTypeValue = typeValues.find(
          (tv) => tv.optionTypeId === parseInt(selectedValue, 10),
        )
        if (selectedTypeValue && selectedTypeValue.sku) {
          finalSku += '-' + selectedTypeValue.sku
        }
      }
    }
    return finalSku
  }

  validateItemInCart(cart: SalesFlatQuote, itemId: number): SalesFlatQuoteItem {
    const cartItems = cart.SalesFlatQuoteItems

    const item = cartItems.find((i) => i.itemId === itemId)
    if (!item) {
      throw new CartInvalidProductException(
        `Item with ID ${itemId} not found in cart`,
      )
    }
    return item
  }

  async updateItemQuantity(
    cart: SalesFlatQuote,
    cartItem: SalesFlatQuoteItem,
    newQty: number,
  ): Promise<SalesFlatQuote> {
    if (newQty <= 0) {
      throw new CartInvalidProductException(
        'Quantity must be greater than zero',
      )
    }

    cartItem.qty = newQty
    await this.cartCalculator.calculateCart(cart)
    await this._collectCartTotals(cart)
    return cart
  }

  async removeItemFromCart(
    cart: SalesFlatQuote,
    cartItem: SalesFlatQuoteItem,
  ): Promise<SalesFlatQuote> {
    const itemToRemove = cart.SalesFlatQuoteItems.find(
      (i) => i.itemId === cartItem.itemId,
    )
    if (!itemToRemove) {
      throw new CartInvalidProductException(
        `Item with ID ${cartItem.itemId} not found in cart`,
      )
    }

    cart.SalesFlatQuoteItems = cart.SalesFlatQuoteItems.filter(
      (i) => i.itemId !== cartItem.itemId,
    )
    await itemToRemove.destroy()
    await this.cartCalculator.calculateCart(cart)
    await this._collectCartTotals(cart)

    return cart
  }

  async applyShippingToCart(
    cart: SalesFlatQuote,
    shippingMethod: ShippingMethod,
  ): Promise<void> {
    const shippingAddress = cart.SalesFlatQuoteAddresses.find(
      (address) => address.addressType === ADDRESS_TYPE.SHIPPING,
    )
    if (!shippingAddress) {
      throw new CartInvalidAddressException('Shipping address not found.')
    }

    const cartShippingRate = await this.assignShippingRate(
      shippingAddress,
      shippingMethod,
    )

    shippingAddress.shippingMethod = cartShippingRate.method
    shippingAddress.shippingDescription = shippingMethod.description
    shippingAddress.SalesFlatQuoteShippingRate = cartShippingRate

    if (shippingMethod.isFreeShipping()) {
      shippingAddress.freeShipping = 1
    }

    await this.cartCalculator.calculateCart(cart)
    await this._collectCartTotals(cart)
  }

  private async assignShippingRate(
    shippingAddress: SalesFlatQuoteAddress,
    shippingMethod: ShippingMethod,
  ): Promise<SalesFlatQuoteShippingRate> {
    const cartShippingRate =
      await shippingAddress.getSalesFlatQuoteShippingRate()

    cartShippingRate.code = shippingMethod.code
    cartShippingRate.carrier = shippingMethod.code
    cartShippingRate.carrierTitle = shippingMethod.description
    cartShippingRate.method = `${shippingMethod.code}_${shippingMethod.code}`
    cartShippingRate.methodDescription = shippingMethod.description
    cartShippingRate.price = await shippingMethod.calculate()
    cartShippingRate.errorMessage = null
    cartShippingRate.methodTitle = null

    return cartShippingRate
  }

  validateCartOwnership(
    cart: SalesFlatQuote,
    customer: CustomerEntity,
  ): Promise<void> {
    if (String(cart.customerId) !== String(customer.entityId)) {
      throw new CheckoutCartOwnerException(
        `Cart with ID ${cart.entityId} does not belong to customer! `,
      )
    }

    return Promise.resolve()
  }

  private async _customerAddressToCartAddress(
    customerAddress: CustomerAddressEntityWithAttributeValues,
    cartAddress?: SalesFlatQuoteAddress,
  ): Promise<SalesFlatQuoteAddress> {
    if (!cartAddress) {
      cartAddress = new SalesFlatQuoteAddress()
    }

    const addressAttributeMap = await customerAddress.getAttributesMap()
    cartAddress.setAttributes({
      prefix: addressAttributeMap.prefix,
      suffix: addressAttributeMap.suffix,
      firstname: addressAttributeMap.firstname,
      middlename: addressAttributeMap.middlename,
      lastname: addressAttributeMap.lastname,
      city: addressAttributeMap.city,
      cityId: addressAttributeMap.city_id,
      region: addressAttributeMap.region,
      regionId: addressAttributeMap.region_id,
      postcode: addressAttributeMap.postcode,
      countryId: addressAttributeMap.country_id,
      telephone: addressAttributeMap.telephone,
      fax: addressAttributeMap.fax,
      vatId: addressAttributeMap.vat_id,
    })

    cartAddress.customerAddressId = customerAddress.entityId
    cartAddress.customerId = customerAddress.parentId

    return cartAddress
  }

  async setBillingAddress(
    cart: SalesFlatQuote,
    customerAddress: CustomerAddressEntityWithAttributeValues,
  ): Promise<SalesFlatQuote> {
    const billingAddress = cart.SalesFlatQuoteAddresses.find(
      (addr) => addr.addressType === ADDRESS_TYPE.BILLING,
    )

    if (!billingAddress) {
      throw new CartInvalidAddressException('Billing address not found.')
    }

    const updatedBillingAddress = await this._customerAddressToCartAddress(
      customerAddress,
      billingAddress,
    )

    updatedBillingAddress.addressType = ADDRESS_TYPE.BILLING

    if (updatedBillingAddress.isNewRecord) {
      updatedBillingAddress.quoteId = cart.entityId
      cart.SalesFlatQuoteAddresses.push(updatedBillingAddress)
    }

    return cart
  }

  async setShippingAddress(
    cart: SalesFlatQuote,
    customerAddress: CustomerAddressEntityWithAttributeValues,
  ): Promise<SalesFlatQuote> {
    const shippingAddress = cart.SalesFlatQuoteAddresses.find(
      (addr) => addr.addressType === ADDRESS_TYPE.SHIPPING,
    )

    if (!shippingAddress) {
      throw new CartInvalidAddressException('Shipping address not found.')
    }

    const updatedShippingAddress = await this._customerAddressToCartAddress(
      customerAddress,
      shippingAddress,
    )

    updatedShippingAddress.addressType = ADDRESS_TYPE.SHIPPING

    if (updatedShippingAddress.isNewRecord) {
      updatedShippingAddress.quoteId = cart.entityId
      cart.SalesFlatQuoteAddresses.push(updatedShippingAddress)
    }

    cart.customerPrefix = updatedShippingAddress.prefix
    cart.customerFirstname = updatedShippingAddress.firstname
    cart.customerMiddlename = updatedShippingAddress.middlename
    cart.customerLastname = updatedShippingAddress.lastname
    cart.customerSuffix = updatedShippingAddress.suffix
    cart.customerNote = updatedShippingAddress.customerNotes

    return cart
  }

  async setPaymentMethodToCart(
    cart: SalesFlatQuote,
    paymentMethod: PaymentMethod,
  ): Promise<void> {
    const cartPayment = new SalesFlatQuotePayment({
      quoteId: cart.entityId,
      method: paymentMethod.code,
    })

    cart.SalesFlatQuotePayment = cartPayment
    await this.cartCalculator.calculateCart(cart)
    await this._collectCartTotals(cart)
  }

  async _collectCartTotals(cart: SalesFlatQuote): Promise<CartTotalItemDto[]> {
    cart.triggerRecollect = 1
    await cart.save()

    const res = await this.magentoRpcService.call(
      MAGENTO_RPC_METHOD.CART_TOTALS,
      [cart.entityId],
    )

    return res as CartTotalItemDto[]
  }

  async applyCouponToCart(
    cart: SalesFlatQuote,
    couponCode: string,
  ): Promise<void> {
    await this.magentoRpcService.call(MAGENTO_RPC_METHOD.CART_COUPON_ADD, [
      cart.entityId,
      couponCode,
    ])
  }

  async removeCouponFromCart(cart: SalesFlatQuote): Promise<void> {
    await this.magentoRpcService.call(MAGENTO_RPC_METHOD.CART_COUPON_REMOVE, [
      cart.entityId,
    ])
  }

  async assignCartToCustomer(
    cart: SalesFlatQuote,
    customer: CustomerEntity,
  ): Promise<void> {
    if (cart.customerId && cart.customerId !== customer.entityId) {
      throw new CheckoutCartOwnerException(
        `Cart with ID ${cart.entityId} is already assigned to another customer!`,
      )
    }

    const customerAttributes = await customer.getAttributesMap()
    await this.salesFlatQuoteRepo.updateMany(
      {
        isActive: String(0),
      },
      {
        where: {
          entityId: {
            [Op.ne]: cart.entityId,
          },
          customerId: customer.entityId.toString(),
        },
      },
    )

    const res = await this.magentoRpcService.call(
      MAGENTO_RPC_METHOD.CART_SET_CUSTOMER,
      [
        cart.entityId,
        {
          customer_id: customer.entityId,
          mode: 'customer',
        },
      ],
    )

    await this.salesFlatQuoteRepo.updateMany(
      {
        customerIsGuest: String(0),
        isActive: String(1),
        customerId: customer.entityId.toString(),
        customerEmail: customer.email!,
        customerFirstname: customerAttributes.firstname!,
        customerLastname: customerAttributes.lastname!,
        customerMiddlename: customerAttributes.middlename!,
      },
      {
        where: {
          entityId: cart.entityId.toString(),
        },
      },
    )

    return res
  }

  collectTotals(cart: SalesFlatQuote): Promise<CartTotalItemDto[]> {
    return this._collectCartTotals(cart)
  }
}
