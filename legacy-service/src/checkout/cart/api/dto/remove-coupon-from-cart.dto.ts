import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class RemoveCouponFromCartInputDto extends BaseDto<RemoveCouponFromCartInputDto> {
  @IsNumber()
  @IsOptional()
  cartId: number
}

export class RemoveCouponFromCartOutputDto extends BaseDto<RemoveCouponFromCartOutputDto> {
  @ApiProperty()
  @IsString()
  message: string
}
