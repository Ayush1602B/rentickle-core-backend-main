import { Injectable } from '@nestjs/common'
import { Rating, Review } from './models'
import { RatingRepo, ReviewRepo } from './repos'

interface IReviewService {
  getProductReviews(product: number, storeId: number): Promise<Review[]>
  getAvailableProductRatings(): Promise<Rating[]>
}

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    private readonly ratingRepo: RatingRepo,
    private readonly reviewRepo: ReviewRepo,
  ) {}

  async getProductReviews(
    productId: number,
    storeId: number,
  ): Promise<Review[]> {
    const productReviews = await this.reviewRepo.findReviewsForProductInStore(
      productId,
      storeId,
    )

    return productReviews
  }

  async getAvailableProductRatings(): Promise<Rating[]> {
    const ratingOptions = await this.ratingRepo.findProductRatingOptions()
    return ratingOptions
  }
}
