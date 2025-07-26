import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from 'sequelize'
import { MAGENTO_TABLE_NAME, MAGENTO_MODEL_NAME } from '@/database/db.types'
import { CatalogProductEntity } from './catalog-product-entity.model'

export class CatalogProductEntityDatetime extends Model<
  InferAttributes<CatalogProductEntityDatetime>,
  InferCreationAttributes<CatalogProductEntityDatetime>
> {
  declare valueId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeId: number
  declare storeId: number
  declare entityId: number
  declare value: Date | null

  static initialize(sequelize: Sequelize) {
    CatalogProductEntityDatetime.init(
      {
        valueId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        entityTypeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        attributeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        storeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        entityId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        value: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_DATETIME,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_ENTITY_DATETIME,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    CatalogProductEntityDatetime.belongsTo(CatalogProductEntity, {
      foreignKey: 'entityId',
    })
  }
}
