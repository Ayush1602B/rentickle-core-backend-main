import { HTTP_STATUS_CODE } from '@/shared/api/api.types'
import { AppException } from '@/shared/error/error.service'

export class PaymentMethodNotFoundException extends AppException {
  constructor(message: string = 'Payment Method Not Found.') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}

export class PaymentMethodPayuClientException extends AppException {
  constructor(message: string = 'Payment Method Payu Client Error.') {
    super(message, HTTP_STATUS_CODE.InternalServerError)
  }
}

export class PaymentPauyClientException extends AppException {
  constructor(message: string = 'Payment Method Payu Client Error.') {
    super(message, HTTP_STATUS_CODE.InternalServerError)
  }
}

export class PaymentInvalidTxnIdException extends AppException {
  constructor(message: string = 'Invalid Transaction Id.') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}
