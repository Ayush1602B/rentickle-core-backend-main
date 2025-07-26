import { CatalogProductOptionTypePrice } from '@/catalog/product/models/catalog-product-option-type-price.model'
import { CatalogProductOptionTypeValue } from '@/catalog/product/models/catalog-product-option-type-value.model'
import { CartInvalidProductException } from '@/checkout/cart/cart.error'
import { CART_ITEM_OPTION_CODE } from '@/checkout/cart/cart.types'
import { ADDRESS_TYPE } from '@/rmp/rmp.types'
import { Injectable } from '@nestjs/common'
import { SalesFlatQuoteItem } from './models/sales-flat-quote-item.model'
import { SalesFlatQuote } from './models/sales-flat-quote.model'
import { DEFAULT_STORE_VIEW_ID } from '@/database/db.types'

interface ICartCalculator {
  /**
   * Calculates fees specific to the quote item (e.g., rent, deposit, etc.).
   */
  calculateItemFees(cartItem: SalesFlatQuoteItem): Promise<void>

  /**
   * Applies discounts (e.g., promotional or coupon-based) to the cart.
   */
  calculateDiscounts(cart: SalesFlatQuote): void

  /**
   * Calculates shipping costs based on the cart items and updates the shipping address.
   */
  calculateShipping(cart: SalesFlatQuote): void

  /**
   * Aggregates all fees, discounts, shipping, and taxes to compute the final totals.
   */
  calculateTotals(cart: SalesFlatQuote): void

  /**
   * Orchestrates the complete pricing pipeline in the proper order.
   */
  calculateCart(cart: SalesFlatQuote): Promise<void>
}

@Injectable()
export class CartCalculator implements ICartCalculator {
  /**
   * Calculates fees specific to the quote item (e.g., rent, deposit, etc.).
   */
  async calculateItemFees(cartItem: SalesFlatQuoteItem): Promise<void> {
    const product = cartItem.CatalogProductEntity
    const options = cartItem.SalesFlatQuoteItemOptions

    const { price: basePrice } = await product.resolveAttributeMapForStore(
      cartItem.storeId || DEFAULT_STORE_VIEW_ID,
    )

    // Retrieve complete product option data including values and prices.
    const productOptions = await product.getCatalogProductOptions({
      include: [
        {
          model: CatalogProductOptionTypeValue,
          include: [{ model: CatalogProductOptionTypePrice }],
        },
      ],
    })

    // Retrieve selected option IDs.
    const [selectedOptionsEntry] = options.filter(
      (opt) => opt.code === CART_ITEM_OPTION_CODE.OPTION_IDS,
    )
    const selectedOptionIds = selectedOptionsEntry.value.split(',')

    let additionalPrice = 0
    let totalDeposit = 0

    await Promise.all(
      selectedOptionIds.map(async (optionId) => {
        const prodOption = productOptions.find(
          (opt) => opt.optionId === parseInt(optionId, 10),
        )
        const selectedValueOption = options.find(
          (opt) => opt.code === `option_${optionId}`,
        )

        if (!prodOption || !selectedValueOption) {
          throw new CartInvalidProductException(
            `Invalid option selected for product ID ${product.entityId}`,
          )
        }

        // Retrieve available option values.
        const optionTypeValues =
          await prodOption.getCatalogProductOptionTypeValues()
        const selectedTypeValue = optionTypeValues.find(
          (typeValue) =>
            typeValue.optionTypeId === parseInt(selectedValueOption.value, 10),
        )

        if (!selectedTypeValue) {
          throw new CartInvalidProductException(
            `Invalid option value for product ID ${product.entityId}`,
          )
        }

        // Get the price associated with the selected option value.
        const prices =
          await selectedTypeValue.getCatalogProductOptionTypePrices()
        // Get deposit information (assumed to be the first deposit record).
        const depositData =
          await selectedTypeValue.getAvaCatalogProductEntityDeposits()

        const priceEntry = (prices || []).find(
          (entry) =>
            entry.optionTypeId === parseInt(selectedValueOption.value, 10),
        )

        additionalPrice += Number(priceEntry?.price || 0)
        totalDeposit += Number(depositData?.[0]?.value || 0)
      }),
    )

    // Update the cart item with additional fees.
    cartItem.price = Number(basePrice) + additionalPrice
    cartItem.basePrice = Number(basePrice) + additionalPrice

    cartItem.refundableDeposit = totalDeposit
    cartItem.baseRefundableDeposit = totalDeposit
  }

  /**
   * Applies discounts to the cart.
   * You can implement complex discount logic here (e.g., coupons, promotions, etc.).
   * For now, this is a stub that can be extended later.
   */
  calculateDiscounts(): void {
    // Example: Implement discount logic based on cart subtotal or item-level criteria.
    // For demonstration, no discount is applied.
  }

  /**
   * Calculates shipping costs based on the cart items and updates the shipping address.
   */
  calculateShipping(cart: SalesFlatQuote): void {
    const shippingAddress = cart.SalesFlatQuoteAddresses.find(
      (addr) => addr.addressType === ADDRESS_TYPE.SHIPPING,
    )
    if (!shippingAddress) {
      return
    }

    // Reset shipping address values before accumulating (if needed)
    shippingAddress.taxAmount = 0
    shippingAddress.baseTaxAmount = 0
    shippingAddress.refundableDeposit = 0
    shippingAddress.baseRefundableDeposit = 0
    shippingAddress.subtotal = 0
    shippingAddress.baseSubtotal = 0

    const cartShippingRate = shippingAddress.SalesFlatQuoteShippingRate
    if (!cartShippingRate) {
      return
    }

    shippingAddress.shippingAmount = Number(cartShippingRate.price || 0)
    shippingAddress.baseShippingAmount = Number(cartShippingRate.price || 0)
    shippingAddress.shippingTaxAmount = 0
    shippingAddress.baseShippingTaxAmount = 0
    shippingAddress.shippingDiscountAmount = 0
    shippingAddress.baseShippingDiscountAmount = 0
    shippingAddress.shippingHiddenTaxAmount = 0
    shippingAddress.baseShippingHiddenTaxAmnt = 0
    shippingAddress.shippingInclTax = Number(cartShippingRate.price || 0)
    shippingAddress.baseShippingInclTax = Number(cartShippingRate.price || 0)

    cart.SalesFlatQuoteItems.forEach((item) => {
      // Sum tax amounts (assuming item.taxAmount is the row tax amount)
      shippingAddress.taxAmount += Number(item.taxAmount)
      shippingAddress.baseTaxAmount += Number(item.baseTaxAmount)

      // Sum deposits multiplied by quantity
      shippingAddress.refundableDeposit +=
        Number(item.refundableDeposit) * Number(item.qty)
      shippingAddress.baseRefundableDeposit +=
        Number(item.baseRefundableDeposit) * Number(item.qty)

      // Sum subtotals (price * qty)
      shippingAddress.subtotal += Number(item.price) * Number(item.qty)
      shippingAddress.baseSubtotal += Number(item.basePrice) * Number(item.qty)
    })

    // Calculate subtotal including tax.
    shippingAddress.subtotalInclTax =
      shippingAddress.subtotal +
      shippingAddress.taxAmount +
      shippingAddress.shippingInclTax

    shippingAddress.baseSubtotalTotalInclTax =
      shippingAddress.baseSubtotal +
      shippingAddress.baseTaxAmount +
      shippingAddress.baseShippingInclTax

    // Grand total = subtotal including tax plus deposits.
    shippingAddress.grandTotal =
      shippingAddress.subtotalInclTax +
      shippingAddress.refundableDeposit +
      shippingAddress.shippingAmount

    shippingAddress.baseGrandTotal =
      shippingAddress.baseSubtotalTotalInclTax +
      shippingAddress.baseRefundableDeposit +
      shippingAddress.baseShippingAmount
  }

  /**
   * Aggregates all fees, discounts, shipping, and taxes to compute final totals.
   */
  calculateTotals(cart: SalesFlatQuote): void {
    let subtotal = 0
    let baseSubtotal = 0
    let totalTax = 0
    let totalBaseTax = 0
    let totalDeposit = 0
    let totalBaseDeposit = 0
    let shippingCost = 0

    const shippingAddress = cart.SalesFlatQuoteAddresses.find(
      (addr) => addr.addressType === ADDRESS_TYPE.SHIPPING,
    )
    if (shippingAddress) {
      shippingCost = shippingAddress.shippingAmount
    }

    cart.SalesFlatQuoteItems.forEach((item) => {
      this.calculateRowTotal(item)

      subtotal += Number(item.rowTotal)
      baseSubtotal += Number(item.baseRowTotal)
      totalTax += Number(item.taxAmount)
      totalBaseTax += Number(item.baseTaxAmount)
      totalDeposit += Number(item.refundableDeposit) * Number(item.qty)
      totalBaseDeposit += Number(item.baseRefundableDeposit) * Number(item.qty)
    })

    cart.subtotal = subtotal
    cart.baseSubtotal = baseSubtotal
    cart.grandTotal = subtotal + totalTax + totalDeposit + shippingCost
    cart.baseGrandTotal =
      baseSubtotal + totalBaseTax + totalBaseDeposit + shippingCost

    cart.itemsCount = cart.SalesFlatQuoteItems.length
    cart.itemsQty = cart.SalesFlatQuoteItems.reduce(
      (sum, item) => sum + Number(item.qty),
      0,
    )
  }

  /**
   * Calculates per-item totals (with and without tax).
   */
  private calculateRowTotal(cartItem: SalesFlatQuoteItem): void {
    cartItem.priceInclTax =
      Number(cartItem.price) + Number(cartItem.taxAmount) / Number(cartItem.qty)

    cartItem.basePriceInclTax =
      Number(cartItem.basePrice) +
      Number(cartItem.baseTaxAmount) / Number(cartItem.qty)

    cartItem.rowTotalInclTax =
      Number(cartItem.price) * Number(cartItem.qty) + Number(cartItem.taxAmount)

    cartItem.baseRowTotalInclTax =
      Number(cartItem.basePrice) * Number(cartItem.qty) +
      Number(cartItem.baseTaxAmount)

    cartItem.rowTotal = Number(cartItem.price) * Number(cartItem.qty)

    cartItem.baseRowTotal = Number(cartItem.basePrice) * Number(cartItem.qty)
  }

  /**
   * Orchestrates the complete pricing pipeline in the proper order.
   */
  async calculateCart(cart: SalesFlatQuote): Promise<void> {
    // 1. Calculate item-level fees for each quote item.
    for (const item of cart.SalesFlatQuoteItems) {
      await this.calculateItemFees(item)
    }
    // 2. Apply discounts to the cart.
    // this.calculateDiscounts(cart)
    // 3. Calculate shipping costs.
    this.calculateShipping(cart)
    // 4. Aggregate totals for the cart.
    this.calculateTotals(cart)
    // //5. Calculate shipping cost
    // this.calculateShippingCost(cart)
  }
}
