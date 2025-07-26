import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { Rating } from './rating.model'
import { CoreStore } from '@/core/store/models/core-store.model'

export class RatingTitle extends Model<
  InferAttributes<RatingTitle>,
  InferCreationAttributes<RatingTitle>
> {
  declare ratingId: number
  declare storeId: number
  declare value: string

  declare Rating: NonAttribute<Rating>
  declare getRating: BelongsToGetAssociationMixin<Rating>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  static associations: {
    Rating: Association<RatingTitle, Rating>
    CoreStore: Association<RatingTitle, CoreStore>
  }

  static initialize(sequelize: Sequelize) {
    RatingTitle.init(
      {
        ratingId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
        },
        storeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
        },
        value: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.RATING_TITLE,
        tableName: MAGENTO_TABLE_NAME.RATING_TITLE,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    RatingTitle.belongsTo(Rating, { foreignKey: 'ratingId' })
    RatingTitle.belongsTo(CoreStore, { foreignKey: 'storeId' })
  }
}
