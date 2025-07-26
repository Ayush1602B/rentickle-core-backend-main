import {
  BaseDto,
  BaseListRequestInputDto,
  BaseListResponseOutputDto,
} from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'
import { CategoryDto } from './category-common.dto'

export class GetCategoryListInputDto
  extends BaseDto<GetCategoryListInputDto>
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

export class GetCategoryListOutputDto
  extends BaseDto<GetCategoryListOutputDto>
  implements BaseListResponseOutputDto<CategoryDto>
{
  @ApiProperty({ type: () => CategoryDto, isArray: true })
  @IsArray()
  list: CategoryDto[]

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
