import { HTTP_STATUS_CODE } from '@/shared/api/api.types'
import { AppException } from '@/shared/error/error.service'

export class EavAttributeSetNotFoundException extends AppException {
  constructor(message: string = 'Attribute set not found') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
