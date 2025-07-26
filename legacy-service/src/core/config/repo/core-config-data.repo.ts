import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { CoreConfigData } from '../models/core-config-data.model'

@Injectable()
export class CoreConfigDataRepo extends BaseSequelizeRepo<CoreConfigData> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CORE_CONFIG_DATA)
    private readonly coreConfigDataModel: typeof CoreConfigData,
  ) {
    super(sequelize, coreConfigDataModel)
  }

  async findValueByPath(path: string): Promise<string | null> {
    const config = await this.coreConfigDataModel.findOne({
      where: { path },
    })

    return config ? config.value : null
  }
}
