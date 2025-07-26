import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { CatalogProductLink } from './catalog-product-link.model'

export type CatalogProductLinkTypeAttributes =
  InferAttributes<CatalogProductLinkType>
export type CatalogProductLinkTypeCreationAttributes =
  InferCreationAttributes<CatalogProductLinkType>

export class CatalogProductLinkType extends Model<
  CatalogProductLinkTypeAttributes,
  CatalogProductLinkTypeCreationAttributes
> {
  declare linkTypeId: CreationOptional<number>
  declare code: string

  declare CatalogProductLinks: NonAttribute<CatalogProductLink[]>
  declare getCatalogProductLinks: HasManyGetAssociationsMixin<CatalogProductLink>

  static associations: {
    CatalogProductLinks: Association<CatalogProductLinkType, CatalogProductLink>
  }

  static initialize(sequelize: Sequelize) {
    CatalogProductLinkType.init(
      {
        linkTypeId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        code: {
          type: DataTypes.CHAR(32),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_LINK_TYPE,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_LINK_TYPE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogProductLinkType.hasMany(CatalogProductLink, {
      foreignKey: 'linkTypeId',
    })
  }
}
