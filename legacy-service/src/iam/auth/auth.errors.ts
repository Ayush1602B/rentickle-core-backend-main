import { HTTP_STATUS_CODE } from '@shared/api/api.types'
import { AppException } from '@shared/error/error.service'

export class BadCredentialsException extends AppException {
  constructor(message: string = 'Bad credentials provided.') {
    super(message, HTTP_STATUS_CODE.Unauthorized)
  }
}
export class InternalServerException extends AppException {
  constructor(message: string = 'Internal server error ') {
    super(message, HTTP_STATUS_CODE.InternalServerError)
  }
}
export class OtpCreationException extends AppException {
  constructor(message: string = 'Something is wrong please try again') {
    super(message, HTTP_STATUS_CODE.InternalServerError)
  }
}

export class InvalidTokenException extends AppException {
  constructor(message: string = 'The token provided is invalid.') {
    super(message, HTTP_STATUS_CODE.Forbidden)
  }
}

export class EmailAlreadyExistsException extends AppException {
  constructor(message: string = 'The email address is already in use.') {
    super(message, HTTP_STATUS_CODE.Conflict)
  }
}

export class PhoneAlreadyExistsException extends AppException {
  constructor(message: string = 'The phone number is already in use.') {
    super(message, HTTP_STATUS_CODE.Conflict)
  }
}

export class OtpValidationException extends AppException {
  constructor(message: string = 'Invalid or expired OTP.') {
    super(message, HTTP_STATUS_CODE.Unauthorized)
  }
}

export class CustomerCreationFailedException extends AppException {
  constructor(message: string = 'Failed to create customer') {
    super(message, HTTP_STATUS_CODE.BadRequest)
  }
}

export class TokenValidationFailedException extends AppException {
  constructor(message: string = 'Failed to validate customer token.') {
    super(message, HTTP_STATUS_CODE.Unauthorized)
  }
}

export class AuthUserAlreadyExistsException extends AppException {
  constructor(message: string = 'User already exists') {
    super(message, HTTP_STATUS_CODE.Conflict)
  }
}

export class AuthSignupOtpExpiredException extends AppException {
  constructor(message: string = 'OTP expired') {
    super(message, HTTP_STATUS_CODE.Unauthorized)
  }
}
