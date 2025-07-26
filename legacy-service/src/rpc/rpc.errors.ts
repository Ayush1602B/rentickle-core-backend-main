import { HTTP_STATUS_CODE } from '@shared/api/api.types'
import { AppException } from '@shared/error/error.service'

export class RPCUnavailableException extends AppException {
  constructor(message: string = 'Service not available') {
    super(message, HTTP_STATUS_CODE.ServiceUnavailable)
  }
}
