import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { CartItemSelectedOptionsDto } from './common.dto'

export class AddToCartInputDto extends BaseDto<AddToCartInputDto> {
  @ApiProperty()
  @IsNumber()
  productId: number

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  childProductId: number | null

  @ApiProperty()
  @IsNumber()
  qty: number

  @IsNumber()
  @IsOptional()
  customerId: number | null

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  cartId: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  storeId: number

  @ApiProperty({
    type: CartItemSelectedOptionsDto,
    description: 'Selected options for the product',
    example: {
      124: 234,
      125: 235,
    },
  })
  @IsObject()
  selectedOptions: CartItemSelectedOptionsDto

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  currentUrl: string | null
}

export class AddToCartOutputDto extends BaseDto<AddToCartOutputDto> {
  @ApiProperty()
  @IsNumber()
  itemId: number

  @ApiProperty()
  @IsNumber()
  cartId: number
}
