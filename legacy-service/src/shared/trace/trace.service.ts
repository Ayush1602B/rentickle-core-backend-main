import { Injectable, Scope } from '@nestjs/common'

@Injectable({ scope: Scope.REQUEST })
export class TraceService {
  private trace: any

  setTrace(trace: any) {
    this.trace = trace
  }

  getTrace(): any {
    return this.trace
  }
}
