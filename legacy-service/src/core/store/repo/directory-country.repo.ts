import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { DirectoryCountry } from '../models/directory-country.model'

@Injectable()
export class DirectoryCountryRepo extends BaseSequelizeRepo<DirectoryCountry> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.DIRECTORY_COUNTRY)
    private directoryCountryModel: typeof DirectoryCountry,
  ) {
    super(sequelize, directoryCountryModel)
  }
}
