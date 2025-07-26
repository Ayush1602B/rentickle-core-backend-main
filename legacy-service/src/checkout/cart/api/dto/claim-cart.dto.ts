import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class ClaimCartInputDto extends BaseDto<ClaimCartInputDto> {
  @ApiProperty()
  @IsNumber()
  declare cartId: number

  @ApiProperty()
  @IsNumber()
  declare customerId: number
}

export class ClaimCartOutputDto extends BaseDto<ClaimCartOutputDto> {
  @ApiProperty()
  @IsString()
  declare message: string
}
