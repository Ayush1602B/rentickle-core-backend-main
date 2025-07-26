import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { BannerEntity } from '../../models'
import { CatalogHelper } from '@/catalog/catalog.helper'

export class BannerDto extends BaseDto<BannerDto> {
  @ApiProperty()
  @IsNumber()
  id: number

  @ApiProperty()
  @IsString()
  title: string

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  title2: string | null

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  title3: string | null

  @ApiProperty()
  @IsString()
  link: string

  @ApiProperty()
  @IsString()
  image: string

  @ApiPropertyOptional({ type: String })
  @IsString()
  image2: string | null

  @ApiPropertyOptional({ type: String })
  @IsString()
  image3: string | null

  @ApiPropertyOptional({ type: String })
  @IsString()
  description: string | null

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  order: number

  static fromEntity(
    catalogHelper: CatalogHelper,
    bannerEntity: BannerEntity,
  ): BannerDto {
    return new BannerDto({
      id: bannerEntity.banner7Id,
      title: bannerEntity.title,
      title2: bannerEntity.title2,
      title3: bannerEntity.title3,
      link: bannerEntity.link,
      image: catalogHelper.formatImageUrl(bannerEntity.image),
      image2: catalogHelper.formatImageUrl(bannerEntity.image2 || ''),
      image3: catalogHelper.formatImageUrl(bannerEntity.image3 || ''),
      description: bannerEntity.description,
      order: bannerEntity.order,
    })
  }
}
