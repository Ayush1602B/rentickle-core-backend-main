import { HttpException } from '@nestjs/common'
import { HTTP_STATUS_CODE, ResponseError } from '@shared/api/api.types'

class BaseException extends HttpException {
  readonly errors: ResponseError[]

  constructor(
    message: string,
    statusCode = HTTP_STATUS_CODE.InternalServerError,
    errors: ResponseError[] = [],
    ...args: any[]
  ) {
    super(message, statusCode, ...args)

    super.name = this.constructor.name

    if (errors.length === 0) {
      errors.push({
        name: this.name,
        message,
      })
    }

    this.errors = errors
  }
}

export class AppException extends BaseException {
  constructor(
    message: string,
    statusCode = HTTP_STATUS_CODE.InternalServerError,
    errors: ResponseError[] = [],
    ...args: any[]
  ) {
    super(message, statusCode, errors, ...args)
  }
}
