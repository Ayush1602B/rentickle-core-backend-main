import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'
import { CORE_CONFIG_SCOPE } from '../core-config.types'

export type CoreConfigDataAttributes = InferAttributes<CoreConfigData>
export type CoreConfigDataCreationAttributes =
  InferCreationAttributes<CoreConfigData>

export class CoreConfigData extends Model<
  CoreConfigDataAttributes,
  CoreConfigDataCreationAttributes
> {
  declare configId: CreationOptional<number>
  declare scope: CORE_CONFIG_SCOPE
  declare scopeId: number
  declare path: string
  declare value: string | null

  // Initialize the model
  static initialize(sequelize: Sequelize) {
    CoreConfigData.init(
      {
        configId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        scope: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        scopeId: {
          type: DataTypes.SMALLINT,
          defaultValue: 0,
          allowNull: false,
        },
        path: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        value: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CORE_CONFIG_DATA,
        tableName: MAGENTO_TABLE_NAME.CORE_CONFIG_DATA,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {}
}
