import { HTTP_STATUS_CODE } from '@/shared/api/api.types'
import { AppException } from '@/shared/error/error.service'

export class OrderEmptyCartException extends AppException {
  constructor(message: string = 'Cart is empty') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class OrderInvalidCartException extends AppException {
  constructor(message: string = 'Invalid cart') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class OrderInvalidEntityException extends AppException {
  constructor(message: string = 'Invalid entity') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class OrderUnauthorisedPaymentException extends AppException {
  constructor(message: string = 'Invalid order payment!') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class OrderNotFoundException extends AppException {
  constructor(message: string = 'Order not found!') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
export class ShippingAddressNotFoundException extends AppException {
  constructor(message: string = 'Shipping address not found!') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}

export class OrderUnableToCreateException extends AppException {
  constructor(message: string = 'Unable to create order!') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class OrderInvalidPaymentMethodException extends AppException {
  constructor(message: string = 'Invalid payment method!') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}
