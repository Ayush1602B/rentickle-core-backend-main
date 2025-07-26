import { CatalogProductEntity } from '@/catalog/product/models/catalog-product-entity.model'
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
import { EavAttributeGroup } from './eav-attribute-group.model'
import { EavEntityAttribute } from './eav-entity-attribute.model'
import { EavEntityType } from './eav-entity-type.model'
import { CatalogCategoryEntity } from '@/catalog/category/models/catalog-category-entity.model'

export type EavAttributeSetAttributes = InferAttributes<EavAttributeSet>
export type EavAttributeSetCreationAttributes =
  InferCreationAttributes<EavAttributeSet>
export class EavAttributeSet extends Model<
  EavAttributeSetAttributes,
  EavAttributeSetCreationAttributes
> {
  declare attributeSetId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeSetName: string | null
  declare sortOrder: number

  declare CatalogProductEntities: NonAttribute<CatalogProductEntity>
  declare getCatalogProductEntities: HasManyGetAssociationsMixin<CatalogProductEntity>

  declare EavAttributeGroups: NonAttribute<EavAttributeGroup[]>
  declare getEavAttributeGroups: HasManyGetAssociationsMixin<EavAttributeGroup>

  declare EavEntityType: NonAttribute<EavEntityType>
  declare getEavEntityType: BelongsToGetAssociationMixin<EavEntityType>

  declare EavEntityAttributes: NonAttribute<EavEntityAttribute[]>
  declare getEavEntityAttributes: HasManyGetAssociationsMixin<EavEntityAttribute>

  static associations: {
    CatalogProductEntity: Association<CatalogProductEntity, EavAttributeSet>
    EavAttributeGroups: Association<EavAttributeGroup, EavAttributeSet>
    EavEntityType: Association<EavEntityType, EavAttributeSet>
    EavEntityAttributes: Association<EavEntityAttribute, EavAttributeSet>
  }

  static initialize(sequelize: Sequelize) {
    EavAttributeSet.init(
      {
        attributeSetId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'Attribute Set Id',
        },
        entityTypeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: 'Entity Type Id',
        },
        attributeSetName: {
          type: DataTypes.STRING,
          allowNull: true,
          comment: 'Attribute Set Name',
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
        modelName: MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_SET,
        tableName: MAGENTO_TABLE_NAME.EAV_ATTRIBUTE_SET,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    EavAttributeSet.belongsTo(EavEntityType, {
      foreignKey: 'entityTypeId',
    })

    EavAttributeSet.hasMany(CatalogProductEntity, {
      foreignKey: 'attributeSetId',
    })

    EavAttributeSet.hasMany(CatalogCategoryEntity, {
      foreignKey: 'attributeSetId',
    })

    EavAttributeSet.hasMany(EavAttributeGroup, {
      foreignKey: 'attributeSetId',
    })

    EavAttributeSet.hasMany(EavEntityAttribute, {
      foreignKey: 'attributeSetId',
    })
  }
}
