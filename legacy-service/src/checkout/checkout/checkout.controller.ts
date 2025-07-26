import { AuthUser } from '@/iam/auth/api/auth.decorator'
import { AuthGuard } from '@/iam/auth/auth.guard'
import { AuthTokenPayload } from '@/iam/auth/auth.types'
import { HTTP_STATUS_CODE } from '@/shared/api/api.types'
import { SWAGGER_AUTH_TOKEN_HEADER } from '@/shared/api/swagger.types'
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiHeader, ApiResponse } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import { CheckoutApiService } from './api/checkout-api.service'
import { InitiateCheckoutOutputDto } from './api/dto/initiate-checkout.dto'
import { OnPayuPaymentFailureInputDto } from './api/dto/on-payu-payment-failure.dto'
import { OnPayuPaymentSuccessInputDto } from './api/dto/on-payu-payment-success.dto'
import {
  ProceedToPaymentInputDto,
  ProceedToPaymentOutputDto,
} from './api/dto/proceed-to-payment.dto'
import {
  SetBillingAndShippingAddressInputDto,
  SetBillingAndShippingAddressOutputDto,
} from './api/dto/set-billing-shipping-address.dto'
import {
  SetShippingMethodInputDto,
  SetShippingMethodOutputDto,
} from './api/dto/set-shipping-method-dto'
import { CartOwnershipGuard } from './checkout.guard'

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutApiService: CheckoutApiService) {}

  @Post(':cartId/initiate')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: InitiateCheckoutOutputDto,
  })
  @ApiHeader(SWAGGER_AUTH_TOKEN_HEADER)
  @UseGuards(AuthGuard, CartOwnershipGuard)
  initiateCheckout(
    @Param('cartId') cartId: number,
    @AuthUser() authUser: AuthTokenPayload,
  ) {
    return this.checkoutApiService.initiateCheckout(
      plainToInstance(InitiateCheckoutOutputDto, {
        cartId: cartId,
        customerId: authUser ? authUser.id : null,
      }),
    )
  }

  @Post(':cartId/shipping')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: SetShippingMethodOutputDto,
  })
  @ApiHeader(SWAGGER_AUTH_TOKEN_HEADER)
  @UseGuards(AuthGuard, CartOwnershipGuard)
  setShippingMethod(
    @Param('cartId') cartId: number,
    @Body() dto: SetShippingMethodInputDto,
  ) {
    return this.checkoutApiService.setShippingMethod(
      plainToInstance(SetShippingMethodInputDto, {
        ...dto,
        cartId,
      }),
    )
  }

  @Post(':cartId/addresses')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: SetBillingAndShippingAddressOutputDto,
  })
  @ApiHeader(SWAGGER_AUTH_TOKEN_HEADER)
  @UseGuards(AuthGuard, CartOwnershipGuard)
  setBillingAndShippingAddress(
    @Param('cartId') cartId: number,
    @Body() dto: SetBillingAndShippingAddressInputDto,
  ) {
    return this.checkoutApiService.setBillingAndShippingAddress({
      ...dto,
      cartId,
    })
  }

  @Post(':cartId/payment/proceed')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: ProceedToPaymentOutputDto,
  })
  @ApiHeader(SWAGGER_AUTH_TOKEN_HEADER)
  @UseGuards(AuthGuard, CartOwnershipGuard)
  proceedToPayment(
    @Param('cartId') cartId: number,
    @Body() dto: ProceedToPaymentInputDto,
  ) {
    return this.checkoutApiService.proceedToPayment(
      plainToInstance(ProceedToPaymentInputDto, {
        ...dto,
        cartId,
      }),
    )
  }

  @Post(':orderId/payment/payu/success')
  async onPayuPaymentSuccess(
    @Param('orderId') orderId: string,
    @Body() dto: OnPayuPaymentSuccessInputDto,
  ) {
    await this.checkoutApiService.onPayuPaymentSuccess(
      plainToInstance(OnPayuPaymentSuccessInputDto, {
        ...dto,
        orderId,
      }),
    )
  }

  @Post(':orderId/payment/payu/failure')
  onPayuPaymentFailure(
    @Param('orderId') orderId: string,
    @Body() dto: OnPayuPaymentFailureInputDto,
  ) {
    return this.checkoutApiService.onPayuPaymentFailure(
      plainToInstance(OnPayuPaymentFailureInputDto, {
        ...dto,
        orderId,
      }),
    )
  }
}
