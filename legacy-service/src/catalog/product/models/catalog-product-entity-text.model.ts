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

export class CatalogProductEntityText extends Model<
  InferAttributes<CatalogProductEntityText>,
  InferCreationAttributes<CatalogProductEntityText>
> {
  declare valueId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeId: number
  declare storeId: number
  declare entityId: number
  declare value: string | null

  static initialize(sequelize: Sequelize) {
    CatalogProductEntityText.init(
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
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_TEXT,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_ENTITY_TEXT,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    CatalogProductEntityText.belongsTo(CatalogProductEntity, {
      foreignKey: 'entityId',
    })
  }
}
