import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { Review } from './review.model'

export class ReviewStatus extends Model<
  InferAttributes<ReviewStatus>,
  InferCreationAttributes<ReviewStatus>
> {
  declare statusId: CreationOptional<number>
  declare statusCode: string

  declare Review: NonAttribute<Review>
  declare getReview: HasManyGetAssociationsMixin<Review>

  static associations: { Review: Association<Review, ReviewStatus> }

  static initialize(sequelize: Sequelize) {
    ReviewStatus.init(
      {
        statusId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        statusCode: {
          type: DataTypes.STRING(32),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.REVIEW_STATUS,
        tableName: MAGENTO_TABLE_NAME.REVIEW_STATUS,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    ReviewStatus.hasMany(Review, { foreignKey: 'statusId' })
  }
}
