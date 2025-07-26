import { EavAttributeOptionValue } from '@/eav/models/eav-attribute-option-value.model'
import { EavAttributeOption } from '@/eav/models/eav-attribute-option.model'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsString } from 'class-validator'

export class GetCategoryDiscoverOptionsInputDto extends BaseDto<GetCategoryDiscoverOptionsInputDto> {
  @ApiProperty()
  @IsNumber()
  categoryId: number

  @IsNumber()
  storeId: number
}

export class GetCategoryDiscoverOptionsOutputDto extends BaseDto<GetCategoryDiscoverOptionsOutputDto> {
  @ApiProperty({ type: () => CategoryFilterDto, isArray: true })
  @IsArray()
  filters: CategoryFilterDto[]

  @ApiProperty({ type: () => CategorySortDto, isArray: true })
  @IsArray()
  sorts: CategorySortDto[]

  static fromEntity(categoryDiscoverOptions: {
    filters: EavAttribute[]
    sorts: EavAttribute[]
  }): GetCategoryDiscoverOptionsOutputDto {
    return new GetCategoryDiscoverOptionsOutputDto({
      filters: categoryDiscoverOptions.filters.map((filter) =>
        CategoryFilterDto.fromEntity(filter),
      ),
      sorts: categoryDiscoverOptions.sorts.map((sort) =>
        CategorySortDto.fromEntity(sort),
      ),
    })
  }
}

class CategoryFilterDto extends BaseDto<CategoryFilterDto> {
  @ApiResponseProperty()
  @IsNumber()
  attributeId: number

  @ApiResponseProperty()
  @IsString()
  attributeName: string

  @ApiResponseProperty()
  @IsString()
  attributeCode: string

  @ApiResponseProperty()
  @IsString()
  type: string

  @ApiResponseProperty()
  @IsString()
  defaultValue: string

  @ApiProperty({ type: () => CategoryFilterOptionDto, isArray: true })
  @IsArray()
  options: CategoryFilterOptionDto[]

  static fromEntity(attribute: EavAttribute): CategoryFilterDto {
    return new CategoryFilterDto({
      attributeId: attribute.attributeId,
      attributeName: attribute.frontendLabel,
      attributeCode: attribute.attributeCode,
      type: attribute.backendType,
      defaultValue: attribute.defaultValue,
      options: (attribute.EavAttributeOptions || []).map((option) =>
        CategoryFilterOptionDto.fromEntity(option),
      ),
    })
  }
}

class CategoryFilterOptionDto extends BaseDto<CategoryFilterOptionDto> {
  @ApiResponseProperty()
  @IsNumber()
  optionId: number

  @ApiResponseProperty()
  @IsNumber()
  sortOrder: number

  @ApiProperty({ type: () => CategoryFilterOptionValueDto, isArray: true })
  @IsArray()
  values: CategoryFilterOptionValueDto[]

  static fromEntity(option: EavAttributeOption): CategoryFilterOptionDto {
    return new CategoryFilterOptionDto({
      optionId: option.optionId,
      sortOrder: option.sortOrder,
      values: (option.EavAttributeOptionValues || []).map((value) =>
        CategoryFilterOptionValueDto.fromEntity(value),
      ),
    })
  }
}

class CategoryFilterOptionValueDto extends BaseDto<CategoryFilterOptionValueDto> {
  @ApiResponseProperty()
  @IsNumber()
  optionValueId: number

  @ApiResponseProperty()
  @IsNumber()
  storeId: number

  @ApiResponseProperty()
  @IsString()
  value: string | null

  static fromEntity(
    optionValue: EavAttributeOptionValue,
  ): CategoryFilterOptionValueDto {
    return new CategoryFilterOptionValueDto({
      optionValueId: optionValue.valueId,
      storeId: optionValue.storeId,
      value: optionValue.value,
    })
  }
}

class CategorySortDto extends BaseDto<CategorySortDto> {
  @ApiResponseProperty()
  @IsNumber()
  attributeId: number

  @ApiResponseProperty()
  @IsString()
  attributeName: string

  @ApiResponseProperty()
  @IsString()
  attributeCode: string

  static fromEntity(attribute: EavAttribute): CategorySortDto {
    return new CategorySortDto({
      attributeId: attribute.attributeId,
      attributeName: attribute.frontendLabel,
      attributeCode: attribute.attributeCode,
    })
  }
}
