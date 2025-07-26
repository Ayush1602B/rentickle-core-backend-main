import { BaseDto } from '@/shared/api/api.types'
import { IsOptional, IsString } from 'class-validator'

export class PayuPaymentApiRequestDto extends BaseDto<PayuPaymentApiRequestDto> {
  [key: string]: any

  @IsString()
  key: string

  @IsString()
  hash: string

  @IsString()
  txnid: string

  @IsString()
  amount: string

  @IsString()
  productinfo: string

  @IsString()
  firstname: string

  @IsString()
  email: string

  @IsString()
  phone: string

  @IsString()
  surl: string

  @IsString()
  furl: string

  @IsString()
  @IsOptional()
  lastname?: string

  @IsString()
  @IsOptional()
  address1?: string

  @IsString()
  @IsOptional()
  address2?: string

  @IsString()
  @IsOptional()
  city?: string

  @IsString()
  @IsOptional()
  state?: string

  @IsString()
  @IsOptional()
  country?: string

  @IsString()
  @IsOptional()
  zipcode?: string

  @IsString()
  @IsOptional()
  enforce_paymethod?: string

  @IsString()
  @IsOptional()
  drop_category?: string

  @IsString()
  @IsOptional()
  udf1?: string

  @IsString()
  @IsOptional()
  udf2?: string

  @IsString()
  @IsOptional()
  udf3?: string

  @IsString()
  @IsOptional()
  udf4?: string

  @IsString()
  @IsOptional()
  udf5?: string
}

export class PayuPaymentApiResponseDto extends PayuPaymentApiRequestDto {
  @IsString()
  mihpayid: string

  @IsString()
  mode: string

  @IsString()
  status: string

  @IsString()
  unmappedstatus: string

  @IsString()
  @IsOptional()
  discount: string

  @IsString()
  @IsOptional()
  net_amount_debit: string

  @IsString()
  @IsOptional()
  addedon: string

  @IsString()
  @IsOptional()
  udf6: string

  @IsString()
  @IsOptional()
  udf7: string

  @IsString()
  @IsOptional()
  udf8: string

  @IsString()
  @IsOptional()
  udf9: string

  @IsString()
  @IsOptional()
  udf10: string

  @IsString()
  @IsOptional()
  field1: string

  @IsString()
  @IsOptional()
  field2: string

  @IsString()
  @IsOptional()
  field3: string

  @IsString()
  @IsOptional()
  field4: string

  @IsString()
  @IsOptional()
  field5: string

  @IsString()
  @IsOptional()
  field6: string

  @IsString()
  @IsOptional()
  field7: string

  @IsString()
  @IsOptional()
  field8: string

  @IsString()
  @IsOptional()
  field9: string

  @IsString()
  @IsOptional()
  payment_source: string

  @IsString()
  @IsOptional()
  PG_TYPE: string

  @IsString()
  @IsOptional()
  bank_ref_num: string

  @IsString()
  @IsOptional()
  bankcode: string

  @IsString()
  @IsOptional()
  error: string

  @IsString()
  @IsOptional()
  error_Message: string

  @IsString()
  @IsOptional()
  splitInfo: string

  @IsString()
  @IsOptional()
  pa_name: string
}
