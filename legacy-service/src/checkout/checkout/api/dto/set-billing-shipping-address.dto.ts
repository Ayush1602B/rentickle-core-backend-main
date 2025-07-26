import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class SetBillingAndShippingAddressInputDto extends BaseDto<SetBillingAndShippingAddressInputDto> {
  @IsNumber()
  @IsOptional()
  cartId: number

  @ApiProperty()
  @IsNumber()
  shippingAddressId: number

  @ApiProperty()
  @IsBoolean()
  sameAsShippingAddress: boolean

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  billingAddressId: number
}

export class SetBillingAndShippingAddressOutputDto extends BaseDto<SetBillingAndShippingAddressOutputDto> {
  @ApiProperty()
  @IsNumber()
  cartId: number

  @ApiProperty()
  @IsString()
  message: string
}
