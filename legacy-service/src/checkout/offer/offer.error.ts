import { HTTP_STATUS_CODE } from '@shared/api/api.types'
import { AppException } from '@shared/error/error.service'

export class CustomerCartNotExistsException extends AppException {
  constructor(message: string = 'Invalid cartId') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}

export class NoSalesRulesFoundForCartException extends AppException {
  constructor(message: string = 'No sales rules found for cart') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
