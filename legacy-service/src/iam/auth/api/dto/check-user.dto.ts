import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CheckUserInputDto extends BaseDto<CheckUserInputDto> {
  @ApiProperty()
  @IsString()
  loginId: string
}

export class CheckUserOutputDto extends BaseDto<CheckUserOutputDto> {
  @ApiResponseProperty()
  userExists: boolean
}
