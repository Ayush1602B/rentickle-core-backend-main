import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { Rating, RatingOption, RatingTitle } from '../models'
import { RATING_ENTITY_ID } from '../review.types'

@Injectable()
export class RatingRepo extends BaseSequelizeRepo<Rating> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.RATING)
    private ratingModel: typeof Rating,
  ) {
    super(sequelize, ratingModel)
  }

  findProductRatingOptions() {
    return this.ratingModel.findAll({
      where: {
        entityId: RATING_ENTITY_ID.PRODUCT,
      },
      order: [['position', 'ASC']],
      include: [
        {
          model: RatingOption,
          separate: true,
          order: [['position', 'ASC']],
        },
        {
          model: RatingTitle,
        },
      ],
    })
  }
}
