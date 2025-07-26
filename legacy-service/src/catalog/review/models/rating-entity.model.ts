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
import { Rating } from './rating.model'

export class RatingEntity extends Model<
  InferAttributes<RatingEntity>,
  InferCreationAttributes<RatingEntity>
> {
  declare entityId: CreationOptional<number>
  declare entityCode: string

  declare Rating: NonAttribute<Rating>
  declare getRatingEntity: HasManyGetAssociationsMixin<Rating>

  static associations: { Rating: Association<Rating, RatingEntity> }

  static initialize(sequelize: Sequelize) {
    RatingEntity.init(
      {
        entityId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        entityCode: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.RATING_ENTITY,
        tableName: MAGENTO_TABLE_NAME.RATING_ENTITY,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    RatingEntity.hasMany(Rating, { foreignKey: 'entityId' })
  }
}
