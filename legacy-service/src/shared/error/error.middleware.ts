import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import {
  BaseResponse,
  HTTP_STATUS_CODE,
  ResponseDTO,
} from '@shared/api/api.types'
import { AppLogger } from '@shared/logging/logger.service'
import { AppException } from './error.service'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  private extractStatusCode(exception: HttpException | AppException) {
    let status = HTTP_STATUS_CODE.InternalServerError

    if (exception instanceof HttpException) {
      status = exception.getStatus()
    }

    if (exception instanceof AppException) {
      status = exception.getStatus()
    }

    return status
  }

  catch(exception: HttpException | AppException, host: ArgumentsHost) {
    console.log('GlobalExceptionFilter')
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<BaseResponse>()
    const status = this.extractStatusCode(exception)

    let errorResponse: ResponseDTO<null> = {
      success: false,
      statusCode: status,
      data: null,
      errors: [
        {
          name: exception.name,
          message: exception.message,
        },
      ],
    }

    if (exception instanceof AppException) {
      errorResponse = {
        ...errorResponse,
        errors: exception.errors,
      }
    }

    if (response.trace) {
      errorResponse = {
        ...errorResponse,
        requestId: response.trace?.requestId,
      }
    }

    response.status(status).json(errorResponse)
  }
}
