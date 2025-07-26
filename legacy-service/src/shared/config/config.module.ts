import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HTTP_STATUS_CODE } from '@shared/api/api.types'
import { GLOBAL_TEST_OTP } from '@shared/constants'
import { AppException } from '@shared/error/error.service'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { AppConfigService } from './config.service'
import { EnvironmentConfig, IEnvironmentKey } from './config.types'
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: 'environment/.env',
      validate: async (config) => {
        const validConfig: IEnvironmentKey = {
          APP_ROOT: process.cwd(),
          NODE_ENV: config.NODE_ENV,
          APP_PORT: parseInt(config.APP_PORT, 10),
          CRON_APP_PORT: parseInt(config.CRON_APP_PORT, 10),
          APP_HOST: config.APP_HOST,
          JWT_SECRET: config.JWT_SECRET,
          JWT_EXPIRES_IN: parseInt(config.JWT_EXPIRES_IN),
          LOG_LEVEL: config.LOG_LEVEL,
          MAGENTO_DATABASE_URI: config.MAGENTO_DATABASE_URI,
          MAGENTO_DATABASE_DEBUG: config.MAGENTO_DATABASE_DEBUG === 'true',
          NPM_AUTH_TOKEN: config.NPM_AUTH_TOKEN,
          SERVICE_NAME: config.SERVICE_NAME,
          POSTGRES_DATABASE_URI: config.POSTGRES_DATABASE_URI,
          POSTGRES_DATABASE_DEBUG: config.POSTGRES_DATABASE_DEBUG === 'true',
          ENCRYPTION_SALT_KEY: config.ENCRYPTION_SALT_KEY,
          GLOBAL_TEST_OTP: config.GLOBAL_TEST_OTP || GLOBAL_TEST_OTP.toString(),
          MAGENTO_API_URL: config.MAGENTO_API_URL,
          MAGENTO_API_KEY: config.MAGENTO_API_KEY,
          MAGENTO_API_USER: config.MAGENTO_API_USER,
          RMP_DATABASE_URI: config.RMP_DATABASE_URI,
          RMP_DATABASE_DEBUG: config.RMP_DATABASE_DEBUG === 'true',
          ALLOWED_ORIGINS: config.ALLOWED_ORIGINS,
          SESSION_SECRET_KEY: config.SESSION_SECRET_KEY || 'session-secret-key',
          SESSION_COOKIE_NAME: config.SESSION_COOKIE_NAME || 'connect.sid',
          CACHE_REDIS_URI: config.CACHE_REDIS_URI,
          SESSION_REDIS_URI: config.SESSION_REDIS_URI,
          PAYU_BIZ_HOST: config.PAYU_BIZ_HOST || 'https://test.payu.in',
          PAYU_BIZ_MERCHANT_KEY: config.PAYU_BIZ_MERCHANT_KEY,
          PAYU_BIZ_SALT: config.PAYU_BIZ_SALT,
          PAYU_BIZ_TXN_RANDOM_NO:
            config.PAYU_BIZ_TXN_RANDOM_NO || 'txn-random-no',
          PAYU_BIZ_DEBUGGING: config.PAYU_BIZ_DEBUGGING === 'true',
          API_BASE_URL: config.API_BASE_URL,
          WEB_BASE_URL: config.WEB_BASE_URL,
          MEDIA_BASE_URL: config.MEDIA_BASE_URL,
        }

        const envConfig = plainToInstance(EnvironmentConfig, validConfig)
        const errors = await validate(envConfig)

        if (errors.length) {
          console.error(errors[0].constraints)
          throw new AppException(
            'Invalid configuration',
            HTTP_STATUS_CODE.InternalServerError,
            errors.map((error) => ({
              name: error.property,
              message: error.toString(),
            })),
          )
        }

        return envConfig
      },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
