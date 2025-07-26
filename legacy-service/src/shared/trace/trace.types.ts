// ********** SECTION 2: REQUEST CONSTANTS **********
export enum REQUEST_PLATFORM {
  ios = 'ios',
  android = 'android',
  web = 'web',
  other = 'other',
}

export enum REQUEST_CONTEXT {
  dashboard = 'dashboard',
  web = 'web',
  app = 'app',
  external = 'external',
  programmatic = 'programmatic',
  other = 'other',
}

export enum REQUEST_TYPE {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

// ********** SECTION 4: TRACE HEADERS DEFINITION **********
export enum MANDATORY_TRACE_HEADERS {
  REQUEST_ID = 'x-request-id',
  CONTEXT = 'x-context',
}

export enum OPTIONAL_TRACE_HEADERS {
  FK_REQUEST_ID = 'fk-request-id',
  ORIGINAL_IP = 'x-orig-ip',
  PLATFORM = 'x-platform',
  ORIG_TIMESTAMP = 'x-orig-timestamp',
  DEVICE_ID = 'x-device-id',
}

type MandatoryTraceHeaders = {
  [header in MANDATORY_TRACE_HEADERS]: string
}

type OptionalTraceHeaders = {
  [header in OPTIONAL_TRACE_HEADERS]: string
}

export type DefaultTraceHeaders = MandatoryTraceHeaders &
  Partial<OptionalTraceHeaders>

export type DefaultTraceState = {
  requestId: string
  context: REQUEST_CONTEXT
  serverTimestamp: number
  platform?: REQUEST_PLATFORM
  originalTimestamp?: number
  originalIp?: string
  fkRequestId?: string
  device?: string
}

export type TraceState<T = DefaultTraceState> = DefaultTraceState & T
