import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyGetAssociationsMixin,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { EavAttributeOptionValue } from './eav-attribute-option-value.model'
import { EavAttribute } from './eav-attribute.model'

export class EavAttributeOption extends Model {
  declare optionId: CreationOptional<number>
  declare attributeId: ForeignKey<number>
  declare sortOrder: number

  declare EavAttribute: NonAttribute<EavAttribute>
  declare getEavAttribute: BelongsToGetAssociationMixin<EavAttribute>

  declare EavAttributeOptionValues: NonAttribute<EavAttributeOptionValue[]>
  declare getEavAttributeOptionValues: HasManyGetAssociationsMixin<EavAttributeOptionValue>

  static associations: {
    EavAttribute: Association<EavAttribute, EavAttributeOption>
    EavAttributeOptionValues: Association<
      EavAttributeOptionValue,
      EavAttributeOption
    >
  }

  static initialize(sequelize: Sequelize) {
    EavAttributeOption.init(
      {
        optionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'Option Id',
        },
        attributeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: 'Attribute Id',
        },
        sortOrder: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: 'Sort Order',
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_OPTION,
        tableName: MAGENTO_TABLE_NAME.EAV_ATTRIBUTE_OPTION,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    EavAttributeOption.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })

    EavAttributeOption.hasMany(EavAttributeOptionValue, {
      foreignKey: 'optionId',
    })
  }
}
