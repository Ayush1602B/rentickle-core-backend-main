import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { BannerEntity } from '../models/banner-entity.model'

@Injectable()
export class BannerEntityRepo extends BaseSequelizeRepo<BannerEntity> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.BANNER_ENTITY)
    private readonly bannerEntityModel: typeof BannerEntity,
  ) {
    super(sequelize, bannerEntityModel)
  }
}
