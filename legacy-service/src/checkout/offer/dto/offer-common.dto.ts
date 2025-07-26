import { BaseDto } from '@/shared/api/api.types'

export class OfferDto extends BaseDto<OfferDto> {
  couponId: number
  couponCode: string
  expirationDate: Date

  ruleId: number
  name: string
  description?: string | null
  fromDate: Date
  toDate: Date
  isActive: boolean
  sortOrder: number
  discountAmount: number
  timesUsed: number
  couponType: number
}
