import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsString } from 'class-validator'
import { AbstractPaymentMethod } from './methods/abstract-payment.method'

export class PaymentMethodDto extends BaseDto<PaymentMethodDto> {
  @ApiProperty()
  @IsString()
  code: string

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty()
  @IsBoolean()
  isActive: boolean

  @ApiProperty()
  @IsNumber()
  sortOrder: number

  static fromEntity(entity: AbstractPaymentMethod): PaymentMethodDto {
    return new PaymentMethodDto({
      code: entity.code,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      sortOrder: entity.sortOrder,
    })
  }
}

export class PaymentMethodInitiatePaymentDto extends BaseDto<PaymentMethodInitiatePaymentDto> {
  cartId: number
  paymentMethodCode: string
}
