import { Injectable, NestMiddleware } from '@nestjs/common'
import { BaseRequest, BaseResponse } from '@shared/api/api.types'
import { TraceService } from '@shared/trace/trace.service'
import { NextFunction } from 'express'
import {
  MANDATORY_TRACE_HEADERS,
  OPTIONAL_TRACE_HEADERS,
  REQUEST_CONTEXT,
  REQUEST_PLATFORM,
  TraceState,
} from './trace.types'

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  constructor(private readonly traceService: TraceService) {}

  private getRequestId = (req: BaseRequest) => {
    return req.headers[MANDATORY_TRACE_HEADERS.REQUEST_ID] as string
  }

  private getFkRequestId = (req: BaseRequest) => {
    return req.headers[OPTIONAL_TRACE_HEADERS.FK_REQUEST_ID] as string
  }

  private getContext = (req: BaseRequest) => {
    return req.headers[MANDATORY_TRACE_HEADERS.CONTEXT] as REQUEST_CONTEXT
  }

  private getDeviceId = (req: BaseRequest) => {
    return req.headers[OPTIONAL_TRACE_HEADERS.DEVICE_ID] as string
  }

  private getOrigIp = (req: BaseRequest) => {
    return req.headers[OPTIONAL_TRACE_HEADERS.ORIGINAL_IP] as string
  }

  private getOrigTimestamp = (req: BaseRequest) => {
    return req.headers[OPTIONAL_TRACE_HEADERS.ORIG_TIMESTAMP]
  }

  private getPlatform = (req: BaseRequest) => {
    return req.headers[OPTIONAL_TRACE_HEADERS.PLATFORM] as REQUEST_PLATFORM
  }

  private geTraceStateFromHeaders = (req: BaseRequest) =>
    ({
      requestId: this.getRequestId(req) || '-',
      fkRequestId: this.getFkRequestId(req),
      originalIp: this.getOrigIp(req),
      platform: this.getPlatform(req),
      originalTimestamp: this.getOrigTimestamp(req),
      device: this.getDeviceId(req),
      context: this.getContext(req) || '-',
    }) as TraceState

  use(req: BaseRequest, res: BaseResponse, next: NextFunction) {
    console.log('TracingMiddleware')
    const serverTimestamp = Date.now()

    const traceState = { ...this.geTraceStateFromHeaders(req), serverTimestamp }
    this.traceService.setTrace(traceState)

    res.trace = traceState
    next()
  }
}
