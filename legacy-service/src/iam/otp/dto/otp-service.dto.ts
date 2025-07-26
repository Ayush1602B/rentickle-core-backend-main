import { BaseDto } from '@/shared/api/api.types'
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator'

export class GenerateAndSendOtpInputDto extends BaseDto<GenerateAndSendOtpInputDto> {
  @IsString()
  target: string

  @IsString()
  purpose: string

  @IsNumber()
  @IsOptional()
  verifyAttempts?: number

  @IsNumber()
  @IsOptional()
  retryAttempts?: number

  @IsDateString()
  @IsOptional()
  expiryAt?: Date
}

export class GenerateAndSendOtpOutputDto extends BaseDto<GenerateAndSendOtpOutputDto> {
  remainingVerifyAttempts: number
  remainingRetryAttempts: number
  expiresIn: string
}

export class VerifyOtpInputDto extends BaseDto<VerifyOtpInputDto> {
  @IsString()
  target: string

  @IsString()
  otp: string

  @IsString()
  purpose: string
}

export class VerifyOtpOutputDto extends BaseDto<VerifyOtpOutputDto> {
  verified: boolean
}

export class IsOtpVerifiedInputDto extends BaseDto<IsOtpVerifiedInputDto> {
  @IsString()
  target: string

  @IsString()
  purpose: string

  @IsNumber()
  @IsOptional()
  allowedWindowInMinutes?: number
}
