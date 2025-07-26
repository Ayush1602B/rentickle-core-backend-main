import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'
import { CatalogProductOptionTypeValue } from './catalog-product-option-type-value.model'
import { CatalogProductEntity } from './catalog-product-entity.model'

export type AvaCatalogProductEntityDepositAttributes =
  InferAttributes<AvaCatalogProductEntityDeposit>
export type AvaCatalogProductEntityDepositCreationAttributes =
  InferCreationAttributes<AvaCatalogProductEntityDeposit>

export class AvaCatalogProductEntityDeposit extends Model<
  AvaCatalogProductEntityDepositAttributes,
  AvaCatalogProductEntityDepositCreationAttributes
> {
  declare depositId: CreationOptional<number>
  declare productId: number
  declare tenureOptionId: number
  declare value: number
  declare storeId: number
  declare isPercent: number

  static initialize(sequelize: Sequelize) {
    AvaCatalogProductEntityDeposit.init(
      {
        depositId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        productId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        tenureOptionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        value: {
          type: DataTypes.DECIMAL,
          allowNull: false,
          defaultValue: 0.0,
        },
        storeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        isPercent: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.AVA_CATALOG_PRODUCT_ENTITY_DEPOSIT,
        tableName: MAGENTO_TABLE_NAME.AVA_CATALOG_PRODUCT_ENTITY_DEPOSIT,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    AvaCatalogProductEntityDeposit.belongsTo(CatalogProductOptionTypeValue, {
      foreignKey: 'tenureOptionId',
    })
    AvaCatalogProductEntityDeposit.belongsTo(CatalogProductEntity, {
      foreignKey: 'productId',
    })
  }
}
