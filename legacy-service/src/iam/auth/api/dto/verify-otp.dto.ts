import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { AUTH_OTP_PURPOSE } from '../../auth.types'

export class VerifyOtpInputDto extends BaseDto<VerifyOtpInputDto> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  target: string

  @ApiProperty()
  @IsEnum(AUTH_OTP_PURPOSE)
  purpose: string
}

export class VerifyOtpOutputDto extends BaseDto<VerifyOtpOutputDto> {
  @ApiResponseProperty()
  @IsString()
  message: string
}
