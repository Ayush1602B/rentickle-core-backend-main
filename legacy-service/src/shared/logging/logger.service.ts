import { Injectable, Scope } from '@nestjs/common'
import { AppConfigService } from '@shared/config/config.service'
import pino, { Logger } from 'pino'
import { ILogger, LOG_LEVEL } from './logger.types'

@Injectable({
  scope: Scope.TRANSIENT,
})
export class AppLogger implements ILogger {
  private readonly logger: Logger

  constructor(private readonly configService: AppConfigService) {
    this.logger = pino({
      level: this.configService.get('LOG_LEVEL') || LOG_LEVEL.INFO,
      name: this.configService.get('SERVICE_NAME'),
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          levelFirst: true,
          ignore: 'pid,hostname',
          singleLine: true,
        },
      },
    })
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams)
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    this.logger.fatal(message, ...optionalParams)
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams)
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams)
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams)
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    this.logger.trace(message, ...optionalParams)
  }

  /**
   * Write a 'info' level log.
   */
  info(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams)
  }
  /**
   * Write a 'verbose' level log.
   */
  trace(message: any, ...optionalParams: any[]) {
    this.logger.trace(message, ...optionalParams)
  }
}
