import { DEFAULT_STORE_ID } from '@/database/db.types'
import { ApiHeaderOptions, ApiQueryOptions } from '@nestjs/swagger'
import { DEFAULT_API_HEADER } from './api.types'

export const SWAGGER_STORE_ID_QUERY: ApiQueryOptions = {
  name: 'storeId',
  description: 'Store ID',
  required: false,
  default: DEFAULT_STORE_ID,
}

export const SWAGGER_STORE_ID_HEADER: ApiHeaderOptions = {
  name: DEFAULT_API_HEADER.X_STORE_ID,
  description: 'Store ID',
  required: false,
  schema: {
    type: 'number',
  },
}

export const SWAGGER_AUTH_TOKEN_HEADER: ApiHeaderOptions = {
  name: 'Authorization',
  description: 'Authorization token',
  required: true,
  schema: {
    type: 'string',
  },
}
