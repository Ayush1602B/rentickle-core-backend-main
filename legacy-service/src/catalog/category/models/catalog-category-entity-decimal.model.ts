import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { CatalogCategoryEntity } from './catalog-category-entity.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { EavAttribute } from '@/eav/models/eav-attribute.model'

export class CatalogCategoryEntityDecimal extends Model {
  declare valueId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeId: number
  declare storeId: number
  declare entityId: number
  declare value: CreationOptional<number | null>

  declare CatalogCategoryEntity: NonAttribute<CatalogCategoryEntity>
  declare getCatalogCategory: BelongsToGetAssociationMixin<CatalogCategoryEntity>

  declare EavAttribute: NonAttribute<EavAttribute>
  declare getEavAttribute: BelongsToGetAssociationMixin<EavAttribute>

  static associations: {
    CatalogCategoryEntity: Association<
      CatalogCategoryEntity,
      CatalogCategoryEntityDecimal
    >
    EavAttribute: Association<EavAttribute, CatalogCategoryEntityDecimal>
  }

  static initialize(sequelize: Sequelize) {
    CatalogCategoryEntityDecimal.init(
      {
        valueId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        entityTypeId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        attributeId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        storeId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        entityId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        value: {
          type: DataTypes.DECIMAL(12, 4),
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_CATEGORY_ENTITY_DECIMAL,
        tableName: MAGENTO_TABLE_NAME.CATALOG_CATEGORY_ENTITY_DECIMAL,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogCategoryEntityDecimal.belongsTo(CatalogCategoryEntity, {
      foreignKey: 'entityId',
    })

    CatalogCategoryEntityDecimal.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })
  }
}
