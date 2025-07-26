import { AuthTokenPayload } from '@/iam/auth/auth.types'
import { HttpStatus } from '@nestjs/common'
import { TraceState } from '@shared/trace/trace.types'
import { Request as ExpressRequest, Response as ExpressResponse } from 'express'

export type BaseObject = any & {
  [key: string]: any
}

export class BaseDto<T = any> {
  constructor(data: Partial<T>) {
    Object.assign(this, data)
  }
}

export enum HTTP_STATUS_CODE {
  BadRequest = HttpStatus.BAD_REQUEST,
  Unauthorized = HttpStatus.UNAUTHORIZED,
  Forbidden = HttpStatus.FORBIDDEN,
  NotFound = HttpStatus.NOT_FOUND,
  UnprocessableEntity = HttpStatus.UNPROCESSABLE_ENTITY,
  InternalServerError = HttpStatus.INTERNAL_SERVER_ERROR,
  ServiceUnavailable = HttpStatus.SERVICE_UNAVAILABLE,
  GatewayTimeout = HttpStatus.GATEWAY_TIMEOUT,
  Ok = HttpStatus.OK,
  Created = HttpStatus.CREATED,
  Updated = HttpStatus.OK,
  Conflict = HttpStatus.CONFLICT,
}

export interface AppError {
  name: string
  statusCode: number
  message: string
}

export type ResponseError = {
  name: string
  message: string
  type?: string
}

export type ResponseDTO<DataDTO extends BaseObject> = {
  requestId?: string
  success?: boolean
  statusCode?: HTTP_STATUS_CODE
  data: DataDTO
  errors: ResponseError[] | null
}

// ********** SECTION 5: REQUEST VALIDATION **********
export enum REQUEST_VALIDATION_TYPE {
  BODY = 'BODY',
  PARAMS = 'PARAMS',
  QUERY = 'QUERY',
  HEADERS = 'HEADERS',
  COOKIE = 'COOKIE',
}

// ********** SECTION 2: TYPES DEFINITION **********
// Basic Types
export type BaseRequest = ExpressRequest & {
  [key: string]: any
  trace: TraceState
  storeId: number
  parsedQuery?: BaseObject
}

export type BaseResponse = ExpressResponse & {
  [key: string]: any
  trace: TraceState
}

export type AuthenticatedRequest = BaseRequest & {
  auth: {
    token: string
    decoded: AuthTokenPayload
  }
}

export interface BaseListRequestInputDto {
  filters: string
  sorts: string
  page: number
  limit: number
}

export interface BaseListResponseOutputDto<T> {
  list: T[]
  length: number
  page: number
  limit: number
  hasMore?: boolean
  total?: number
}

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_LIMIT = 50

export enum DEFAULT_API_HEADER {
  X_STORE_ID = 'x-store-id',
}
