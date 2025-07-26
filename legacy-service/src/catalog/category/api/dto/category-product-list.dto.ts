import { ProductDto } from '@/catalog/product/api/dto/product-common.dto'
import {
  BaseDto,
  BaseListRequestInputDto,
  BaseListResponseOutputDto,
} from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class CategoryProductListInputDto
  extends BaseDto<CategoryProductListInputDto>
  implements BaseListRequestInputDto
{
  @ApiProperty()
  @IsString()
  filters: string

  @ApiProperty()
  @IsString()
  sorts: string

  @ApiProperty()
  @IsNumber()
  page: number

  @ApiProperty()
  @IsNumber()
  limit: number
}

export class CategoryProductListOutputDto
  extends BaseDto<CategoryProductListOutputDto>
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
