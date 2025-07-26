import { AppException } from '@shared/error/error.service'
import { HTTP_STATUS_CODE } from '@shared/api/api.types'

export class InvalidStoreProvidedException extends AppException {
  constructor(message: string = 'Invalid store is provided for category tree') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class InvalidRootCategoryException extends AppException {
  constructor(message: string = 'Invalid root category provided') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}

export class CategoryNotFoundException extends AppException {
  constructor(message: string = 'Category not found') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
