import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class UpdateItemQtyInputDto extends BaseDto<UpdateItemQtyInputDto> {
  @IsNumber()
  @IsOptional()
  cartId: number

  @IsNumber()
  @IsOptional()
  itemId: number

  @IsNumber()
  newQty: number
}

export class UpdateItemQtyOutputDto extends BaseDto<UpdateItemQtyOutputDto> {
  @ApiProperty()
  @IsNumber()
  isCartItemUpdated: boolean
}
