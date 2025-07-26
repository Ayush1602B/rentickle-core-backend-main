import { BaseDto } from '@/shared/api/api.types'
import { IsEmailOrMobileConstraint } from '@/shared/validators/dto-field.validator'
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'

export class LoginWithPasswordInputDto extends BaseDto<LoginWithPasswordInputDto> {
  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsEmailOrMobileConstraint)
  loginId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString({
    message: 'Password must be a string and minimum 6 characters',
  })
  @MinLength(6)
  password: string
}

export class LoginWithPasswordOutputDto extends BaseDto<LoginWithPasswordOutputDto> {
  @ApiResponseProperty()
  @IsString()
  accessToken: string
}
