import { BaseDto } from '@/shared/api/api.types'
import { BaseAddressDto } from '@/shared/shared.interface'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'

export class UpdateCustomerAddressCronDto extends BaseDto<UpdateCustomerAddressCronDto> {
  @IsString()
  @IsNotEmpty()
  incrementId: string

  @ValidateNested()
  @Type(() => BaseAddressDto)
  address: BaseAddressDto
}
