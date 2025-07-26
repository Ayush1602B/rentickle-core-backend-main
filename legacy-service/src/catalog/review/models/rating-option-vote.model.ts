import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { RatingOption } from './rating-option.model'
import { Review } from './review.model'
import { Rating } from './rating.model'

export class RatingOptionVote extends Model<
  InferAttributes<RatingOptionVote>,
  InferCreationAttributes<RatingOptionVote>
> {
  declare voteId: CreationOptional<number>
  declare optionId: number
  declare remoteIp: CreationOptional<string | null>
  declare remoteIpLong: CreationOptional<string | null>
  declare customerId: number
  declare entityPkValue: number
  declare ratingId: number
  declare reviewId: CreationOptional<number | null>
  declare percent: number
  declare value: number

  declare Review: NonAttribute<Review>
  declare getReview: BelongsToGetAssociationMixin<Review>

  declare RatingOption: NonAttribute<RatingOption>
  declare getRatingOption: BelongsToGetAssociationMixin<RatingOption>

  declare Rating: NonAttribute<Rating>
  declare getRating: BelongsToGetAssociationMixin<Rating>

  static associations: {
    RatingOption: Association<RatingOptionVote, RatingOption>
    Review: Association<RatingOptionVote, Review>
    Rating: Association<RatingOptionVote, Rating>
  }

  static initialize(sequelize: Sequelize) {
    RatingOptionVote.init(
      {
        voteId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        optionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        remoteIp: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        remoteIpLong: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        customerId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        entityPkValue: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        ratingId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        reviewId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        percent: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        value: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.RATING_OPTION_VOTE,
        tableName: MAGENTO_TABLE_NAME.RATING_OPTION_VOTE,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    RatingOptionVote.belongsTo(RatingOption, { foreignKey: 'optionId' })
    RatingOptionVote.belongsTo(Review, { foreignKey: 'reviewId' })
    RatingOptionVote.belongsTo(Rating, { foreignKey: 'ratingId' })
  }
}
