import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { DirectoryCountryRegion } from '../models/directory-country-region.model'

@Injectable()
export class DirectoryCountryRegionRepo extends BaseSequelizeRepo<DirectoryCountryRegion> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.DIRECTORY_COUNTRY_REGION)
    private directoryCountryRegionModel: typeof DirectoryCountryRegion,
  ) {
    super(sequelize, directoryCountryRegionModel)
  }
}
