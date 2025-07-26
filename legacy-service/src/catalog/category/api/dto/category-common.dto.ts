import { CatalogHelper } from '@/catalog/catalog.helper'
import { CoreStore } from '@/core/store/models/core-store.model'
import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { MagentoCategoryAttributes } from '../../category.types'
import { CatalogCategoryEntity } from '../../models/catalog-category-entity.model'

export class CategoryDto extends BaseDto<CategoryDto> {
  @ApiProperty()
  @IsNumber()
  categoryId: number

  @ApiProperty()
  @IsNumber()
  attributeSetId: number

  @ApiProperty()
  @IsNumber()
  entityTypeId: number

  @ApiProperty()
  @IsNumber()
  parentId: number

  @ApiProperty()
  @IsString()
  path: string

  @ApiProperty()
  @IsNumber()
  position: number

  @ApiProperty()
  @IsNumber()
  level: number

  @ApiProperty()
  @IsNumber()
  childrenCount: number

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  nameToDisplay: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty()
  @IsString()
  metaTitle: string

  @ApiProperty()
  @IsString()
  metaDescription: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  metaKeywords: string

  @ApiProperty()
  @IsString()
  image: string

  @ApiProperty()
  @IsString()
  thumbnail: string

  @ApiProperty()
  @IsString()
  listThumbnail: string

  @ApiProperty()
  @IsString()
  urlKey: string

  @ApiProperty()
  @IsString()
  urlPath: string

  @ApiProperty({ type: () => Date })
  @IsString()
  createdAt: Date | null

  @ApiProperty({ type: () => Date })
  @IsString()
  updatedAt: Date | null

  @ApiProperty({ type: () => Object })
  additionalAttributes: MagentoCategoryAttributes

  static async fromEntity(
    catalogHelper: CatalogHelper,
    category: CatalogCategoryEntity,
    store: CoreStore,
  ): Promise<CategoryDto> {
    const attributeValueMap = await category.resolveAttributeMapForStore(
      store.storeId,
    )
    const {
      name,
      name_to_display,
      description,
      meta_title,
      meta_description,
      meta_keywords,
      image,
      thumbnail,
      catlist_thumbnail,
      url_key,
      url_path,
      created_at,
      updated_at,
      ...rest
    } = attributeValueMap
    return new CategoryDto({
      categoryId: category.entityId,
      attributeSetId: category.attributeSetId,
      entityTypeId: category.entityTypeId,
      parentId: category.parentId,
      path: category.path,
      position: category.position,
      level: category.level,
      childrenCount: category.childrenCount,
      name: name ?? '',
      nameToDisplay: name_to_display ?? '',
      description: description ?? '',
      metaTitle: meta_title ?? '',
      metaDescription: meta_description ?? '',
      metaKeywords: meta_keywords ?? '',
      image: catalogHelper.formatCategoryImageUrl(image ?? ''),
      thumbnail: catalogHelper.formatCategoryImageUrl(thumbnail ?? ''),
      listThumbnail: catalogHelper.formatCategoryImageUrl(
        catlist_thumbnail ?? '',
      ),
      urlKey: url_key ?? '',
      urlPath: url_path ?? '',
      createdAt: created_at ? new Date(created_at) : null,
      updatedAt: updated_at ? new Date(updated_at) : null,
      additionalAttributes: {
        ...rest,
      },
    })
  }
}
