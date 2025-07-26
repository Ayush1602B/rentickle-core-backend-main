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
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { CatalogProductEntity } from './catalog-product-entity.model'
import { EavAttribute } from '@/eav/models/eav-attribute.model'

export type CatalogProductSuperAttributeAttributes =
  InferAttributes<CatalogProductSuperAttribute>
export type CatalogProductSuperAttributeCreationAttributes =
  InferCreationAttributes<CatalogProductSuperAttribute>

export class CatalogProductSuperAttribute extends Model<
  CatalogProductSuperAttributeAttributes,
  CatalogProductSuperAttributeCreationAttributes
> {
  declare productSuperAttributeId: CreationOptional<number>
  declare productId: number
  declare attributeId: number
  declare position: number

  declare CatalogProductEntity: NonAttribute<CatalogProductEntity[]>
  declare getCatalogProductEntites: BelongsToGetAssociationMixin<CatalogProductEntity>

  declare EavAttribute: NonAttribute<EavAttribute>
  declare getEavAttribute: BelongsToGetAssociationMixin<EavAttribute>

  static associations: {
    CatalogProductEntity: Association<
      CatalogProductEntity,
      CatalogProductSuperAttribute
    >
    EavAttribute: Association<EavAttribute, CatalogProductSuperAttribute>
  }

  static initialize(sequelize: Sequelize) {
    CatalogProductSuperAttribute.init(
      {
        productSuperAttributeId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        attributeId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        position: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_SUPER_ATTRIBUTE,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_SUPER_ATTRIBUTE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogProductSuperAttribute.belongsTo(CatalogProductEntity, {
      foreignKey: 'productId',
    })
    CatalogProductSuperAttribute.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })
  }
}
