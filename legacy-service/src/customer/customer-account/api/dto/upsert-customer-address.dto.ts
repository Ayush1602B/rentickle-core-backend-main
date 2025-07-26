import { BaseDto } from '@/shared/api/api.types'
import { BaseAddressDto } from '@/shared/shared.interface'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsObject, IsOptional } from 'class-validator'

export class UpsertCustomerAddressInputDto extends BaseDto<UpsertCustomerAddressInputDto> {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  declare addressId: number | null

  @ApiProperty()
  @IsBoolean()
  declare markDefaultBilling: boolean

  @ApiProperty()
  @IsBoolean()
  declare markDefaultShipping: boolean

  @ApiProperty({
    type: BaseAddressDto,
  })
  @IsObject()
  declare addressInfo: BaseAddressDto
}

export class UpsertCustomerAddressOutputDto extends BaseDto<UpsertCustomerAddressOutputDto> {
  // @ApiProperty({
  //   type: Number,
  // })
  // @IsNumber()
  // addressId: number

  // @ApiProperty({
  //   type: BaseAddressDto,
  // })
  // @IsObject()
  // addressInfo: BaseAddressDto
  @ApiProperty({
    type: String,
  })
  declare message: string
}
