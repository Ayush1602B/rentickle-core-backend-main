import { BaseDto } from '@/shared/api/api.types'
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger'
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator'

export class RegisterCustomerInputDto extends BaseDto<RegisterCustomerInputDto> {
  @ApiProperty()
  @IsString()
  firstName: string

  @ApiProperty()
  @IsString()
  lastName: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsPhoneNumber()
  phone: string

  @ApiProperty()
  @IsOptional()
  password: string | null

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  storeId: number
}

export class RegisterCustomerOutputDto extends BaseDto<RegisterCustomerOutputDto> {
  @ApiResponseProperty()
  @IsString()
  declare message: string

  @ApiResponseProperty()
  @IsString()
  declare accessToken: string
}
