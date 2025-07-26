import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { DirectoryRegionCity } from '../models/directory-region-city.model'

@Injectable()
export class DirectoryRegionCityRepo extends BaseSequelizeRepo<DirectoryRegionCity> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.DIRECTORY_REGION_CITY)
    private directoryRegionCityModel: typeof DirectoryRegionCity,
  ) {
    super(sequelize, directoryRegionCityModel)
  }
}
