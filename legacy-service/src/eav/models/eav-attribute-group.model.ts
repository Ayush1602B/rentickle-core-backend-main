import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  NonAttribute,
  BelongsToGetAssociationMixin,
  Association,
  HasManyGetAssociationsMixin,
} from 'sequelize'
import { EavAttributeSet } from './eav-attribute-set.model'
import { EavEntityAttribute } from './eav-entity-attribute.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'

export class EavAttributeGroup extends Model {
  declare attributeGroupId: CreationOptional<number>
  declare attributeSetId: number
  declare attributeGroupName: string | null
  declare sortOrder: number
  declare defaultId: number

  declare EavAttributeSet: NonAttribute<EavAttributeSet>
  declare getEavAttributeSet: BelongsToGetAssociationMixin<EavAttributeSet>

  declare EavEntityAttributes: NonAttribute<EavEntityAttribute[]>
  declare getEavEntityAttributes: HasManyGetAssociationsMixin<EavEntityAttribute>

  static associations: {
    EavAttributeSet: Association<EavAttributeSet, EavAttributeGroup>
  }

  static initialize(sequelize: Sequelize) {
    EavAttributeGroup.init(
      {
        attributeGroupId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'Attribute Group Id',
        },
        attributeSetId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: 'Attribute Set Id',
        },
        attributeGroupName: {
          type: DataTypes.STRING,
          allowNull: true,
          comment: 'Attribute Group Name',
        },
        sortOrder: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
          comment: 'Sort Order',
        },
        defaultId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
          comment: 'Default Id',
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_GROUP,
        tableName: MAGENTO_TABLE_NAME.EAV_ATTRIBUTE_GROUP,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    EavAttributeGroup.belongsTo(EavAttributeSet, {
      foreignKey: 'attributeSetId',
    })

    EavAttributeGroup.hasMany(EavEntityAttribute, {
      foreignKey: 'attributeGroupId',
    })
  }
}
