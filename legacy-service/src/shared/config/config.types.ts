export interface IEnvironmentKey {
  APP_ROOT: string
  NODE_ENV: ENVIRONMENT
  APP_HOST: string
  LOG_LEVEL: LOG_LEVEL
  APP_PORT: number
  CRON_APP_PORT: number
  MAGENTO_DATABASE_URI: string
  MAGENTO_DATABASE_DEBUG: boolean
  JWT_SECRET: string
  NPM_AUTH_TOKEN: string
  JWT_EXPIRES_IN: number
  SERVICE_NAME: string
  POSTGRES_DATABASE_URI: string
  POSTGRES_DATABASE_DEBUG: boolean
  ENCRYPTION_SALT_KEY: string
  GLOBAL_TEST_OTP: string
  MAGENTO_API_URL: string
  MAGENTO_API_USER: string
  MAGENTO_API_KEY: string
  RMP_DATABASE_URI: string
  RMP_DATABASE_DEBUG: boolean
  ALLOWED_ORIGINS: string
  SESSION_SECRET_KEY: string
  SESSION_COOKIE_NAME: string
  CACHE_REDIS_URI: string
  SESSION_REDIS_URI: string

  PAYU_BIZ_HOST: string
  PAYU_BIZ_MERCHANT_KEY: string
  PAYU_BIZ_SALT: string
  PAYU_BIZ_TXN_RANDOM_NO: string
  PAYU_BIZ_DEBUGGING: boolean

  API_BASE_URL: string
  WEB_BASE_URL: string

  MEDIA_BASE_URL: string
}

export enum ENVIRONMENT {
  local = 'local',
  dev = 'dev',
  stg = 'stg',
  sbx = 'sbx',
  prod = 'prod',
}

export const PAYU_ENV_MAP: {
  [key in ENVIRONMENT]: 'TEST' | 'PROD'
} = {
  [ENVIRONMENT.dev]: 'TEST',
  [ENVIRONMENT.local]: 'TEST',
  [ENVIRONMENT.sbx]: 'TEST',
  [ENVIRONMENT.stg]: 'TEST',
  [ENVIRONMENT.prod]: 'PROD',
}

import { LOG_LEVEL } from '@shared/logging/logger.types'
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class EnvironmentConfig implements IEnvironmentKey {
  [key: string]: IEnvironmentKey[keyof IEnvironmentKey]

  @IsString()
  APP_ROOT: string

  @IsEnum(ENVIRONMENT)
  NODE_ENV: ENVIRONMENT

  @IsString()
  APP_HOST: string

  @IsEnum(LOG_LEVEL)
  @IsOptional()
  LOG_LEVEL: LOG_LEVEL

  @IsNumber()
  APP_PORT: number

  @IsNumber()
  CRON_APP_PORT: number

  @IsString()
  MAGENTO_DATABASE_URI: string

  @IsBoolean()
  @IsOptional()
  MAGENTO_DATABASE_DEBUG: boolean

  @IsString()
  POSTGRES_DATABASE_URI: string

  @IsBoolean()
  @IsOptional()
  POSTGRES_DATABASE_DEBUG: boolean

  @IsString()
  RMP_DATABASE_URI: string

  @IsBoolean()
  @IsOptional()
  RMP_DATABASE_DEBUG: boolean

  @IsString()
  JWT_SECRET: string

  @IsString()
  @IsOptional()
  NPM_AUTH_TOKEN: string

  @IsNumber()
  JWT_EXPIRES_IN: number

  @IsString()
  SERVICE_NAME: string

  @IsString()
  ENCRYPTION_SALT_KEY: string

  @IsString()
  GLOBAL_TEST_OTP: string

  @IsString()
  MAGENTO_API_URL: string

  @IsString()
  MAGENTO_API_USER: string

  @IsString()
  MAGENTO_API_KEY: string

  @IsString()
  ALLOWED_ORIGINS: string

  @IsString()
  SESSION_SECRET_KEY: string

  @IsString()
  SESSION_COOKIE_NAME: string

  @IsString()
  @IsOptional()
  CACHE_REDIS_URI: string

  @IsString()
  @IsOptional()
  SESSION_REDIS_URI: string

  @IsString()
  PAYU_BIZ_HOST: string

  @IsString()
  PAYU_BIZ_MERCHANT_KEY: string

  @IsString()
  PAYU_BIZ_SALT: string

  @IsString()
  @IsOptional()
  PAYU_BIZ_TXN_RANDOM_NO: string

  @IsBoolean()
  @IsOptional()
  PAYU_BIZ_DEBUGGING: boolean

  @IsString()
  API_BASE_URL: string

  @IsString()
  WEB_BASE_URL: string

  @IsString()
  MEDIA_BASE_URL: string
}
