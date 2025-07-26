import { BaseDto } from '@/shared/api/api.types'
import { IsEmailOrMobileConstraint } from '@/shared/validators/dto-field.validator'
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'
import { IsString, Length, Validate } from 'class-validator'

export class LoginWithOtpInputDto extends BaseDto<LoginWithOtpInputDto> {
  @ApiProperty()
  @Validate(IsEmailOrMobileConstraint)
  loginId: string

  @ApiProperty()
  @IsString()
  @Length(6)
  otp: string
}

export class LoginWithOtpOutputDto extends BaseDto<LoginWithOtpOutputDto> {
  @ApiResponseProperty()
  @IsString()
  accessToken: string
}
