import { BaseDto } from '@/shared/api/api.types'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator'
import { CustomerAddressDto } from './customer-common.dto'

export class UpsertCustomerAddressInputDto extends BaseDto<UpsertCustomerAddressInputDto> {
  @IsOptional()
  @IsString()
  addressId?: number

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  line1: string

  @IsOptional()
  @IsString()
  line2: string

  @IsString()
  @IsNotEmpty()
  landmark: string

  @IsString()
  @IsNotEmpty()
  country: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  state: string

  @IsPostalCode('IN')
  @IsNotEmpty()
  pincode: string

  @IsNumber()
  @IsNotEmpty()
  regionId: number

  @IsNumber()
  @IsNotEmpty()
  cityId: number

  @IsNumber()
  @IsNotEmpty()
  latitude: number

  @IsString()
  @IsNotEmpty()
  longitude: number

  @IsString()
  @IsNotEmpty()
  addressType: string
}

export class UpsertCustomerAddressOutputDto extends CustomerAddressDto {}
