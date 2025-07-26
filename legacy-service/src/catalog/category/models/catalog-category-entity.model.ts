import { CatalogProductEntity } from '@/catalog/product/models/catalog-product-entity.model'
import {
  BaseSequilizeModel,
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
  NonAttribute,
  Sequelize,
} from 'sequelize'
import {
  MAGENTO_CATEGORY_ATTRIBUTE_CODE,
  MagentoCategoryAttributes,
  MagentoCategoryAttributeValueType,
} from '../category.types'
import { CatalogCategoryEntityDatetime } from './catalog-category-entity-datetime.model'
import { CatalogCategoryEntityDecimal } from './catalog-category-entity-decimal.model'
import { CatalogCategoryEntityInt } from './catalog-category-entity-int.model'
import { CatalogCategoryEntityText } from './catalog-category-entity-text.model'
import { CatalogCategoryEntityVarchar } from './catalog-category-entity-varchar.model'
import { CatalogCategoryProduct } from './catalog-category-product.model'

export class CatalogCategoryEntity extends BaseSequilizeModel<CatalogCategoryEntity> {
  declare entityId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeSetId: number
  declare parentId: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare path: string
  declare position: number
  declare level: number
  declare childrenCount: number

  declare CatalogCategoryEntityVarchars: NonAttribute<
    CatalogCategoryEntityVarchar[]
  >
  declare getCatalogCategoryEntityVarchars: HasManyGetAssociationsMixin<CatalogCategoryEntityVarchar>

  declare CatalogCategoryEntityDatetimes: NonAttribute<
    CatalogCategoryEntityDatetime[]
  >
  declare getCatalogCategoryEntityDatetimes: HasManyGetAssociationsMixin<CatalogCategoryEntityDatetime>

  declare CatalogCategoryEntityDecimals: NonAttribute<
    CatalogCategoryEntityDecimal[]
  >
  declare getCatalogCategoryEntityDecimals: HasManyGetAssociationsMixin<CatalogCategoryEntityDecimal>

  declare CatalogCategoryEntityTexts: NonAttribute<CatalogCategoryEntityText[]>
  declare getCatalogCategoryEntityTexts: HasManyGetAssociationsMixin<CatalogCategoryEntityText>

  declare CatalogCategoryEntityInts: NonAttribute<CatalogCategoryEntityInt[]>
  declare getCatalogCategoryEntityInts: HasManyGetAssociationsMixin<CatalogCategoryEntityInt>

  declare CatalogCategoryProducts: NonAttribute<CatalogCategoryProduct[]>
  declare getCatalogCategoryProducts: HasManyGetAssociationsMixin<CatalogCategoryProduct>

  declare CatalogProductEntities: NonAttribute<CatalogProductEntity[]>
  declare getCatalogProductEntities: HasManyGetAssociationsMixin<CatalogProductEntity>

  declare CatalogCategoryEntity: NonAttribute<CatalogCategoryEntity>
  declare getCatalogCategoryEntity: BelongsToGetAssociationMixin<CatalogCategoryEntity>

  declare CatalogCategoryEntities: NonAttribute<CatalogCategoryEntity[]>
  declare getCatalogCategoryEntities: HasManyGetAssociationsMixin<CatalogCategoryEntity>

  declare EavAttributeSet: NonAttribute<EavAttributeSet>
  declare getEavAttributeSet: BelongsToGetAssociationMixin<EavAttributeSet>

  declare EntityTypeId: NonAttribute<EavEntityType>
  declare getEntityTypeId: BelongsToGetAssociationMixin<EavEntityType>

  static associations: {
    CatalogCategoryEntityVarchars: Association<
      CatalogCategoryEntityVarchar,
      CatalogCategoryEntity
    >
    CatalogCategoryEntityDatetimes: Association<
      CatalogCategoryEntityDatetime,
      CatalogCategoryEntity
    >
    CatalogCategoryEntityDecimals: Association<
      CatalogCategoryEntityDecimal,
      CatalogCategoryEntity
    >
    CatalogCategoryEntityTexts: Association<
      CatalogCategoryEntityText,
      CatalogCategoryEntity
    >
    CatalogCategoryEntityInts: Association<
      CatalogCategoryEntityInt,
      CatalogCategoryEntity
    >
    CatalogCategoryProducts: Association<
      CatalogCategoryProduct,
      CatalogCategoryEntity
    >
    CatalogCategoryProductsByProduct: Association<
      CatalogCategoryProduct,
      CatalogCategoryEntity
    >
  }

  static initialize(sequelize: Sequelize) {
    CatalogCategoryEntity.init(
      {
        entityId: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        entityTypeId: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        attributeSetId: {
          type: DataTypes.BIGINT.UNSIGNED,
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
        parentId: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        path: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        position: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        level: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        childrenCount: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_CATEGORY_ENTITY,
        tableName: MAGENTO_TABLE_NAME.CATALOG_CATEGORY_ENTITY,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogCategoryEntity.hasMany(CatalogCategoryEntityVarchar, {
      foreignKey: 'entityId',
    })

    CatalogCategoryEntity.hasMany(CatalogCategoryEntityDatetime, {
      foreignKey: 'entityId',
    })

    CatalogCategoryEntity.hasMany(CatalogCategoryEntityDecimal, {
      foreignKey: 'entityId',
    })

    CatalogCategoryEntity.hasMany(CatalogCategoryEntityText, {
      foreignKey: 'entityId',
    })

    CatalogCategoryEntity.hasMany(CatalogCategoryEntityInt, {
      foreignKey: 'entityId',
    })

    CatalogCategoryEntity.belongsToMany(CatalogProductEntity, {
      through: CatalogCategoryProduct,
      foreignKey: 'categoryId',
    })

    CatalogCategoryEntity.hasMany(CatalogCategoryEntity, {
      foreignKey: 'parentId',
      sourceKey: 'entityId',
    })

    CatalogCategoryEntity.belongsTo(CatalogCategoryEntity, {
      foreignKey: 'parentId',
      targetKey: 'entityId',
    })

    CatalogCategoryEntity.belongsTo(EavAttributeSet, {
      foreignKey: 'attributeSetId',
    })

    CatalogCategoryEntity.belongsTo(EavEntityType, {
      foreignKey: 'entityTypeId',
    })
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
   * @returns MagentoCategoryAttributes
   */

  async resolveAttributeMapForStore(
    storeId: number = DEFAULT_STORE_VIEW_ID,
  ): Promise<MagentoCategoryAttributes> {
    const categoryAttributeMap: MagentoCategoryAttributes = {}
    const categoryAttributes = await this.getAttributes()

    await this.loadAttributeValues()
    const [
      varcharAttributeValues,
      intAttributeValues,
      decimalAttributeValues,
      textAttributeValues,
      datetimeAttributeValues,
    ] = await Promise.all([
      this.CatalogCategoryEntityVarchars ?? [],
      this.CatalogCategoryEntityInts ?? [],
      this.CatalogCategoryEntityDecimals ?? [],
      this.CatalogCategoryEntityTexts ?? [],
      this.CatalogCategoryEntityDatetimes ?? [],
    ])

    const attributesMap = [
      ...varcharAttributeValues,
      ...intAttributeValues,
      ...decimalAttributeValues,
      ...textAttributeValues,
      ...datetimeAttributeValues,
    ]

    attributesMap.forEach((attrValue) => {
      const attributeCode = categoryAttributes.find(
        (attr) => attr.attributeId === attrValue.attributeId,
      )?.attributeCode as MAGENTO_CATEGORY_ATTRIBUTE_CODE

      if (attributeCode) {
        categoryAttributeMap[attributeCode] = this.resolveAttributeValue(
          attrValue.attributeId,
          storeId,
        )
      }
    })

    return categoryAttributeMap
  }

  async loadAttributeValues(): Promise<this> {
    const [
      varcharAttributeValues,
      intAttributeValues,
      decimalAttributeValues,
      textAttributeValues,
      datetimeAttributeValues,
    ] = await Promise.all([
      this.getCatalogCategoryEntityVarchars(),
      this.getCatalogCategoryEntityInts(),
      this.getCatalogCategoryEntityDecimals(),
      this.getCatalogCategoryEntityTexts(),
      this.getCatalogCategoryEntityDatetimes(),
    ])

    this.CatalogCategoryEntityVarchars = varcharAttributeValues
    this.CatalogCategoryEntityInts = intAttributeValues
    this.CatalogCategoryEntityDecimals = decimalAttributeValues
    this.CatalogCategoryEntityTexts = textAttributeValues
    this.CatalogCategoryEntityDatetimes = datetimeAttributeValues

    return this
  }

  resolveAttributeValue(
    attributeId: number,
    storeId: number = DEFAULT_STORE_VIEW_ID,
  ): MagentoCategoryAttributeValueType {
    const attributeValues = [
      ...(this.CatalogCategoryEntityVarchars ?? []),
      ...(this.CatalogCategoryEntityInts ?? []),
      ...(this.CatalogCategoryEntityDecimals ?? []),
      ...(this.CatalogCategoryEntityTexts ?? []),
      ...(this.CatalogCategoryEntityDatetimes ?? []),
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
}
