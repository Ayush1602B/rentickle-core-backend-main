import { NestMiddleware } from '@nestjs/common'
import { NextFunction } from 'express'
import { parseQueryString } from '../utils/query-parser.util'
import { BaseRequest, BaseResponse } from './api.types'

export class QueryParseMiddleware implements NestMiddleware {
  constructor(
    private readonly allowedFilters: string[],
    private readonly allowedSorts: string[],
  ) {
    this.use = this.use.bind(this)
  }

  use(req: BaseRequest, res: BaseResponse, next: NextFunction) {
    console.info('QueryParseMiddleware: Parsing query string')

    const queryString = req.originalUrl.split('?')[1] || ''
    const parsedQuery = parseQueryString(queryString)
    const { filters, sorts } = parsedQuery

    for (const filter in filters) {
      if (
        !this.allowedFilters.includes(filter) &&
        !this.allowedFilters.includes('*')
      ) {
        delete filters[filter]
      }
    }

    for (const sortField in sorts) {
      if (
        !this.allowedSorts.includes(sortField) &&
        !this.allowedSorts.includes('*')
      ) {
        delete sorts[sortField]
      }
    }

    req.parsedQuery = parsedQuery
    next()
  }
}
