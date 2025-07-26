import { PAYMENT_METHOD } from '@/checkout/payment/payment.types'
import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

export class ProceedToPaymentInputDto extends BaseDto<ProceedToPaymentInputDto> {
  @IsNumber()
  @IsOptional()
  cartId: number

  @ApiProperty()
  @IsBoolean()
  acceptTerms: boolean

  @ApiProperty()
  @IsEnum(PAYMENT_METHOD)
  paymentMethodCode: PAYMENT_METHOD
}

export class ProceedToPaymentOutputDto extends BaseDto<ProceedToPaymentOutputDto> {
  @ApiProperty()
  @IsString()
  reservedOrderId: string

  @ApiProperty()
  @IsString()
  formActionUrl: string

  @ApiProperty({
    type: Object,
  })
  @IsObject()
  formData: Record<string, any>
}
