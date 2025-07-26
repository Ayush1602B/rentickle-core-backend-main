import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { EavAttributeGroup } from './eav-attribute-group.model'
import { EavAttributeSet } from './eav-attribute-set.model'
import { EavAttribute } from './eav-attribute.model'
import { EavEntityType } from './eav-entity-type.model'

export type EavEntityAttributeAttributes = InferAttributes<EavEntityAttribute>
export type EavEntityAttributeCreationAttributes =
  InferCreationAttributes<EavEntityAttribute>
export class EavEntityAttribute extends Model<
  EavEntityAttributeAttributes,
  EavEntityAttributeCreationAttributes
> {
  declare entityAttributeId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeSetId: number
  declare attributeGroupId: number
  declare attributeId: number
  declare sortOrder: number

  declare EavAttribute: NonAttribute<EavAttribute>
  declare getEavAttribute: BelongsToGetAssociationMixin<EavAttribute>

  static initialize(sequelize: Sequelize) {
    EavEntityAttribute.init(
      {
        entityAttributeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'Entity Attribute Id',
        },
        entityTypeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: 'Entity Type Id',
        },
        attributeSetId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: 'Attribute Set Id',
        },
        attributeGroupId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: 'Attribute Group Id',
        },
        attributeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: 'Attribute Id',
        },
        sortOrder: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
          comment: 'Sort Order',
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.EAV_ENTITY_ATTRIBUTE,
        tableName: MAGENTO_TABLE_NAME.EAV_ENTITY_ATTRIBUTE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    EavEntityAttribute.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })

    EavEntityAttribute.belongsTo(EavAttributeGroup, {
      foreignKey: 'attributeGroupId',
    })

    EavEntityAttribute.belongsTo(EavAttributeSet, {
      foreignKey: 'attributeSetId',
    })

    EavEntityAttribute.belongsTo(EavEntityType, {
      foreignKey: 'entityTypeId',
    })
  }
}
