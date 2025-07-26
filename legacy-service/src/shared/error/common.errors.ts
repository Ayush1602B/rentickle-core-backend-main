import { HTTP_STATUS_CODE } from '@shared/api/api.types'
import { AppException } from '@shared/error/error.service'

export class InvalidStoreIdException extends AppException {
  constructor() {
    super(
      'Invalid store id, store id must be a numeric value!',
      HTTP_STATUS_CODE.BadRequest,
    )
  }
}
