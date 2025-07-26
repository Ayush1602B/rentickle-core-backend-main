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

export class CatalogProductEntityDecimal extends Model<
  InferAttributes<CatalogProductEntityDecimal>,
  InferCreationAttributes<CatalogProductEntityDecimal>
> {
  declare valueId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeId: number
  declare storeId: number
  declare entityId: number
  declare value: number | null

  static initialize(sequelize: Sequelize) {
    CatalogProductEntityDecimal.init(
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
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true, // Since some records have NULL values
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_DECIMAL,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_ENTITY_DECIMAL,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    CatalogProductEntityDecimal.belongsTo(CatalogProductEntity, {
      foreignKey: 'entityId',
    })
  }
}
