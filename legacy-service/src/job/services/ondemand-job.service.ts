import { Injectable } from '@nestjs/common'

@Injectable()
export class OndemandJobService {
  constructor() {}

  // @Cron('0 5 21 3 *', {
  //   name: 'backfill-category-cron',
  // })
  // async backfillCategoryCron() {
  //   await this.backfillCategoryCronInstance.run()
  // }
}
