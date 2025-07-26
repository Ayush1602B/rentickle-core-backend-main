import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppConfigService } from '@shared/config/config.service'
import { AppLogger } from '@shared/logging/logger.service'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { HTTP_STATUS_CODE } from './shared/api/api.types'
import { AppException } from './shared/error/error.service'

// const corsOptionsDelegate = (allowList: string | string[]) =>
//   function (req: any, callback: (err: Error | null, options: any) => void) {
//     if (!(allowList instanceof Array)) {
//       allowList = allowList.split(',')
//     }

//     let corsOptions = { origin: false, credentials: true } // default to false
//     if (allowList.indexOf(req.header('Origin')) !== -1) {
//       corsOptions = { ...corsOptions, origin: true } // reflect (enable) the requested origin in the CORS response
//     } else {
//       corsOptions = { ...corsOptions, origin: false } // disable CORS for this request
//     }

//     callback(null, corsOptions) // callback expects two parameters: error and options
//   }

async function bootstrap() {
  console.log('Starting server...')
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
  })

  const configService = new AppConfigService({
    APP_ROOT: process.cwd(),
  })
  const appLogger = new AppLogger(configService)

  app.use(helmet())

  if (configService.isProd()) {
    app.set('trust proxy', 1)
    app.disable('x-powered-by')
  }

  app.useLogger(appLogger)
  app.enableCors({
    origin: configService.get('ALLOWED_ORIGINS').split(','),
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to match DTO types
      whitelist: false, // Remove properties not defined in the DTO
      forbidNonWhitelisted: false, // Throw an error if extra properties are sent
      exceptionFactory: (errors) => {
        return new AppException(
          `Validation Pipe - ${errors.length} validation error(s)`,
          HTTP_STATUS_CODE.BadRequest,
          errors.map((error) => ({
            name: `Validation failed for - ${error.property}`,
            message: Object.values(error.constraints || {}).join(', '),
          })),
        )
      },
    }),
  )

  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Rentickle APIs')
    .setDescription('Rentickle api documentation')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  const DEFAULT_PORT = 3000
  await app.listen(configService.get('APP_PORT') || DEFAULT_PORT, () =>
    console.log(
      `Server is running on port ${configService.get('APP_PORT') || DEFAULT_PORT}`,
    ),
  )
}
bootstrap()
