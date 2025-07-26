import { PaymentMethodDto } from '@/checkout/payment/payment.dto'
import { ShippingMethodDto } from '@/checkout/shipping/shipping.dto'
import { CustomerAddressDto } from '@/customer/customer/api/dto/customer-common.dto'
import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class InitiateCheckoutInputDto extends BaseDto<InitiateCheckoutInputDto> {
  @IsNumber()
  cartId: number

  @IsNumber()
  @IsOptional()
  customerId: number | null
}

export class InitiateCheckoutOutputDto extends BaseDto<InitiateCheckoutOutputDto> {
  @ApiProperty()
  @IsNumber()
  cartId: number

  @ApiProperty()
  @IsNumber()
  storeId: number

  @ApiProperty({
    type: Number,
  })
  @IsString()
  customerId: number | null

  @ApiProperty()
  @IsBoolean()
  isCartEmpty: boolean

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  selectedBillingAddressId: number | null

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  selectedShippingAddressId: number | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  selectedShippingMethod: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  selectedPaymentMethod: string | null

  @ApiProperty({
    type: CustomerAddressDto,
    isArray: true,
  })
  @IsArray()
  addresses: CustomerAddressDto[]

  @ApiProperty({
    type: ShippingMethodDto,
    isArray: true,
  })
  @IsArray()
  shippingMethods: ShippingMethodDto[]

  @ApiProperty({
    type: PaymentMethodDto,
    isArray: true,
  })
  @IsArray()
  paymentMethods: PaymentMethodDto[]
}
