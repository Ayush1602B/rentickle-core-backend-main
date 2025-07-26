import { CartService } from '@/checkout/cart/cart.service' // assuming cart lives here
import { PaymentMethodDto } from '@/checkout/payment/payment.dto'
import { PaymentService } from '@/checkout/payment/payment.service'
import { ShippingMethodDto } from '@/checkout/shipping/shipping.dto'
import { ShippingService } from '@/checkout/shipping/shipping.service'
import { ShippingMethod } from '@/checkout/shipping/shipping.types'
import { CustomerAddressDto } from '@/customer/customer/api/dto/customer-common.dto'
import { CustomerAddressService } from '@/customer/customer/customer-address.service'
import { CustomerService } from '@/customer/customer/customer.service'
import { OrderService } from '@/sales/order/order.service'
import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { CheckoutAcceptTermsException } from '../checkout.error'
import {
  InitiateCheckoutInputDto,
  InitiateCheckoutOutputDto,
} from './dto/initiate-checkout.dto'
import {
  OnPayuPaymentFailureInputDto,
  OnPayuPaymentFailureOutputDto,
} from './dto/on-payu-payment-failure.dto'
import {
  OnPayuPaymentSuccessInputDto,
  OnPayuPaymentSuccessOutputDto,
} from './dto/on-payu-payment-success.dto'
import {
  ProceedToPaymentInputDto,
  ProceedToPaymentOutputDto,
} from './dto/proceed-to-payment.dto'
import {
  SetBillingAndShippingAddressInputDto,
  SetBillingAndShippingAddressOutputDto,
} from './dto/set-billing-shipping-address.dto'
import {
  SetShippingMethodInputDto,
  SetShippingMethodOutputDto,
} from './dto/set-shipping-method-dto'

interface ICheckoutApiService {
  initiateCheckout(
    dto: InitiateCheckoutInputDto,
  ): Promise<InitiateCheckoutOutputDto>
  setBillingAndShippingAddress(
    dto: SetBillingAndShippingAddressInputDto,
  ): Promise<SetBillingAndShippingAddressOutputDto>
  setShippingMethod(
    dto: SetShippingMethodInputDto,
  ): Promise<SetShippingMethodOutputDto>
  proceedToPayment(
    dto: ProceedToPaymentInputDto,
  ): Promise<ProceedToPaymentOutputDto>
  onPayuPaymentSuccess(
    dto: OnPayuPaymentSuccessInputDto,
  ): Promise<OnPayuPaymentSuccessOutputDto>
}

@Injectable()
export class CheckoutApiService implements ICheckoutApiService {
  constructor(
    private readonly cartService: CartService,
    private readonly customerService: CustomerService,
    private readonly customerAddressService: CustomerAddressService,
    private readonly shippingService: ShippingService,
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  async initiateCheckout(
    dto: InitiateCheckoutInputDto,
  ): Promise<InitiateCheckoutOutputDto> {
    const { cartId, customerId } = dto

    const cart = await this.cartService.validateAndGetById(cartId)
    if (!cart.customerId) {
      cart.customerIsGuest = 0
      cart.customerId = customerId
    }

    await this.cartService.validateCartForCheckout(cart)

    const cartStore = await cart.loadStore()
    const cartBillingAddress = cart.getBillingAddress()!
    const cartShippingAddress = cart.getShippingAddress()!

    const customer = await cart.getCustomerEntity()
    let cartShippingMethod: ShippingMethod | null = null

    const [customerAddresses, shippingMethods, paymentMethods] =
      await Promise.all([
        customer
          ? this.customerAddressService.getCustomerAddressesForStore(
              customer,
              cartStore,
            )
          : [],
        this.shippingService.getActiveShippingMethods(),
        this.paymentService.getActivePaymentMethods(),
      ])

    const cartShippingRate =
      await cartShippingAddress.getSalesFlatQuoteShippingRate()

    if (cartShippingRate?.code) {
      cartShippingMethod = await this.shippingService.getShippingMethodByCode(
        cartShippingRate.code,
      )
    }

    const cartPaymentMethod = await cart.getSalesFlatQuotePayment()

    return Promise.resolve({
      cartId: Number(cartId),
      storeId: cart.storeId,
      customerId: cart.customerId,
      isCartEmpty: cart.isEmpty(),
      selectedBillingAddressId:
        cartBillingAddress && cartBillingAddress.customerAddressId
          ? cartBillingAddress.customerAddressId
          : null,
      selectedShippingAddressId:
        cartShippingAddress && cartShippingAddress.customerAddressId
          ? cartShippingAddress.customerAddressId
          : null,
      selectedShippingMethod: cartShippingMethod
        ? cartShippingMethod.code
        : null,
      selectedPaymentMethod: cartPaymentMethod
        ? cartPaymentMethod.method
        : null,
      addresses: await Promise.all(
        customerAddresses.map(CustomerAddressDto.fromEntity),
      ),
      shippingMethods: shippingMethods.map(ShippingMethodDto.fromEntity),
      paymentMethods: paymentMethods.map(PaymentMethodDto.fromEntity),
    })
  }

  async setBillingAndShippingAddress({
    cartId,
    shippingAddressId,
    billingAddressId,
  }: SetBillingAndShippingAddressInputDto): Promise<SetBillingAndShippingAddressOutputDto> {
    const [cart, customerBillingAddress, customerShippingAddress] =
      await Promise.all([
        this.cartService.validateAndGetById(cartId),
        this.customerAddressService.validateAndGetCustomerAddressById(
          billingAddressId,
        ),
        this.customerAddressService.validateAndGetCustomerAddressById(
          shippingAddressId,
        ),
      ])

    await this.cartService.validateCartForCheckout(cart)

    const cartCustomer = await cart.getCustomerEntity()

    if (cartCustomer) {
      await Promise.all([
        this.customerAddressService.validateCustomerAddressOwnership(
          customerBillingAddress,
          cartCustomer,
        ),

        this.customerAddressService.validateCustomerAddressOwnership(
          customerShippingAddress,
          cartCustomer,
        ),
      ])
    }

    await this.cartService.setBillingAddress(cart, customerBillingAddress)
    await this.cartService.setShippingAddress(cart, customerShippingAddress)

    await cart.save()

    return {
      cartId,
      message: 'Billing and shipping address set successfully',
    }
  }

  async setShippingMethod({
    cartId,
    shippingMethodCode,
  }: SetShippingMethodInputDto): Promise<SetShippingMethodOutputDto> {
    const cart = await this.cartService.validateAndGetById(cartId)
    await this.cartService.validateCartForCheckout(cart)

    const shippingMethod =
      await this.shippingService.validateAndGetShippingMethodByCode(
        shippingMethodCode,
      )

    await this.cartService.applyShippingToCart(cart, shippingMethod)
    await cart.save()

    return {
      cartId,
      message: 'Shipping method applied successfully!',
    }
  }

  async proceedToPayment(
    dto: ProceedToPaymentInputDto,
  ): Promise<ProceedToPaymentOutputDto> {
    const { cartId, acceptTerms, paymentMethodCode } = dto

    if (!acceptTerms) {
      throw new CheckoutAcceptTermsException(
        'Please accept the terms and conditions',
      )
    }

    const cart = await this.cartService.validateAndGetById(cartId)
    await this.cartService.validateCartForCheckout(cart)

    const paymentMethod =
      await this.paymentService.validateAndGetPaymentMethodByCode(
        paymentMethodCode,
      )

    const newOrder = await this.orderService.convertCartToOrder(cart)

    await this.orderService.initiateTransaction(newOrder)
    const res = await paymentMethod.initPayment(newOrder)

    await cart.save()
    await newOrder.save()

    return {
      reservedOrderId: newOrder.incrementId!,
      formActionUrl: res.formActionUrl,
      formData: res.formData,
    }
  }

  async onPayuPaymentSuccess(
    dto: OnPayuPaymentSuccessInputDto,
  ): Promise<OnPayuPaymentSuccessOutputDto> {
    const { orderId } = dto
    const order = await this.orderService.validateAndGetByIncrementId(orderId)

    await this.orderService.confirmPayment(
      order,
      plainToInstance(OnPayuPaymentSuccessInputDto, dto),
    )

    await this.orderService.confirmOrder(order)
    await order.save()

    return {
      message: 'Payment captured successfully',
    }
  }

  async onPayuPaymentFailure(
    dto: OnPayuPaymentFailureInputDto,
  ): Promise<OnPayuPaymentFailureOutputDto> {
    const { orderId } = dto
    const order = await this.orderService.validateAndGetByIncrementId(orderId)
    await this.orderService.declinePayment(
      order,
      plainToInstance(OnPayuPaymentSuccessInputDto, dto),
    )

    await order.save()
    return {
      message: 'Failed to capture payment',
    }
  }
}
