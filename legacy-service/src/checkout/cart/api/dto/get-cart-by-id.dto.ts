import { BaseDto } from '@/shared/api/api.types'
import { CartDto } from './common.dto'

export class GetCartByIdInputDto extends BaseDto<GetCartByIdInputDto> {}

export class GetCartByIdOutputDto extends CartDto {}
