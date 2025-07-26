import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppConfigService } from '@shared/config/config.service'
import { AppLogger } from '@shared/logging/logger.service'
import { CronAppModule } from './cron.module'

async function bootstrap() {
  console.log('Starting server...')
  const app = await NestFactory.create(CronAppModule, {
    snapshot: true,
  })
  const configService = new AppConfigService({
    APP_ROOT: process.cwd(),
  })

  const appLogger = new AppLogger(configService)
  app.useLogger(appLogger)
  // app.use(new TracingMiddleware().use)
  // app.use(new LoggingMiddleware().use)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to match DTO types
      whitelist: true, // Remove properties not defined in the DTO
      forbidNonWhitelisted: false, // Throw an error if extra properties are sent
    }),
  )

  app.setGlobalPrefix('api')

  const DEFAULT_PORT = 3001
  await app.listen(configService.get('CRON_APP_PORT') || DEFAULT_PORT, () =>
    console.log(
      `Server is running on port ${configService.get('CRON_APP_PORT') || DEFAULT_PORT}`,
    ),
  )
}
bootstrap()
