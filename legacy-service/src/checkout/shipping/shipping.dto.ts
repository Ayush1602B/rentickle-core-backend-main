import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsString } from 'class-validator'
import { AbstractShippingMethod } from './methods/abstract-shipping.method'

export class ShippingMethodDto extends BaseDto<ShippingMethodDto> {
  @ApiProperty()
  @IsString()
  code: string

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty()
  @IsBoolean()
  isActive: boolean

  @ApiProperty()
  @IsNumber()
  sortOrder: number

  static fromEntity(entity: AbstractShippingMethod): ShippingMethodDto {
    return new ShippingMethodDto({
      code: entity.code,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      sortOrder: entity.sortOrder,
    })
  }
}
