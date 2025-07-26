import { DEFAULT_STORE_VIEW_ID } from '@/database/db.types'
import { Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseStoreIdPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    let storeId = parseInt(value, 10)

    if (isNaN(storeId)) {
      storeId = DEFAULT_STORE_VIEW_ID
    }

    return storeId
  }
}
