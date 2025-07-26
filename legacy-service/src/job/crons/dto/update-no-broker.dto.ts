import { BaseDto } from '@/shared/api/api.types'
import { IsString } from 'class-validator'

export class FixNobrokerOrderRentalInputDto extends BaseDto<FixNobrokerOrderRentalInputDto> {
  @IsString()
  filePath: string
}

export interface OrderRowInfo {
  'Order ID': string | number
  'Total Notional Rent (without GST)': string | number
  'Total Running Rent': string | number
  'Total GST Amount': string | number
}
