import { HTTP_STATUS_CODE } from '@shared/api/api.types'
import { AppException } from '@shared/error/error.service'

export class CustomerNotFoundException extends AppException {
  constructor(message: string = 'Customer not found') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
export class CustomerIdNullException extends AppException {
  constructor(message: string = 'Customer ID not found ') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
export class ShippingAddressNotFoundException extends AppException {
  constructor(message: string = 'Shipping address not found') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
