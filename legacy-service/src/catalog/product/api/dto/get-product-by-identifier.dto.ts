import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { ProductDto } from './product-common.dto'

export class GetProductByIdentifierInputDto extends BaseDto<GetProductByIdentifierInputDto> {
  @ApiProperty()
  @IsString()
  declare identifier: string

  @ApiProperty()
  @IsNumber()
  declare storeId: number
}

export class GetProductByIdentifierOutputDto extends ProductDto {}
