import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common'
import {
  BaseRequest,
  BaseResponse,
  HTTP_STATUS_CODE,
} from '@shared/api/api.types'
import { AppLogger } from '@shared/logging/logger.service'
import { TraceService } from '@shared/trace/trace.service'
import { Observable } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { DatabaseError } from 'sequelize'

enum LOG_MSG_KEYS {
  requestId = 'requestId',
  protocol = 'protocol',
  method = 'method',
  url = 'url',
  responseTime = 'responseTime',
  statusCode = 'statusCode',
  contentLength = 'contentLength',
  originalTimestamp = 'originalTimestamp',
  ip = 'ip',
  originalIp = 'originalIp',
  context = 'context',
  userAgent = 'userAgent',
  platform = 'platform',
  device = 'device',
  fkRequestId = 'fkRequestId',
}

type PrintableLogObject = {
  [keyof in LOG_MSG_KEYS]?: string
} & {
  [key: string]: any
  request: Pick<BaseRequest, 'body' | 'headers' | 'query' | 'params'>
}

@Injectable({
  scope: Scope.REQUEST,
})
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: AppLogger,
    private readonly traceService: TraceService,
  ) {}

  private convertLogObjectToString = (logObject: PrintableLogObject) =>
    Object.keys(LOG_MSG_KEYS).reduce((acc, curr) => {
      acc += `${logObject[curr] || '-'} `
      return acc
    }, '')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('LoggingInterceptor intercept')
    const req = context.switchToHttp().getRequest<BaseRequest>()
    // console.log('LoggingInterceptor', this.traceService.getTrace())
    let trace = this.traceService.getTrace()

    if (!trace) {
      trace = {}
    }

    let logObject: PrintableLogObject = {
      requestId: trace?.requestId || '-',
      fkRequestId: trace?.fkRequestId || '-',
      originalIp: trace?.originalIp || '-',
      device: trace?.device || '-',
      platform: trace?.platform || '-',
      originalTimestamp: trace?.originalTimestamp?.toString() || '-',
      context: trace?.context || 'unknown',
      ip: req.ip,
      protocol: req.protocol,
      method: req.method,
      url: req.url,
      userAgent: req.get('user-agent') || '-',
      request: {
        body: req.body,
        headers: req.headers,
        query: req.query,
        params: req.params,
      },
    }

    return next.handle().pipe(
      tap(() => {
        console.log('LoggingInterceptor tap')
        const res = context.switchToHttp().getResponse<BaseResponse>()
        const now = Date.now()

        logObject = {
          ...logObject,
          statusCode: res.statusCode?.toString() || '-',
          contentLength: res.get('content-length') || '-',
          responseTime: now - trace.serverTimestamp + 'ms',
        }

        const logMsg = this.convertLogObjectToString(logObject)

        res.trace = trace

        this.logger.info(logMsg)
        this.logger.debug(logObject, logMsg)
      }),
      catchError((err) => {
        console.log('LoggingInterceptor catchError')

        const res = context.switchToHttp().getResponse<BaseResponse>()
        const now = Date.now()

        logObject = {
          ...logObject,
          statusCode: err.status || HTTP_STATUS_CODE.InternalServerError,
          contentLength: res.get('content-length') || '-',
          responseTime: now - trace.serverTimestamp + 'ms',
        }

        const logMsg = this.convertLogObjectToString(logObject)
        this.logger.error(logMsg)
        this.logger.debug(logObject, logMsg)

        const errLogMsg = `${logObject.requestId} ${err.name}: ${err.message}`
        const errOrigName = err.name
        const errOrigMessage = err.message

        err.name = logObject.requestId || errOrigName
        err.message = logObject.requestId
          ? `${errOrigName}: ${errOrigMessage}`
          : errOrigMessage

        // this.logger.error(errLogMsg)

        if (err instanceof DatabaseError) {
          this.logger.error(err.parent.stack as any, errLogMsg)
        } else {
          this.logger.error(err.stack, errLogMsg)
        }

        err.name = errOrigName
        err.message = errOrigMessage

        res.trace = trace
        throw err
      }),
      map((data) => ({
        requestId: logObject.requestId,
        success: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        data,
        error: null,
      })),
    )
  }
}
