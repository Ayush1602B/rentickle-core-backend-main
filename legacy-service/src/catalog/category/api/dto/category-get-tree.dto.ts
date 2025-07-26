import { BaseDto } from '@/shared/api/api.types'
import { ApiResponseProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator'
import { CategoryTree } from '../../category.tree'

export class CategoryTreeNodeDto extends BaseDto<CategoryTreeNodeDto> {
  @IsNumber()
  @ApiResponseProperty()
  id: number

  @IsString()
  @ApiResponseProperty()
  name: string | null

  @IsString()
  @ApiResponseProperty()
  urlKey: string | null

  @IsNumber()
  @ApiResponseProperty()
  level: number

  @IsArray()
  @ApiResponseProperty({ type: () => CategoryTreeNodeDto })
  children: CategoryTreeNodeDto[]

  static fromEntity(categoryTree: CategoryTree): CategoryTreeNodeDto {
    return categoryTree.toJSON()
  }
}

export class CategoryTreeOutputDto extends BaseDto<CategoryTreeOutputDto> {
  @IsNumber()
  @ApiResponseProperty()
  storeId: number

  @IsObject()
  @ApiResponseProperty({ type: () => CategoryTreeNodeDto })
  tree: CategoryTreeNodeDto
}
