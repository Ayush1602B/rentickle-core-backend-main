import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { CatalogProductLinkType } from './catalog-product-link-type.model'
import { CatalogProductEntity } from './catalog-product-entity.model'

export type CatalogProductLinkAttributes = InferAttributes<CatalogProductLink>
export type CatalogProductLinkCreationAttributes =
  InferCreationAttributes<CatalogProductLink>

export class CatalogProductLink extends Model<
  CatalogProductLinkAttributes,
  CatalogProductLinkCreationAttributes
> {
  declare linkId: CreationOptional<number>
  declare productId: number
  declare linkedProductId: number
  declare linkTypeId: number

  declare CatalogProductLinkType: NonAttribute<CatalogProductLinkType>
  declare getCatalogProductLinkType: BelongsToGetAssociationMixin<CatalogProductLinkType>

  declare CatalogProductEntity: NonAttribute<CatalogProductEntity>
  declare getCatalogProductEntity: BelongsToGetAssociationMixin<CatalogProductEntity>

  declare CatalogProductEntityLinked: NonAttribute<CatalogProductEntity>
  declare getCatalogProductEntityLinked: BelongsToGetAssociationMixin<CatalogProductEntity>

  static associations: {
    CatalogProductLinkType: Association<
      CatalogProductLink,
      CatalogProductLinkType
    >
  }

  static initialize(sequelize: Sequelize) {
    CatalogProductLink.init(
      {
        linkTypeId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        linkedProductId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        linkId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_LINK,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_LINK,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogProductLink.belongsTo(CatalogProductLinkType, {
      foreignKey: 'linkTypeId',
    })

    CatalogProductLink.belongsTo(CatalogProductEntity, {
      foreignKey: 'productId',
    })

    CatalogProductLink.belongsTo(CatalogProductEntity, {
      foreignKey: 'linkedProductId',
      as: 'CatalogProductEntityLinked',
    })
  }
}
