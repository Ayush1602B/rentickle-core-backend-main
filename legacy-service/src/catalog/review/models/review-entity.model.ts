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

export class ReviewEntity extends Model<
  InferAttributes<ReviewEntity>,
  InferCreationAttributes<ReviewEntity>
> {
  declare entityId: CreationOptional<number>
  declare entityCode: string

  declare Review: NonAttribute<Review>
  declare getReview: HasManyGetAssociationsMixin<Review>

  static associations: { Review: Association<Review, ReviewEntity> }

  static initialize(sequelize: Sequelize) {
    ReviewEntity.init(
      {
        entityId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        entityCode: {
          type: DataTypes.STRING(32),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.REVIEW_ENTITY,
        tableName: MAGENTO_TABLE_NAME.REVIEW_ENTITY,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    ReviewEntity.hasMany(Review, { foreignKey: 'entityId' })
  }
}
