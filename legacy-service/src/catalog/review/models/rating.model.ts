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
import { RatingTitle } from './rating-title.model'
import { RatingStore } from './rating-store.model'
import { RatingEntity } from './rating-entity.model'
import { RatingOptionVoteAggregated } from './rating-option-vote-aggregated.model'
import { RatingOption } from './rating-option.model'
import { RatingOptionVote } from './rating-option-vote.model'

export class Rating extends Model<
  InferAttributes<Rating>,
  InferCreationAttributes<Rating>
> {
  declare ratingId: CreationOptional<number>
  declare entityId: number
  declare ratingCode: string
  declare position: number

  declare RatingEntity: NonAttribute<RatingEntity>
  declare getRatingEntity: BelongsToGetAssociationMixin<RatingEntity>

  declare RatingTitle: NonAttribute<RatingTitle[]>
  declare getRatingTitle: HasManyGetAssociationsMixin<RatingTitle>

  declare RatingStore: NonAttribute<RatingStore>
  declare getRatingStore: HasManyGetAssociationsMixin<RatingStore>

  declare RatingOptionVoteAggregated: NonAttribute<RatingOptionVoteAggregated>
  declare getRatingOptionVoteAggregated: HasManyGetAssociationsMixin<RatingOptionVoteAggregated>

  declare RatingOptions: NonAttribute<RatingOption[]>
  declare getRatingOptions: HasManyGetAssociationsMixin<RatingOption>

  static associations: {
    RatingEntity: Association<Rating, RatingEntity>
    RatingTitle: Association<Rating, RatingTitle>
    RatingStore: Association<Rating, RatingStore>
    RatingOptionVoteAggregated: Association<Rating, RatingOptionVoteAggregated>
    RatingOption: Association<Rating, RatingOption>
  }

  static initialize(sequelize: Sequelize) {
    Rating.init(
      {
        ratingId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        entityId: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        ratingCode: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
        position: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.RATING,
        tableName: MAGENTO_TABLE_NAME.RATING,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    Rating.hasMany(RatingTitle, { foreignKey: 'ratingId' })
    Rating.hasMany(RatingStore, { foreignKey: 'ratingId' })
    Rating.belongsTo(RatingEntity, { foreignKey: 'entityId' })
    Rating.hasMany(RatingOptionVoteAggregated, { foreignKey: 'ratingId' })
    Rating.hasMany(RatingOption, { foreignKey: 'ratingId' })
    Rating.hasMany(RatingOptionVote, { foreignKey: 'ratingId' })
  }
}
