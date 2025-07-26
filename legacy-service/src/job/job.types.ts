import { BaseDto } from '@/shared/api/api.types'

export interface BaseCron {
  run: (dto?: BaseDto) => Promise<void>
}
