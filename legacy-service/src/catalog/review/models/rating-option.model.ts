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
import { RatingOptionVote } from './rating-option-vote.model'
import { Rating } from './rating.model'

export class RatingOption extends Model<
  InferAttributes<RatingOption>,
  InferCreationAttributes<RatingOption>
> {
  declare optionId: CreationOptional<number>
  declare ratingId: number
  declare code: string
  declare value: number
  declare position: number

  declare Rating: NonAttribute<Rating>
  declare getRating: BelongsToGetAssociationMixin<Rating>

  declare RatingOptionVotes: NonAttribute<RatingOptionVote[]>
  declare getRatingOptionVotes: HasManyGetAssociationsMixin<RatingOptionVote>

  static associations: {
    Rating: Association<RatingOption, Rating>
    RatingOptionVote: Association<RatingOption, RatingOptionVote>
  }

  static initialize(sequelize: Sequelize) {
    RatingOption.init(
      {
        optionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        ratingId: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING(32),
          allowNull: false,
        },
        value: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        position: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.RATING_OPTION,
        tableName: MAGENTO_TABLE_NAME.RATING_OPTION,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    RatingOption.belongsTo(Rating, { foreignKey: 'ratingId' })
    RatingOption.hasMany(RatingOptionVote, { foreignKey: 'optionId' })
  }
}
