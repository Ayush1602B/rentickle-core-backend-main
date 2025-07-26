import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class RemoveFromCartInputDto extends BaseDto<RemoveFromCartInputDto> {
  @IsNumber()
  cartId: number

  @IsNumber()
  itemId: number
}

export class RemoveFromCartOutputDto extends BaseDto<RemoveFromCartOutputDto> {
  @ApiProperty()
  @IsNumber()
  isCartItemRemoved: boolean
}
