import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'
import { EavAttributeOption } from './eav-attribute-option.model'

export type EavAttributeOptionValueAttributes =
  InferAttributes<EavAttributeOptionValue>
export type EavAttributeOptionValueCreationAttributes =
  InferCreationAttributes<EavAttributeOptionValue>
export class EavAttributeOptionValue extends Model<
  EavAttributeOptionValueAttributes,
  EavAttributeOptionValueCreationAttributes
> {
  declare valueId: CreationOptional<number>
  declare optionId: number
  declare storeId: number
  declare value: string | null

  static initialize(sequelize: Sequelize) {
    EavAttributeOptionValue.init(
      {
        valueId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'Value Id',
        },
        optionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: 'Option Id',
        },
        storeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: 'Store Id',
        },
        value: {
          type: DataTypes.STRING,
          allowNull: true,
          comment: 'Value',
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_OPTION_VALUE,
        tableName: MAGENTO_TABLE_NAME.EAV_ATTRIBUTE_OPTION_VALUE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    EavAttributeOptionValue.belongsTo(EavAttributeOption, {
      foreignKey: 'optionId',
    })
  }
}
