import { BaseDto } from '@/shared/api/api.types'
import { CategoryDto } from './category-common.dto'

export class GetCategoryByIdentifierInputDto extends BaseDto<GetCategoryByIdentifierInputDto> {}

export class GetCategoryByIdentifierOutputDto extends CategoryDto {}
