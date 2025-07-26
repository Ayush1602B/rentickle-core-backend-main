import {
  BaseDto,
  BaseListRequestInputDto,
  BaseListResponseOutputDto,
} from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'
import { ProductDto } from './product-common.dto'

export class GetProductListInputDto
  extends BaseDto<GetProductListInputDto>
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

export class GetProductListOutputDto
  extends BaseDto<GetProductListOutputDto>
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
