import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator'
import { BaseDto } from './api/api.types'

export class BaseAddressDto extends BaseDto<BaseAddressDto> {
  @IsString()
  @IsOptional()
  declare firstName: string

  @IsString()
  @IsOptional()
  declare lastName: string

  @IsString()
  @IsOptional()
  declare phone: string

  @IsString()
  @IsNotEmpty()
  declare line1: string

  @IsString()
  @IsOptional()
  declare line2: string

  @IsString()
  @IsOptional()
  declare landmark: string

  @IsString()
  @IsOptional()
  declare country: string

  @IsString()
  declare countryId: string

  @IsNumber()
  declare regionId: number

  @IsNumber()
  declare cityId: number

  @IsString()
  declare company: string

  @IsPostalCode('IN')
  declare postcode: string

  @IsNumber()
  @IsOptional()
  declare latitude: number | null

  @IsNumber()
  @IsOptional()
  declare longitude: number | null
}

export const DEFAULT_CURRENCY_CODE = 'INR'
export const DEFAULT_COUNTRY_CODE = 'IN'
