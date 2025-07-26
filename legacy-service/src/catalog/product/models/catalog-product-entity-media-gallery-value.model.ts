import { CoreStore } from '@/core/store/models/core-store.model'
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
import { CatalogProductEntityMediaGallery } from './catalog-product-entity-media-gallery.model'
import { CatalogProductEntity } from './catalog-product-entity.model'

export type CatalogProductEntityMediaGalleryValueAttributes =
  InferAttributes<CatalogProductEntityMediaGalleryValue>
export type CatalogProductEntityMediaGalleryValueCreationAttributes =
  InferCreationAttributes<CatalogProductEntityMediaGalleryValue>

export class CatalogProductEntityMediaGalleryValue extends Model<
  CatalogProductEntityMediaGalleryValueAttributes,
  CatalogProductEntityMediaGalleryValueCreationAttributes
> {
  declare valueId: number
  declare storeId: number
  declare label: string
  declare position: number
  declare disabled: number

  declare CatalogProductEntityMediaGallery: NonAttribute<CatalogProductEntity>
  declare getCatalogProductEntityMediaGallery: BelongsToGetAssociationMixin<CatalogProductEntity>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  static associations: {
    CoreStore: Association<CatalogProductEntityMediaGalleryValue, CoreStore>
    CatalogProductEntityMediaGallery: Association<
      CatalogProductEntityMediaGalleryValue,
      CatalogProductEntity
    >
  }

  static initialize(sequelize: Sequelize) {
    CatalogProductEntityMediaGalleryValue.init(
      {
        valueId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        storeId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        label: {
          type: DataTypes.CHAR(255),
          allowNull: false,
        },
        position: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        disabled: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName:
          MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_MEDIA_GALLERY_VALUE,
        tableName:
          MAGENTO_TABLE_NAME.CATALOG_PRODUCT_ENTITY_MEDIA_GALLERY_VALUE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogProductEntityMediaGalleryValue.belongsTo(
      CatalogProductEntityMediaGallery,
      {
        foreignKey: 'valueId',
      },
    )
    CatalogProductEntityMediaGalleryValue.belongsTo(CoreStore, {
      foreignKey: 'storeId',
    })
  }
}
