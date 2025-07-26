import { HTTP_STATUS_CODE } from '@shared/api/api.types'
import { AppException } from '@shared/error/error.service'

export class CategoryNotFoundException extends AppException {
  constructor(message: string = 'Category not found') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
export class ProductNotFoundException extends AppException {
  constructor(message: string = 'Product not found') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}

export class ProductInvalidSelectOptionException extends AppException {
  constructor(message: string = 'Invalid option selected for product') {
    super(message, HTTP_STATUS_CODE.UnprocessableEntity)
  }
}
