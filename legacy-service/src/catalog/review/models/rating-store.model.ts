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

export class RatingStore extends Model<
  InferAttributes<RatingStore>,
  InferCreationAttributes<RatingStore>
> {
  declare ratingId: number
  declare storeId: number

  declare Rating: NonAttribute<Rating>
  declare getRating: BelongsToGetAssociationMixin<Rating>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  static associations: {
    RatingStore: Association<Rating, RatingStore>
    CoreStore: Association<RatingStore, CoreStore>
  }

  static initialize(sequelize: Sequelize) {
    RatingStore.init(
      {
        ratingId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
        },
        storeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.RATING_STORE,
        tableName: MAGENTO_TABLE_NAME.RATING_STORE,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    RatingStore.belongsTo(Rating, { foreignKey: 'ratingId' })
    RatingStore.belongsTo(CoreStore, { foreignKey: 'storeId' })
  }
}
