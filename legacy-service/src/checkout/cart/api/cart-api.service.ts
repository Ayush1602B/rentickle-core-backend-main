import { CatalogProductEntity } from '@/catalog/product/models/catalog-product-entity.model'
import { ProductService } from '@/catalog/product/product.service'
import { MAGENTO_PRODUCT_TYPE_ID } from '@/catalog/product/product.types'
import { StoreService } from '@/core/store/store.service'
import { Injectable } from '@nestjs/common'
import { CartInvalidProductException } from '../cart.error'

import { ShippingService } from '@/checkout/shipping/shipping.service'
import { CustomerService } from '@/customer/customer/customer.service'
import { CustomerEntity } from '@/customer/customer/models/customer-entity.model'
import { ADDRESS_TYPE } from '@/rmp/rmp.types'
import { CartService } from '../cart.service'
import { AddToCartInputDto, AddToCartOutputDto } from './dto/add-to-cart.dto'
import {
  ApplyCouponToCartInputDto,
  ApplyCouponToCartOutputDto,
} from './dto/apply-coupon-to-cart.dto'
import { CartDto } from './dto/common.dto'
import { GetCartByIdOutputDto } from './dto/get-cart-by-id.dto'
import {
  RemoveCouponFromCartInputDto,
  RemoveCouponFromCartOutputDto,
} from './dto/remove-coupon-from-cart.dto'
import {
  RemoveFromCartInputDto,
  RemoveFromCartOutputDto,
} from './dto/remove-from-cart.dto'
import {
  UpdateItemQtyInputDto,
  UpdateItemQtyOutputDto,
} from './dto/update-item-qty.dto'
import { ClaimCartInputDto, ClaimCartOutputDto } from './dto/claim-cart.dto'
import { CatalogHelper } from '@/catalog/catalog.helper'

interface ICartApiService {
  addToCart(dto: AddToCartInputDto): Promise<AddToCartOutputDto>

  getCartDetails(cartId: number): Promise<GetCartByIdOutputDto>

  updateCartItemQuantity(
    params: UpdateItemQtyInputDto,
  ): Promise<UpdateItemQtyOutputDto>

  removeCartItem(
    params: RemoveFromCartInputDto,
  ): Promise<RemoveFromCartOutputDto>

  applyCouponToCart(
    params: ApplyCouponToCartInputDto,
  ): Promise<ApplyCouponToCartOutputDto>

  removeCouponFromCart(
    params: RemoveCouponFromCartInputDto,
  ): Promise<RemoveCouponFromCartOutputDto>
}

@Injectable()
export class CartApiService implements ICartApiService {
  constructor(
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
    private readonly cartService: CartService,
    private readonly customerService: CustomerService,
    private readonly shippingService: ShippingService,
    private readonly catalogHelper: CatalogHelper,
  ) {}

  /**
   * Adds a product to the cart. If a quoteId exists, the product is updated;
   * otherwise, a new cart is created. After updating the cart, pricing is calculated
   * using the CartCalculator.
   */
  async addToCart(dto: AddToCartInputDto): Promise<AddToCartOutputDto> {
    const {
      productId,
      childProductId,
      cartId,
      storeId,
      customerId,
      selectedOptions,
    } = dto

    let customer: CustomerEntity | null = null
    if (customerId) {
      customer =
        await this.customerService.validateAndGetCustomerById(customerId)
    }

    const [store, product] = await Promise.all([
      this.storeService.validateAndGetStoreById(storeId),
      this.productService.validateAndGetById(productId),
    ])

    // For configurable products, ensure the child product exists.
    let childProduct: CatalogProductEntity | null = null
    if (product.typeId === MAGENTO_PRODUCT_TYPE_ID.CONFIGURABLE) {
      if (!childProductId) {
        throw new CartInvalidProductException(
          'Child product ID is required for configurable product',
        )
      }

      childProduct =
        await this.productService.validateAndGetById(childProductId)
    }

    await this.productService.validateSelectedOptions(
      product,
      childProduct,
      selectedOptions,
    )

    // Resolve an existing cart or create a new one.
    const cart = await this.cartService.resolveCartOrCreate(cartId, store)
    if (customer) {
      cart.setCustomer(customer)
    }

    const addedItem = await this.cartService.addItemToCart({
      cart,
      product,
      childProduct,
      store,
      dto,
    })

    await cart.save()
    return { itemId: addedItem.itemId, cartId: cart.entityId }
  }

  async updateCartItemQuantity(
    dto: UpdateItemQtyInputDto,
  ): Promise<UpdateItemQtyOutputDto> {
    const { cartId, itemId, newQty } = dto

    // Retrieve the cart by cartId
    const cart = await this.cartService.validateAndGetById(cartId)
    const validCartItem = this.cartService.validateItemInCart(cart, itemId)

    await this.cartService.updateItemQuantity(cart, validCartItem, newQty)

    // Persist updated cart.
    await cart.save()
    return { isCartItemUpdated: true }
  }

  async removeCartItem({
    cartId,
    itemId,
  }: RemoveFromCartInputDto): Promise<RemoveFromCartOutputDto> {
    // Retrieve the cart
    const cart = await this.cartService.validateAndGetById(cartId)
    const cartItems = await cart.getSalesFlatQuoteItems()

    // Find the specific item.
    const item = cartItems.find((i) => i.itemId === itemId)
    if (!item) {
      throw new CartInvalidProductException(
        `Item with ID ${itemId} not found in cart`,
      )
    }

    // Remove the item from the cart.
    await this.cartService.removeItemFromCart(cart, item)

    // Persist updated cart.
    await cart.save()
    return { isCartItemRemoved: true }
  }

  async getCartDetails(cartId: number): Promise<GetCartByIdOutputDto> {
    const cart = await this.cartService.validateAndGetById(cartId)

    const [cartItems, cartAddresses] = await Promise.all([
      cart.getSalesFlatQuoteItems(),
      cart.getSalesFlatQuoteAddresses(),
    ])

    const shippingAddress = cartAddresses.find(
      (address) => address.addressType === ADDRESS_TYPE.SHIPPING,
    )!

    const shippingRate = await shippingAddress.getSalesFlatQuoteShippingRate()
    const cartTotals = await this.cartService.collectTotals(cart)

    return CartDto.fromEntity(
      this.catalogHelper,
      cart,
      cartItems,
      cartAddresses,
      shippingRate,
      cartTotals,
    )
  }

  async applyCouponToCart(
    params: ApplyCouponToCartInputDto,
  ): Promise<ApplyCouponToCartOutputDto> {
    const { cartId, couponCode } = params

    const cart = await this.cartService.validateAndGetById(cartId)
    await this.cartService.applyCouponToCart(cart, couponCode)

    return {
      message: 'Coupon Applied!',
    }
  }

  async removeCouponFromCart(
    params: RemoveCouponFromCartInputDto,
  ): Promise<RemoveCouponFromCartOutputDto> {
    const { cartId } = params

    const cart = await this.cartService.validateAndGetById(cartId)
    await this.cartService.removeCouponFromCart(cart)

    return {
      message: 'Coupon Removed!',
    }
  }

  async claimCart(params: ClaimCartInputDto): Promise<ClaimCartOutputDto> {
    const { cartId, customerId } = params

    const [cart, customer] = await Promise.all([
      this.cartService.validateAndGetById(cartId),
      this.customerService.validateAndGetCustomerById(customerId),
    ])

    await this.cartService.assignCartToCustomer(cart, customer)

    return new ClaimCartOutputDto({
      message: `Cart ${cartId} claimed by customer ${customerId}`,
    })
  }
}
