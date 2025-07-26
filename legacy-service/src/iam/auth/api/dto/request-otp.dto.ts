import { IsEnum, IsString } from 'class-validator'
import { AUTH_OTP_PURPOSE } from '../../auth.types'
import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'

export class RequestOtpInputDto extends BaseDto<RequestOtpInputDto> {
  @ApiProperty()
  @IsString()
  target: string

  @ApiProperty()
  @IsEnum(AUTH_OTP_PURPOSE)
  purpose: string
}

export class RequestOtpOutputDto extends BaseDto<RequestOtpOutputDto> {
  @ApiResponseProperty()
  @IsString()
  message: string

  @ApiResponseProperty()
  @IsString()
  expiresIn: string
}
