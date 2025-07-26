import { IsInt } from 'class-validator'

export class StoreGetByIdParamsDTO {
  @IsInt()
  storeId: number
}
