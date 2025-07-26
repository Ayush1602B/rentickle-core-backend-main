import { BaseDto, BaseListResponseOutputDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'
import { ProductDto } from './product-common.dto'

export class GetProductListByQueryInputDto extends BaseDto<GetProductListByQueryInputDto> {
  @ApiProperty()
  @IsString()
  declare query: string

  @ApiProperty()
  @IsNumber()
  declare storeId: number
}

export class GetProductListByQueryOutputDto
  extends BaseDto<GetProductListByQueryOutputDto>
  implements BaseListResponseOutputDto<ProductDto>
{
  @ApiProperty({ type: () => ProductDto, isArray: true })
  @IsArray()
  list: ProductDto[]

  @ApiProperty()
  @IsNumber()
  page: number

  @ApiProperty()
  @IsNumber()
  length: number

  @ApiProperty()
  @IsNumber()
  limit: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  hasMore?: boolean

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  total?: number
}
