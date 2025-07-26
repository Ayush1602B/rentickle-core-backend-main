import { CatalogProductEntity } from '@/catalog/product/models/catalog-product-entity.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { CatalogCategoryEntity } from './catalog-category-entity.model'

export class CatalogCategoryProduct extends Model<
  InferAttributes<CatalogCategoryProduct>,
  InferCreationAttributes<CatalogCategoryProduct>
> {
  declare categoryId: number
  declare productId: number
  declare position: number

  declare CatalogProductEntity: NonAttribute<CatalogProductEntity>
  declare getCatalogProductEntity: BelongsToGetAssociationMixin<CatalogProductEntity>

  declare CatalogCategoryEntity: NonAttribute<CatalogCategoryEntity>
  declare getCatalogCategoryEntity: BelongsToGetAssociationMixin<CatalogCategoryEntity>

  static associations: {
    CatalogProductEntity: Association<
      CatalogProductEntity,
      CatalogCategoryProduct
    >
    CatalogCategoryEntity: Association<
      CatalogCategoryEntity,
      CatalogCategoryProduct
    >
  }

  static initialize(sequelize: Sequelize) {
    CatalogCategoryProduct.init(
      {
        categoryId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        productId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        position: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_CATEGORY_PRODUCT,
        tableName: MAGENTO_TABLE_NAME.CATALOG_CATEGORY_PRODUCT,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    // CatalogCategoryProduct.belongsTo(CatalogProductEntity, {
    //   foreignKey: 'entityId',
    // })
    // CatalogCategoryProduct.belongsTo(CatalogCategoryEntity, {
    //   foreignKey: 'categoryId',
    // })
  }
}
