import { Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENVIRONMENT, IEnvironmentKey } from './config.types'

@Injectable({ scope: Scope.DEFAULT })
export class AppConfigService extends ConfigService<IEnvironmentKey> {
  constructor(config: Partial<IEnvironmentKey> = {}) {
    super()

    Object.keys(config).forEach((key: keyof IEnvironmentKey) => {
      this.set(key, config[key])
    })
  }

  isProd() {
    return this.get('NODE_ENV') === ENVIRONMENT.prod
  }

  getAppRoot(): string {
    return this.getOrThrow('APP_ROOT')
  }

  setAppRoot(appRoot: string): void {
    this.set('APP_ROOT', appRoot)
  }
}
