import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import {
  Rating,
  RatingOptionVote,
  Review,
  ReviewDetail,
  ReviewStore,
} from '../models'
import { REVIEW_ENTITY_ID, REVIEW_STATUS_ID } from '../review.types'

@Injectable()
export class ReviewRepo extends BaseSequelizeRepo<Review> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.REVIEW)
    private reviewModel: typeof Review,
  ) {
    super(sequelize, reviewModel)
  }

  findReviewsForProductInStore(productId: number, storeId: number) {
    return this.reviewModel.findAll({
      where: {
        entityPkValue: productId,
        entityId: REVIEW_ENTITY_ID.PRODUCT,
        statusId: REVIEW_STATUS_ID.APPROVED,
      },
      include: [
        {
          model: ReviewDetail,
        },
        {
          model: ReviewStore,
          where: {
            storeId: storeId,
          },
        },
        {
          model: RatingOptionVote,
          include: [
            {
              model: Rating,
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    })
  }
}
