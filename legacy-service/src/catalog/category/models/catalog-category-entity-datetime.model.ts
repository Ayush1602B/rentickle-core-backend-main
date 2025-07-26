import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
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

export class CatalogCategoryEntityDatetime extends Model {
  declare valueId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeId: number
  declare storeId: number
  declare entityId: number
  declare value: CreationOptional<Date | null>

  declare CatalogCategoryEntity: NonAttribute<CatalogCategoryEntity>
  declare getCatalogCategory: BelongsToGetAssociationMixin<CatalogCategoryEntity>

  declare EavAttribute: NonAttribute<EavAttribute>
  declare getEavAttribute: BelongsToGetAssociationMixin<EavAttribute>

  static associations: {
    CatalogCategoryEntity: Association<
      CatalogCategoryEntity,
      CatalogCategoryEntityDatetime
    >
    EavAttribute: Association<EavAttribute, CatalogCategoryEntityDatetime>
  }

  static initialize(sequelize: Sequelize) {
    CatalogCategoryEntityDatetime.init(
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
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_CATEGORY_ENTITY_DATETIME,
        tableName: MAGENTO_TABLE_NAME.CATALOG_CATEGORY_ENTITY_DATETIME,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogCategoryEntityDatetime.belongsTo(CatalogCategoryEntity, {
      foreignKey: 'entityId',
    })

    CatalogCategoryEntityDatetime.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })
  }
}
