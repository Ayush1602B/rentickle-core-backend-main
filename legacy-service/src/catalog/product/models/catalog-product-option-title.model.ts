import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from 'sequelize'
import { MAGENTO_TABLE_NAME, MAGENTO_MODEL_NAME } from '@/database/db.types'
import { CatalogProductOption } from './catalog-product-option.model'

export class CatalogProductOptionTitle extends Model<
  InferAttributes<CatalogProductOptionTitle>,
  InferCreationAttributes<CatalogProductOptionTitle>
> {
  declare optionTitleId: CreationOptional<number>
  declare optionId: number
  declare storeId: number
  declare title: string

  static initialize(sequelize: Sequelize) {
    CatalogProductOptionTitle.init(
      {
        optionTitleId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        optionId: {
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
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION_TITLE,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_OPTION_TITLE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogProductOptionTitle.belongsTo(CatalogProductOption, {
      foreignKey: 'optionId',
    })
  }
}
