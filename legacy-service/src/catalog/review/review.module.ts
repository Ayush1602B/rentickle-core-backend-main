import { Module } from '@nestjs/common'

import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { RatingRepo, ReviewRepo } from './repos'
import { ReviewService } from './review.service'
@Module({
  imports: [],
  controllers: [],
  providers: [
    ReviewService,
    ReviewRepo,
    RatingRepo,
    provideMagentoModel(MAGENTO_MODEL_NAME.RATING_ENTITY),
    provideMagentoModel(MAGENTO_MODEL_NAME.RATING_OPTION_VOTE_AGGREGATED),
    provideMagentoModel(MAGENTO_MODEL_NAME.RATING_OPTION_VOTE),
    provideMagentoModel(MAGENTO_MODEL_NAME.RATING_OPTION),
    provideMagentoModel(MAGENTO_MODEL_NAME.RATING_STORE),
    provideMagentoModel(MAGENTO_MODEL_NAME.RATING_TITLE),
    provideMagentoModel(MAGENTO_MODEL_NAME.RATING),
    provideMagentoModel(MAGENTO_MODEL_NAME.REVIEW_DETAIL),
    provideMagentoModel(MAGENTO_MODEL_NAME.REVIEW_ENTITY),
    provideMagentoModel(MAGENTO_MODEL_NAME.REVIEW_ENTITY_SUMMARY),
    provideMagentoModel(MAGENTO_MODEL_NAME.REVIEW_STATUS),
    provideMagentoModel(MAGENTO_MODEL_NAME.REVIEW_STORE),
    provideMagentoModel(MAGENTO_MODEL_NAME.REVIEW),
  ],
  exports: [ReviewService, RatingRepo, ReviewRepo],
})
export class ReviewModule {}
