import { DEFAULT_STORE_VIEW_ID } from '@/database/db.types'
import { NestMiddleware } from '@nestjs/common'
import { NextFunction } from 'express'
import { BaseRequest, BaseResponse, DEFAULT_API_HEADER } from './api.types'

export class StoreResolverMiddleware implements NestMiddleware {
  constructor() {}

  use(req: BaseRequest, res: BaseResponse, next: NextFunction) {
    const storeId = this._getStoreId(req)

    req.storeId = storeId
    next()
  }

  private _getStoreId(req: BaseRequest): number {
    const storeIdFromHeader = req.headers[
      DEFAULT_API_HEADER.X_STORE_ID
    ] as string
    const storeIdFromQuery = req.query.storeId as string
    return Number(
      storeIdFromHeader || storeIdFromQuery || DEFAULT_STORE_VIEW_ID,
    )
  }
}
