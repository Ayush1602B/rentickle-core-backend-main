import { AuthUser } from '@/iam/auth/api/auth.decorator'
import { AuthGuard, OptionalAuthGuard } from '@/iam/auth/auth.guard'
import { AuthTokenPayload } from '@/iam/auth/auth.types'
import { BaseRequest, HTTP_STATUS_CODE } from '@/shared/api/api.types'
import {
  SWAGGER_AUTH_TOKEN_HEADER,
  SWAGGER_STORE_ID_HEADER,
  SWAGGER_STORE_ID_QUERY,
} from '@/shared/api/swagger.types'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { CartApiService } from './api/cart-api.service'
import {
  AddToCartInputDto,
  AddToCartOutputDto,
} from './api/dto/add-to-cart.dto'
import { ApplyCouponToCartOutputDto } from './api/dto/apply-coupon-to-cart.dto'
import { ClaimCartOutputDto } from './api/dto/claim-cart.dto'
import { GetCartByIdOutputDto } from './api/dto/get-cart-by-id.dto'
import { RemoveCouponFromCartOutputDto } from './api/dto/remove-coupon-from-cart.dto'
import { RemoveFromCartOutputDto } from './api/dto/remove-from-cart.dto'
import {
  UpdateItemQtyInputDto,
  UpdateItemQtyOutputDto,
} from './api/dto/update-item-qty.dto'

@Controller('carts')
export class CartController {
  constructor(private readonly cartApiService: CartApiService) {}

  @Post('/')
  @HttpCode(HTTP_STATUS_CODE.Created)
  @ApiQuery(SWAGGER_STORE_ID_QUERY)
  @ApiHeader(SWAGGER_STORE_ID_HEADER)
  @ApiHeader({ ...SWAGGER_AUTH_TOKEN_HEADER, required: false })
  @ApiResponse({
    status: HTTP_STATUS_CODE.Created,
    type: AddToCartOutputDto,
  })
  @UseGuards(OptionalAuthGuard)
  addToCart(
    @Body() dto: AddToCartInputDto,
    @Req() req: BaseRequest,
    @AuthUser() authUser: AuthTokenPayload | null,
  ): Promise<AddToCartOutputDto> {
    return this.cartApiService.addToCart({
      ...dto,
      customerId: authUser ? authUser.id : null,
      storeId: req.storeId,
    })
  }

  /**
   * PATCH /carts/:cartId/items/:itemId
   * Updates the quantity of a cart item. If the new quantity is zero or less,
   * the item is removed.
   */
  @Patch(':cartId/items/:itemId')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: UpdateItemQtyOutputDto,
  })
  updateCartItemQuantity(
    @Param('cartId') cartId: number,
    @Param('itemId') itemId: number,
    @Body() updateCartItemDto: UpdateItemQtyInputDto,
  ): Promise<UpdateItemQtyOutputDto> {
    // Pass the cartId and itemId along with the update data
    return this.cartApiService.updateCartItemQuantity({
      ...updateCartItemDto,
      cartId,
      itemId,
    })
  }

  /**
   * DELETE /carts/:cartId/items/:itemId
   * Removes an item from the cart.
   */
  @Delete(':cartId/items/:itemId')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: RemoveFromCartOutputDto,
  })
  removeCartItem(
    @Param('cartId') cartId: number,
    @Param('itemId') itemId: number,
  ): Promise<RemoveFromCartOutputDto> {
    return this.cartApiService.removeCartItem({ cartId, itemId })
  }

  /**
   * GET /carts/:cartId
   * Retrieves the cart details including items, addresses, and totals.
   */
  @Get(':cartId')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: GetCartByIdOutputDto,
  })
  getCartDetails(
    @Param('cartId') cartId: number,
  ): Promise<GetCartByIdOutputDto> {
    return this.cartApiService.getCartDetails(cartId)
  }

  /**
   * GET /carts/:cartId
   * Retrieves the cart details including items, addresses, and totals.
   */
  @Post(':cartId/offers/:couponCode')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: ApplyCouponToCartOutputDto,
  })
  applyCouponToCart(
    @Param('cartId') cartId: number,
    @Param('couponCode') couponCode: string,
  ): Promise<ApplyCouponToCartOutputDto> {
    return this.cartApiService.applyCouponToCart({ cartId, couponCode })
  }

  /**
   * GET /carts/:cartId
   * Retrieves the cart details including items, addresses, and totals.
   */
  @Delete(':cartId/offers')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: RemoveCouponFromCartOutputDto,
  })
  removeCouponFromCart(
    @Param('cartId') cartId: number,
  ): Promise<RemoveCouponFromCartOutputDto> {
    return this.cartApiService.removeCouponFromCart({ cartId })
  }

  /**
   * GET /carts/:cartId
   * Retrieves the cart details including items, addresses, and totals.
   */
  @Post(':cartId/claim')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: ClaimCartOutputDto,
  })
  @UseGuards(AuthGuard)
  claimCart(
    @Param('cartId') cartId: number,
    @AuthUser() authUser: AuthTokenPayload,
  ): Promise<ClaimCartOutputDto> {
    return this.cartApiService.claimCart({ cartId, customerId: authUser.id })
  }
}
