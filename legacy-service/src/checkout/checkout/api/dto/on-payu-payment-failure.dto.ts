import { PayuPaymentApiResponseDto } from '@/checkout/payment/methods/payu/payu.types'
import { BaseDto } from '@/shared/api/api.types'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class OnPayuPaymentFailureInputDto extends PayuPaymentApiResponseDto {
  @IsString()
  @IsOptional()
  orderId: string
}

export class OnPayuPaymentFailureOutputDto extends BaseDto<OnPayuPaymentFailureOutputDto> {
  @IsString()
  @IsNotEmpty()
  message: string
}
