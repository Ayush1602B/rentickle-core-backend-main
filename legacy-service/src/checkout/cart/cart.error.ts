import { HTTP_STATUS_CODE } from '@/shared/api/api.types'
import { AppException } from '@/shared/error/error.service'

export class CartEmptyException extends AppException {
  constructor(message: string = 'Cart is empty') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CartNotFoundException extends AppException {
  constructor(message: string = 'Cart not found!') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}

export class CartInvalidProductException extends AppException {
  constructor(message: string = 'Invalid product supplied') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CartInvalidIdentifierException extends AppException {
  constructor(message: string = 'Invalid existing cart identifier') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CartInvalidStoreException extends AppException {
  constructor(message: string = 'Invalid store provided!') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CartInvalidItemException extends AppException {
  constructor(message: string = 'Item not present') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}

export class CartInvalidCustomerException extends AppException {
  constructor(message: string = 'Invalid customer') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CartInvalidAddressException extends AppException {
  constructor(message: string = 'Invalid address') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CartInvalidException extends AppException {
  constructor(message: string = 'Invalid cart') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}
