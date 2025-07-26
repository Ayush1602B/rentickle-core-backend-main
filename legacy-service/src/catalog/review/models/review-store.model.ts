import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { Review } from './review.model'
import { CoreStore } from '@/core/store/models/core-store.model'

export class ReviewStore extends Model<
  InferAttributes<ReviewStore>,
  InferCreationAttributes<ReviewStore>
> {
  declare reviewId: number
  declare storeId: number

  declare Review: NonAttribute<Review>
  declare getReview: HasManyGetAssociationsMixin<Review>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  static associations: {
    Review: Association<Review, ReviewStore>
    CoreStore: Association<CoreStore, ReviewStore>
  }

  static initialize(sequelize: Sequelize) {
    ReviewStore.init(
      {
        reviewId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        storeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.REVIEW_STORE,
        tableName: MAGENTO_TABLE_NAME.REVIEW_STORE,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    ReviewStore.hasMany(Review, { foreignKey: 'reviewId' })
    ReviewStore.belongsTo(CoreStore, { foreignKey: 'storeId' })
  }
}
