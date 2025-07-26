import { CatalogCategoryEntity } from '@/catalog/category/models/catalog-category-entity.model'
import { CatalogCategoryProduct } from '@/catalog/category/models/catalog-category-product.model'
import { SalesFlatQuoteItem } from '@/checkout/cart/models/sales-flat-quote-item.model'
import { CoreStore } from '@/core/store/models/core-store.model'
import {
  DEFAULT_STORE_VIEW_ID,
  MAGENTO_MODEL_NAME,
  MAGENTO_TABLE_NAME,
} from '@/database/db.types'
import { EavAttributeSet } from '@/eav/models/eav-attribute-set.model'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { EavEntityType } from '@/eav/models/eav-entity-type.model'
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
  Op,
  Sequelize,
} from 'sequelize'
import {
  MAGENTO_PRODUCT_ATTRIBUTE_CODE,
  MAGENTO_PRODUCT_TYPE_ID,
  MagentoProductAttributes,
  MagentoProductAttributeValueType,
} from '../product.types'
import { AvaCatalogProductEntityDeposit } from './ava-catalog-product-entity-deposit.model'
import { CatalogProductEntityDatetime } from './catalog-product-entity-datetime.model'
import { CatalogProductEntityDecimal } from './catalog-product-entity-decimal.model'
import { CatalogProductEntityInt } from './catalog-product-entity-int.model'
import { CatalogProductEntityText } from './catalog-product-entity-text.model'
import { CatalogProductEntityVarchar } from './catalog-product-entity-varchar.model'
import { CatalogProductLink } from './catalog-product-link.model'
import { CatalogProductOptionTitle } from './catalog-product-option-title.model'
import { CatalogProductOptionTypePrice } from './catalog-product-option-type-price.model'
import { CatalogProductOptionTypeTitle } from './catalog-product-option-type-title.model'
import { CatalogProductOptionTypeValue } from './catalog-product-option-type-value.model'
import { CatalogProductOption } from './catalog-product-option.model'
import { CatalogProductSuperAttribute } from './catalog-product-super-attritbute.model'
import { CataloginventoryStockItem } from './cataloginventory-stock-item.model'

export type CatalogProductEntityAttributes =
  InferAttributes<CatalogProductEntity>

export type CatalogProductEntityCreationAttributes =
  InferCreationAttributes<CatalogProductEntity>

export class CatalogProductEntity extends Model<
  CatalogProductEntityAttributes,
  CatalogProductEntityCreationAttributes
> {
  declare entityId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeSetId: number
  declare typeId: MAGENTO_PRODUCT_TYPE_ID
  declare sku: string
  declare hasOptions: number
  declare requiredOptions: number
  declare createdAt: CreationOptional<Date | null>
  declare updatedAt: CreationOptional<Date | null>

  declare EavAttributeSet: NonAttribute<EavAttributeSet>
  declare getEavAttributeSet: BelongsToGetAssociationMixin<EavAttributeSet>

  declare EntityTypeId: NonAttribute<EavEntityType>
  declare getEntityTypeId: BelongsToGetAssociationMixin<EavEntityType>

  declare CatalogCategoryEntities: NonAttribute<CatalogCategoryEntity[]>
  declare getCatalogCategoryEntities: HasManyGetAssociationsMixin<CatalogCategoryEntity>

  declare CatalogProductEntityVarchars: NonAttribute<
    CatalogProductEntityVarchar[]
  >
  declare getCatalogProductEntityVarchars: HasManyGetAssociationsMixin<CatalogProductEntityVarchar>

  declare CatalogProductEntityInts: NonAttribute<CatalogProductEntityInt[]>
  declare getCatalogProductEntityInts: HasManyGetAssociationsMixin<CatalogProductEntityInt>

  declare CatalogProductEntityDecimals: NonAttribute<
    CatalogProductEntityDecimal[]
  >
  declare getCatalogProductEntityDecimals: HasManyGetAssociationsMixin<CatalogProductEntityDecimal>

  declare CatalogProductEntityTexts: NonAttribute<CatalogProductEntityText[]>
  declare getCatalogProductEntityTexts: HasManyGetAssociationsMixin<CatalogProductEntityText>

  declare CatalogProductEntityDatetimes: NonAttribute<
    CatalogProductEntityDatetime[]
  >
  declare getCatalogProductEntityDatetimes: HasManyGetAssociationsMixin<CatalogProductEntityDatetime>

  declare CatalogProductSuperAttributes: NonAttribute<
    CatalogProductSuperAttribute[]
  >
  declare getCatalogProductSuperAttributes: HasManyGetAssociationsMixin<CatalogProductSuperAttribute>

  declare CatalogProductOptions: NonAttribute<CatalogProductOption[]>
  declare getCatalogProductOptions: HasManyGetAssociationsMixin<CatalogProductOption>

  declare CatalogProductLinks: NonAttribute<CatalogProductLink[]>
  declare getCatalogProductLinks: HasManyGetAssociationsMixin<CatalogProductLink>

  declare AvaCatalogProductEntityDeposits: NonAttribute<
    AvaCatalogProductEntityDeposit[]
  >
  declare getAvaCatalogProductEntityDeposits: HasManyGetAssociationsMixin<AvaCatalogProductEntityDeposit>

  declare CataloginventoryStockItems: NonAttribute<CataloginventoryStockItem[]>
  declare getCataloginventoryStockItems: HasManyGetAssociationsMixin<CataloginventoryStockItem>

  static associations: {
    EavAttributeSet: Association<EavAttributeSet, CatalogProductEntity>
    EntityTypeId: Association<EavEntityType, CatalogProductEntity>
    CatalogCategoryEntities: Association<
      CatalogCategoryEntity,
      CatalogProductEntity
    >
    CatalogProductEntityVarchars: Association<
      CatalogProductEntityVarchar,
      CatalogProductEntity
    >
    CatalogProductEntityInt: Association<
      CatalogProductEntityInt,
      CatalogProductEntity
    >
    CatalogProductEntityDecimal: Association<
      CatalogProductEntityDecimal,
      CatalogProductEntity
    >
    CatalogProductEntityText: Association<
      CatalogProductEntityText,
      CatalogProductEntity
    >
    CatalogProductEntityDatetime: Association<
      CatalogProductEntityText,
      CatalogProductEntity
    >
    CatalogProductSuperAttributes: Association<
      CatalogProductSuperAttribute,
      CatalogProductEntity
    >
    CatalogProductOptions: Association<
      CatalogProductOption,
      CatalogProductEntity
    >
    CatalogProductLinks: Association<CatalogProductLink, CatalogProductEntity>
    AvaCatalogProductEntityDeposits: Association<
      AvaCatalogProductEntityDeposit,
      CatalogProductEntity
    >
    CataloginventoryStockItems: Association<
      CataloginventoryStockItem,
      CatalogProductEntity
    >
  }

  static initialize(sequelize: Sequelize) {
    CatalogProductEntity.init(
      {
        entityId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        entityTypeId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        attributeSetId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        typeId: {
          type: DataTypes.STRING(32),
          allowNull: false,
          defaultValue: 0,
        },
        sku: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
        hasOptions: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          defaultValue: 0,
        },
        requiredOptions: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_ENTITY,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    // CatalogProductEntity.hasMany(CatalogCategoryProduct, {
    //   foreignKey: 'productId',
    // })

    CatalogProductEntity.belongsTo(EavAttributeSet, {
      foreignKey: 'attributeSetId',
    })

    CatalogProductEntity.belongsToMany(CatalogCategoryEntity, {
      through: CatalogCategoryProduct,
      foreignKey: 'productId',
    })

    CatalogProductEntity.hasMany(CatalogProductEntityVarchar, {
      foreignKey: 'entityId',
    })

    CatalogProductEntity.hasMany(CatalogProductEntityDecimal, {
      foreignKey: 'entityId',
    })

    CatalogProductEntity.hasMany(CatalogProductEntityInt, {
      foreignKey: 'entityId',
    })

    CatalogProductEntity.hasMany(CatalogProductOption, {
      foreignKey: 'productId',
    })

    CatalogProductEntity.hasMany(CatalogProductEntityText, {
      foreignKey: 'entityId',
    })

    CatalogProductEntity.hasMany(CatalogProductEntityDatetime, {
      foreignKey: 'entityId',
    })

    CatalogProductEntity.hasMany(CatalogProductSuperAttribute, {
      foreignKey: 'entityId',
    })

    CatalogProductEntity.hasMany(SalesFlatQuoteItem, {
      foreignKey: 'productId',
      sourceKey: 'entityId',
    })

    CatalogProductEntity.hasMany(CatalogProductLink, {
      foreignKey: 'productId',
    })

    CatalogProductEntity.hasMany(AvaCatalogProductEntityDeposit, {
      foreignKey: 'productId',
    })

    CatalogProductEntity.hasMany(CataloginventoryStockItem, {
      foreignKey: 'productId',
    })
  }

  getVarcharAttributeValue(
    attributeId: number,
    storeId: number = DEFAULT_STORE_VIEW_ID,
  ): string | null {
    const catalogProductEntityVarchar = this.CatalogProductEntityVarchars || []

    const attribute = catalogProductEntityVarchar.find(
      (attr) => attr.attributeId === attributeId && attr.storeId === storeId,
    )

    return attribute?.value || null
  }

  getIntAttributeValue(
    attributeId: number,
    storeId: number = DEFAULT_STORE_VIEW_ID,
  ): number | null {
    const catalogProductEntityInt = this.CatalogProductEntityInts || []

    const attribute = catalogProductEntityInt.find(
      (attr) => attr.attributeId === attributeId && attr.storeId === storeId,
    )

    return attribute?.value || null
  }

  getDecimalAttributeValue(
    attributeId: number,
    storeId: number = DEFAULT_STORE_VIEW_ID,
  ): number | null {
    const catalogProductEntityDecimal = this.CatalogProductEntityDecimals || []

    const attribute = catalogProductEntityDecimal.find(
      (attr) => attr.attributeId === attributeId && attr.storeId === storeId,
    )

    return attribute?.value || null
  }

  async getAttributes(): Promise<EavAttribute[]> {
    const productAttributeSet = await this.getEavAttributeSet()
    const productEntityAttributes =
      await productAttributeSet.getEavEntityAttributes({
        include: [
          {
            model: EavAttribute,
          },
        ],
      })

    const productAttributes = productEntityAttributes.map(
      (entityAttribute) => entityAttribute.EavAttribute,
    )

    return productAttributes
  }

  /**
   *  Get product attributes map
   * @param productAttributes
   * @param magentoProduct
   * @returns
   */

  async resolveAttributeMapForStore(
    storeId: number = DEFAULT_STORE_VIEW_ID,
  ): Promise<MagentoProductAttributes> {
    const productAttributeMap: MagentoProductAttributes = {}
    const productAttributes = await this.getAttributes()

    await this.loadAttributeValues()
    const [
      varcharAttributeValues,
      intAttributeValues,
      decimalAttributeValues,
      textAttributeValues,
      datetimeAttributeValues,
    ] = await Promise.all([
      this.CatalogProductEntityVarchars ?? [],
      this.CatalogProductEntityInts ?? [],
      this.CatalogProductEntityDecimals ?? [],
      this.CatalogProductEntityTexts ?? [],
      this.CatalogProductEntityDatetimes ?? [],
    ])

    const attributesMap = [
      ...varcharAttributeValues,
      ...intAttributeValues,
      ...decimalAttributeValues,
      ...textAttributeValues,
      ...datetimeAttributeValues,
    ]

    attributesMap.forEach((attrValue) => {
      const attributeCode = productAttributes.find(
        (attr) => attr.attributeId === attrValue.attributeId,
      )?.attributeCode as MAGENTO_PRODUCT_ATTRIBUTE_CODE

      if (attributeCode) {
        productAttributeMap[attributeCode] = this.resolveAttributeValue(
          attrValue.attributeId,
          storeId,
        )
      }
    })

    return productAttributeMap
  }

  resolveAttributeValue(
    attributeId: number,
    storeId: number = DEFAULT_STORE_VIEW_ID,
  ): MagentoProductAttributeValueType {
    const attributeValues = [
      ...(this.CatalogProductEntityVarchars ?? []),
      ...(this.CatalogProductEntityInts ?? []),
      ...(this.CatalogProductEntityDecimals ?? []),
      ...(this.CatalogProductEntityTexts ?? []),
      ...(this.CatalogProductEntityDatetimes ?? []),
    ]

    const attributeValue = attributeValues.find(
      (attr) => attr.attributeId === attributeId && attr.storeId === storeId,
    )

    if (attributeValue) {
      return attributeValue.value
    }

    const defaultAttributeValue = attributeValues.find(
      (attr) =>
        attr.attributeId === attributeId &&
        attr.storeId === DEFAULT_STORE_VIEW_ID,
    )

    return defaultAttributeValue ? defaultAttributeValue.value : null
  }

  async loadAttributeValues(): Promise<this> {
    const [
      varcharAttributeValues,
      intAttributeValues,
      decimalAttributeValues,
      textAttributeValues,
      datetimeAttributeValues,
    ] = await Promise.all([
      this.getCatalogProductEntityVarchars(),
      this.getCatalogProductEntityInts(),
      this.getCatalogProductEntityDecimals(),
      this.getCatalogProductEntityTexts(),
      this.getCatalogProductEntityDatetimes(),
    ])

    this.CatalogProductEntityVarchars = varcharAttributeValues
    this.CatalogProductEntityInts = intAttributeValues
    this.CatalogProductEntityDecimals = decimalAttributeValues
    this.CatalogProductEntityTexts = textAttributeValues
    this.CatalogProductEntityDatetimes = datetimeAttributeValues

    return this
  }

  async getRentalOptions(store: CoreStore): Promise<CatalogProductOption[]> {
    const productOptions = await this.getCatalogProductOptions({
      include: [
        {
          model: CatalogProductOptionTitle,
          where: {
            title: {
              [Op.like]: `%${'tenure'}%`,
            },
          },
        },
        {
          model: CatalogProductOptionTypeValue,
          include: [
            {
              model: CatalogProductOptionTypeTitle,
              where: {
                storeId: {
                  [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
                },
              },
            },
            {
              model: CatalogProductOptionTypePrice,
              where: {
                storeId: {
                  [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
                },
              },
            },
            {
              model: AvaCatalogProductEntityDeposit,
              where: {
                storeId: {
                  [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
                },
              },
            },
          ],
          separate: true,
          order: [['sortOrder', 'ASC']],
        },
      ],
    })

    productOptions.forEach((option) => {
      option.CatalogProductOptionTypeValues.forEach((typeValue) => {
        typeValue.CatalogProductOption = option
      })

      option.CatalogProductEntity = this
    })

    return productOptions
  }

  async getBuyOptions(store: CoreStore): Promise<CatalogProductOption[]> {
    const productOptions = await this.getCatalogProductOptions({
      include: [
        {
          model: CatalogProductOptionTitle,
          where: {
            title: {
              [Op.like]: `%${'buy'}%`,
            },
          },
        },
        {
          model: CatalogProductOptionTypeValue,
          include: [
            {
              model: CatalogProductOptionTypeTitle,
              where: {
                storeId: {
                  [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
                },
              },
            },
            {
              model: CatalogProductOptionTypePrice,
              where: {
                storeId: {
                  [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
                },
              },
            },
          ],
          separate: true,
          order: [['sortOrder', 'ASC']],
        },
      ],
    })

    productOptions.forEach((option) => {
      option.CatalogProductOptionTypeValues.forEach((typeValue) => {
        typeValue.CatalogProductOption = option
      })

      option.CatalogProductEntity = this
    })

    return productOptions
  }
}
