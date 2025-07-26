import { HTTP_STATUS_CODE } from '@/shared/api/api.types'
import { AppException } from '@/shared/error/error.service'

export class RmpOrderNotFoundException extends AppException {
  constructor(message: string = 'RMP Order Not Found.') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
export class ShippingAddressNotFoundException extends AppException {
  constructor(message: string = 'Shipping Address Not Found.') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
