import { HTTP_STATUS_CODE } from '@/shared/api/api.types'
import { AppException } from '@/shared/error/error.service'

export class ShippingMethodNotFoundException extends AppException {
  constructor(message: string = 'Shipping Method Not Found.') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
