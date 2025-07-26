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
import { Rating } from './rating.model'
import { CoreStore } from '@/core/store/models/core-store.model'

export class RatingOptionVoteAggregated extends Model<
  InferAttributes<RatingOptionVoteAggregated>,
  InferCreationAttributes<RatingOptionVoteAggregated>
> {
  declare primaryId: CreationOptional<number>
  declare ratingId: number
  declare entityPkValue: number
  declare voteCount: number
  declare voteValueSum: number
  declare percent: number
  declare percentApproved: number
  declare storeId: number

  declare Rating: NonAttribute<Rating>
  declare getRating: BelongsToGetAssociationMixin<Rating>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  static associations: {
    Rating: Association<RatingOptionVoteAggregated, Rating>
    CoreStore: Association<RatingOptionVoteAggregated, CoreStore>
  }

  static initialize(sequelize: Sequelize) {
    RatingOptionVoteAggregated.init(
      {
        primaryId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        ratingId: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        entityPkValue: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        voteCount: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        voteValueSum: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        percent: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        percentApproved: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        storeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.RATING_OPTION_VOTE_AGGREGATED,
        tableName: MAGENTO_TABLE_NAME.RATING_OPTION_VOTE_AGGREGATED,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    RatingOptionVoteAggregated.belongsTo(Rating, { foreignKey: 'ratingId' })
    RatingOptionVoteAggregated.belongsTo(CoreStore, { foreignKey: 'storeId' })
  }
}
