import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { CatalogProductEntity } from './catalog-product-entity.model'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { CatalogProductEntityMediaGalleryValue } from './catalog-product-entity-media-gallery-value.model'

export type CatalogProductEntityMediaGalleryAttributes =
  InferAttributes<CatalogProductEntityMediaGallery>
export type CatalogProductEntityMediaGalleryCreationAttributes =
  InferCreationAttributes<CatalogProductEntityMediaGallery>

export class CatalogProductEntityMediaGallery extends Model<
  CatalogProductEntityMediaGalleryAttributes,
  CatalogProductEntityMediaGalleryCreationAttributes
> {
  declare valueId: CreationOptional<number>
  declare attributeId: number
  declare entityId: number
  declare value: string

  declare CatalogProductEntity: NonAttribute<CatalogProductEntity>
  declare getCatalogProductEntity: BelongsToGetAssociationMixin<CatalogProductEntity>

  declare EavAttribute: NonAttribute<EavAttribute>
  declare getEavAttribute: BelongsToGetAssociationMixin<EavAttribute>

  declare CatalogProductEntityMediaGalleryValues: NonAttribute<
    CatalogProductEntityMediaGalleryValue[]
  >
  declare getCatalogProductEntityMediaGalleryValues: HasManyGetAssociationsMixin<CatalogProductEntityMediaGalleryValue>

  static associations: {
    CatalogProductEntity: Association<
      CatalogProductEntityMediaGallery,
      CatalogProductEntity
    >
    EavAttribute: Association<CatalogProductEntityMediaGallery, EavAttribute>
    CatalogProductEntityMediaGalleryValues: Association<
      CatalogProductEntityMediaGallery,
      CatalogProductEntityMediaGalleryValue
    >
  }

  static initialize(sequelize: Sequelize) {
    CatalogProductEntityMediaGallery.init(
      {
        valueId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        attributeId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        entityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        value: {
          type: DataTypes.CHAR(255),
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_MEDIA_GALLERY,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_ENTITY_MEDIA_GALLERY,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogProductEntityMediaGallery.belongsTo(CatalogProductEntity, {
      foreignKey: 'entityId',
    })

    CatalogProductEntityMediaGallery.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })

    CatalogProductEntityMediaGallery.hasMany(
      CatalogProductEntityMediaGalleryValue,
      {
        foreignKey: 'valueId',
      },
    )
  }
}
