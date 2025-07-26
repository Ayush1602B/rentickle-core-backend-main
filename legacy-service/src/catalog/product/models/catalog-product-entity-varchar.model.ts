import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'
import { CatalogProductEntity } from './catalog-product-entity.model'

export class CatalogProductEntityVarchar extends Model<
  InferAttributes<CatalogProductEntityVarchar>,
  InferCreationAttributes<CatalogProductEntityVarchar>
> {
  declare valueId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeId: number
  declare storeId: number
  declare entityId: number
  declare value: string | null

  static initialize(sequelize: Sequelize) {
    CatalogProductEntityVarchar.init(
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
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_VARCHAR,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_ENTITY_VARCHAR,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    CatalogProductEntityVarchar.belongsTo(CatalogProductEntity, {
      foreignKey: 'entityId',
    })
  }
}
