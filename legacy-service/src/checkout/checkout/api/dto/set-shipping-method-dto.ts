import { SHIPPING_METHOD } from '@/checkout/shipping/shipping.types'
import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class SetShippingMethodInputDto extends BaseDto<SetShippingMethodInputDto> {
  @IsNumber()
  @IsOptional()
  cartId: number

  @ApiProperty()
  @IsEnum(SHIPPING_METHOD)
  shippingMethodCode: string
}

export class SetShippingMethodOutputDto extends BaseDto<SetShippingMethodOutputDto> {
  @ApiProperty()
  @IsNumber()
  cartId: number

  @ApiProperty()
  @IsString()
  message: string
}
