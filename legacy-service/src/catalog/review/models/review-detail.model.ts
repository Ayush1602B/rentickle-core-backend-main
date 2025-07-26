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
import { Review } from './review.model'
import { CoreStore } from '@/core/store/models/core-store.model'

export class ReviewDetail extends Model<
  InferAttributes<ReviewDetail>,
  InferCreationAttributes<ReviewDetail>
> {
  declare detailId: CreationOptional<number>
  declare reviewId: number
  declare storeId: number | null
  declare title: string
  declare detail: string
  declare nickname: string
  declare customerId: number | null

  declare Review: NonAttribute<Review>
  declare getReview: BelongsToGetAssociationMixin<Review>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  static associations: { Review: Association<Review, ReviewDetail> }

  static initialize(sequelize: Sequelize) {
    ReviewDetail.init(
      {
        detailId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        reviewId: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        storeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        detail: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        nickname: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        customerId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.REVIEW_DETAIL,
        tableName: MAGENTO_TABLE_NAME.REVIEW_DETAIL,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    ReviewDetail.belongsTo(Review, { foreignKey: 'reviewId' })
  }
}
