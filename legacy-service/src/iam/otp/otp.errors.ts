import { HTTP_STATUS_CODE } from '@shared/api/api.types'
import { AppException } from '@shared/error/error.service'

export class OtpExpiredException extends AppException {
  constructor(message: string = 'Otp expired') {
    super(message, HTTP_STATUS_CODE.Unauthorized)
  }
}
export class OtpAttempExhaustedException extends AppException {
  constructor(message: string = 'No more attempts left to retry') {
    super(message, HTTP_STATUS_CODE.Unauthorized)
  }
}
export class OtpInvalidException extends AppException {
  constructor(message: string = 'Invalid Otp') {
    super(message, HTTP_STATUS_CODE.Unauthorized)
  }
}

export class OtpAlreadyUsedException extends AppException {
  constructor(message: string = 'Otp has already been used') {
    super(message, HTTP_STATUS_CODE.Unauthorized)
  }
}

export class OtpInvalidTargetException extends AppException {
  constructor(message: string = 'Invalid target') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}
