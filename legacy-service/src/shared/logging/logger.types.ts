export enum LOG_LEVEL {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export interface ILogger {
  trace(message: string, ...args: any[]): void
  trace(context: object, message: string, ...args: any[]): void
  trace(message: object): void
  trace(message: Error): void

  debug(message: string, ...args: any[]): void
  debug(context: object, message: string, ...args: any[]): void
  debug(message: object): void
  debug(message: Error): void

  info(message: string, ...args: any[]): void
  info(context: object, message: string, ...args: any[]): void
  info(message: object): void
  info(message: Error): void

  warn(message: string, ...args: any[]): void
  warn(context: object, message: string, ...args: any[]): void
  warn(message: object): void
  warn(message: Error): void

  error(message: string, ...args: any[]): void
  error(context: object, message: string, ...args: any[]): void
  error(message: object): void
  error(message: Error): void

  fatal(message: string, ...args: any[]): void
  fatal(context: object, message: string, ...args: any[]): void
  fatal(message: object): void
  fatal(message: Error): void
}
