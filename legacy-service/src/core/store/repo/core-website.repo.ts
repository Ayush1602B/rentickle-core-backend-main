import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Sequelize } from 'sequelize'
import { Inject, Injectable } from '@nestjs/common'
import { CoreWebsite } from '../models/core-website.model'

@Injectable()
export class CoreWebsiteRepo extends BaseSequelizeRepo<CoreWebsite> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CORE_WEBSITE)
    private coreWebsiteModel: typeof CoreWebsite,
  ) {
    super(sequelize, coreWebsiteModel)
  }
}
