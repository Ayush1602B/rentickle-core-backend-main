import { HTTP_STATUS_CODE } from '@shared/api/api.types'
import { AppException } from '@shared/error/error.service'

export class StoreNotFoundExeption extends AppException {
  constructor(message: string = 'Store Not Found.') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}

export class LocationCityNotFoundException extends AppException {
  constructor(message: string = 'Location City Not Found.') {
    super(message, HTTP_STATUS_CODE.NotFound)
  }
}
