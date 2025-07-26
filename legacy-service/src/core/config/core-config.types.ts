import { BaseDto } from '@/shared/api/api.types'
import { CoreConfigData } from './models/core-config-data.model'

export enum CORE_CONFIG_SCOPE {
  DEFAULT = 'default',
  WEBSITE = 'websites',
  STORE = 'stores',
}

export class CoreConfigDataDto<T = any> extends BaseDto<CoreConfigDataDto<T>> {
  configId: number
  scope: CORE_CONFIG_SCOPE
  scopeId: number
  path: string
  value: T | null

  static fromEntity<T = any>(entity: CoreConfigData): CoreConfigDataDto<T> {
    return new CoreConfigDataDto<T>({
      configId: entity.configId,
      scope: entity.scope,
      scopeId: entity.scopeId,
      path: entity.path,
      value: entity.value as T,
    })
  }
}
