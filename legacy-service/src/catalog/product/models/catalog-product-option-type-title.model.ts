import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from 'sequelize'
import { MAGENTO_TABLE_NAME, MAGENTO_MODEL_NAME } from '@/database/db.types'
import { CatalogProductOptionTypeValue } from './catalog-product-option-type-value.model'

export class CatalogProductOptionTypeTitle extends Model<
  InferAttributes<CatalogProductOptionTypeTitle>,
  InferCreationAttributes<CatalogProductOptionTypeTitle>
> {
  declare optionTypeTitleId: CreationOptional<number>
  declare optionTypeId: number
  declare storeId: number
  declare title: string

  static initialize(sequelize: Sequelize) {
    CatalogProductOptionTypeTitle.init(
      {
        optionTypeTitleId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        optionTypeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        storeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION_TYPE_TITLE,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_OPTION_TYPE_TITLE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogProductOptionTypeTitle.belongsTo(CatalogProductOptionTypeValue, {
      foreignKey: 'optionTypeId',
    })
  }
}
