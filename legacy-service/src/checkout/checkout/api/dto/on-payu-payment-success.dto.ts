import { PayuPaymentApiResponseDto } from '@/checkout/payment/methods/payu/payu.types'
import { BaseDto } from '@/shared/api/api.types'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class OnPayuPaymentSuccessInputDto extends PayuPaymentApiResponseDto {
  @IsString()
  @IsOptional()
  orderId: string
}

export class OnPayuPaymentSuccessOutputDto extends BaseDto<OnPayuPaymentSuccessOutputDto> {
  @IsString()
  @IsNotEmpty()
  message: string
}
