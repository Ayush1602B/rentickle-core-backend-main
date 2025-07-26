import { Injectable, Scope, Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { AppSession } from './session.types'

@Injectable({ scope: Scope.REQUEST })
export class SessionService {
  constructor(@Inject(REQUEST) private readonly req: Request) {}

  get<T = any>(key: keyof AppSession): T {
    return (this.req.session as AppSession)[key] as T
  }

  set<K extends keyof AppSession>(key: K, value: AppSession[K]): void {
    ;(this.req.session as AppSession)[key] = value
  }

  delete(key: keyof AppSession): void {
    delete (this.req.session as AppSession)[key]
  }

  getAll(): AppSession {
    return this.req.session as AppSession
  }

  clear(): void {
    Object.keys(this.req.session as AppSession).forEach(
      (key: keyof AppSession) => {
        delete (this.req.session as AppSession)[key]
      },
    )
  }
}
