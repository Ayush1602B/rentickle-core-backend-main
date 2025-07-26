import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class ApplyCouponToCartInputDto extends BaseDto<ApplyCouponToCartInputDto> {
  @IsNumber()
  @IsOptional()
  cartId: number

  @ApiProperty()
  @IsString()
  couponCode: string
}

export class ApplyCouponToCartOutputDto extends BaseDto<ApplyCouponToCartOutputDto> {
  @ApiProperty()
  @IsString()
  message: string
}
