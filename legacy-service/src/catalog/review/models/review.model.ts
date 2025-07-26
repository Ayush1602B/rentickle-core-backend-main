import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { RatingOptionVote } from './rating-option-vote.model'
import { ReviewDetail } from './review-detail.model'
import { ReviewEntity } from './review-entity.model'
import { ReviewStatus } from './review-status.model'
import { ReviewStore } from './review-store.model'

export class Review extends Model<
  InferAttributes<Review>,
  InferCreationAttributes<Review>
> {
  declare reviewId: CreationOptional<number>
  declare entityId: number
  declare entityPkValue: number
  declare statusId: number
  declare createdAt: string

  declare ReviewDetail: NonAttribute<ReviewDetail>
  declare getReviewDetail: HasOneGetAssociationMixin<ReviewDetail>

  // declare ReviewStore: NonAttribute<ReviewStore>
  // declare getReviewStore: BelongsToGetAssociationMixin<ReviewStore>

  declare ReviewEntity: NonAttribute<ReviewEntity>
  declare getReviewEntity: BelongsToGetAssociationMixin<ReviewEntity>

  declare ReviewStatus: NonAttribute<ReviewStatus>
  declare getReviewStatus: BelongsToGetAssociationMixin<ReviewStatus>

  declare RatingOptionVotes: NonAttribute<RatingOptionVote[]>
  declare getRatingOptionVotes: HasManyGetAssociationsMixin<RatingOptionVote>

  static associations: {
    ReviewEntity: Association<Review, ReviewEntity>
    ReviewStatus: Association<Review, ReviewStatus>
    RatingOptionVotes: Association<Review, RatingOptionVote>
    ReviewDetail: Association<Review, ReviewDetail>
  }

  static initialize(sequelize: Sequelize) {
    Review.init(
      {
        reviewId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        createdAt: {
          type: DataTypes.STRING,
          defaultValue: '0000-00-00 00:00:00',
          allowNull: false,
        },
        entityId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        entityPkValue: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        statusId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.REVIEW,
        tableName: MAGENTO_TABLE_NAME.REVIEW,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    Review.hasMany(RatingOptionVote, { foreignKey: 'reviewId' })
    Review.hasOne(ReviewDetail, { foreignKey: 'reviewId' })
    Review.belongsTo(ReviewStore, { foreignKey: 'reviewId' })
    Review.belongsTo(ReviewEntity, { foreignKey: 'entityId' })
    Review.belongsTo(ReviewStatus, { foreignKey: 'statusId' })
  }
}
