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

import {
  MAGENTO_MODEL_NAME,
  MAGENTO_TABLE_NAME,
  MAX_CHAR_COLUMN_LENGTH,
} from '@/database/db.types'
import { EavAttribute } from '@/eav/models/eav-attribute.model'

export class CatalogCategoryEntityVarchar extends Model {
  declare valueId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeId: number
  declare storeId: number
  declare entityId: number
  declare value: CreationOptional<string | null>

  declare CatalogCategoryEntity: NonAttribute<CatalogCategoryEntity>
  declare getCatalogCategory: BelongsToGetAssociationMixin<CatalogCategoryEntity>

  declare EavAttribute: NonAttribute<EavAttribute>
  declare getEavAttribute: BelongsToGetAssociationMixin<EavAttribute>

  static associations: {
    CatalogCategoryEntity: Association<
      CatalogCategoryEntity,
      CatalogCategoryEntityVarchar
    >
    EavAttribute: Association<EavAttribute, CatalogCategoryEntityVarchar>
  }

  static initialize(sequelize: Sequelize) {
    CatalogCategoryEntityVarchar.init(
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
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        value: {
          type: DataTypes.CHAR(MAX_CHAR_COLUMN_LENGTH.CHAR_255),
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_CATEGORY_ENTITY_VARCHAR,
        tableName: MAGENTO_TABLE_NAME.CATALOG_CATEGORY_ENTITY_VARCHAR,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogCategoryEntityVarchar.belongsTo(CatalogCategoryEntity, {
      foreignKey: 'entityId',
    })

    CatalogCategoryEntityVarchar.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })
  }
}
