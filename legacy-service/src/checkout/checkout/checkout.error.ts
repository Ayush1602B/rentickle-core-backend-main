import { HTTP_STATUS_CODE } from '@/shared/api/api.types'
import { AppException } from '@/shared/error/error.service'

export class CheckoutNoCartException extends AppException {
  constructor(message: string = 'No cart found') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}

export class CheckoutCartOwnerException extends AppException {
  constructor(message: string = 'Cart owner is not the same as customer') {
    super(message, HTTP_STATUS_CODE.Forbidden)
  }
}

export class CheckoutGuestNotAllowedException extends AppException {
  constructor(message: string = 'Guests are not allowed to checkout') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CheckoutInvalidBillingAddressException extends AppException {
  constructor(message: string = 'Invalid billing address') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CheckoutInvalidShippingAddressException extends AppException {
  constructor(message: string = 'Invalid shipping address') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CheckoutInvalidCartException extends AppException {
  constructor(message: string = 'Invalid cart') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CheckoutAcceptTermsException extends AppException {
  constructor(message: string = 'You must accept the terms and conditions') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CheckoutInvalidPaymentMethodException extends AppException {
  constructor(message: string = 'Invalid payment method') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}
export class CheckoutInvalidShippingMethodException extends AppException {
  constructor(message: string = 'Invalid shipping method') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CheckoutInvalidStoreException extends AppException {
  constructor(message: string = 'Invalid store') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CheckoutInvalidOrderException extends AppException {
  constructor(message: string = 'Invalid order') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CheckoutInvalidPaymentResponseException extends AppException {
  constructor(message: string = 'Invalid payment response') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CheckoutInvalidPaymentException extends AppException {
  constructor(message: string = 'Requires payment confirmation') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CheckoutInvalidCustomerException extends AppException {
  constructor(message: string = 'Invalid customer') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}
