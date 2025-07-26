import { HTTP_STATUS_CODE } from '@shared/api/api.types'
import { AppException } from '@shared/error/error.service'

export class CustomerAlreadyExistsException extends AppException {
  constructor(message: string = 'Customer already exists') {
    super(message, HTTP_STATUS_CODE.Conflict)
  }
}

export class CustomerSignupSessionExpireException extends AppException {
  constructor(message: string = 'Customer signup session expired') {
    super(message, HTTP_STATUS_CODE.Forbidden)
  }
}

export class CustomerNotFoundException extends AppException {
  constructor(message: string = 'Customer Not Found.') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}

export class CustomerAddressNotFoundException extends AppException {
  constructor(message: string = 'Customer Address Not Found.') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}

export class CustomerInvalidPasswordException extends AppException {
  constructor(message: string = 'Invalid Password') {
    super(message, HTTP_STATUS_CODE.Forbidden)
  }
}

export class CustomerAddressOwnershipException extends AppException {
  constructor(
    message: string = 'Customer address does not belong to customer',
  ) {
    super(message, HTTP_STATUS_CODE.Forbidden)
  }
}

export class CustomerAddressUpdateException extends AppException {
  constructor(message: string = 'Customer address update failed') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}
