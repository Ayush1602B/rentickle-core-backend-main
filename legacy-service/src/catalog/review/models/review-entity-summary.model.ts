import { CoreStore } from '@/core/store/models/core-store.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
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

export class ReviewEntitySummary extends Model<
  InferAttributes<ReviewEntitySummary>,
  InferCreationAttributes<ReviewEntitySummary>
> {
  declare primaryId: CreationOptional<number>
  declare entityPkValue: number
  declare entityType: number
  declare reviewsCount: number
  declare ratingSummary: number
  declare storeId: number

  declare Review: NonAttribute<Review>
  declare getReview: HasManyGetAssociationsMixin<Review>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  static associations: {
    Review: Association<ReviewEntitySummary, Review>
    CoreStore: Association<ReviewEntitySummary, CoreStore>
  }

  static initialize(sequelize: Sequelize) {
    ReviewEntitySummary.init(
      {
        primaryId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        entityPkValue: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        entityType: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
        },
        reviewsCount: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        ratingSummary: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0.0,
        },
        storeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.REVIEW_ENTITY_SUMMARY,
        tableName: MAGENTO_TABLE_NAME.REVIEW_ENTITY_SUMMARY,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    ReviewEntitySummary.hasMany(Review, { foreignKey: 'entityId' })
    ReviewEntitySummary.belongsTo(CoreStore, { foreignKey: 'storeId' })
  }
}
