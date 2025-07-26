import { CatalogProductEntity } from '@/catalog/product/models/catalog-product-entity.model'
import { CoreStore } from '@/core/store/models/core-store.model'
import { DEFAULT_STORE_VIEW_ID } from '@/database/db.types'
import { MAGENTO_ATTRIBUTE_BACKEND_TYPE } from '@/eav/eav.types'
import { EavAttributeOptionValue } from '@/eav/models/eav-attribute-option-value.model'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { EavAttributeRepo } from '@/eav/repo/eav-attribute.repo'
import { AppLogger } from '@/shared/logging/logger.service'
import { ParsedQuery, QUERY_SORT_TYPE } from '@/shared/utils/query-parser.util'
import { Injectable } from '@nestjs/common'
import { FindOptions, Includeable, Op } from 'sequelize'
import { CatalogCategoryEntity } from '../category/models/catalog-category-entity.model'
import { AvaCatalogProductEntityDeposit } from './models/ava-catalog-product-entity-deposit.model'
import { CatalogProductEntityInt } from './models/catalog-product-entity-int.model'
import { CatalogProductEntityMediaGalleryValue } from './models/catalog-product-entity-media-gallery-value.model'
import { CatalogProductEntityMediaGallery } from './models/catalog-product-entity-media-gallery.model'
import { CatalogProductEntityText } from './models/catalog-product-entity-text.model'
import { CatalogProductEntityVarchar } from './models/catalog-product-entity-varchar.model'
import { CatalogProductLinkType } from './models/catalog-product-link-type.model'
import { CatalogProductLink } from './models/catalog-product-link.model'
import { CatalogProductOptionTitle } from './models/catalog-product-option-title.model'
import { CatalogProductOptionTypePrice } from './models/catalog-product-option-type-price.model'
import { CatalogProductOptionTypeTitle } from './models/catalog-product-option-type-title.model'
import { CatalogProductOptionTypeValue } from './models/catalog-product-option-type-value.model'
import { CatalogProductOption } from './models/catalog-product-option.model'
import {
  ProductInvalidSelectOptionException,
  ProductNotFoundException,
} from './product.error'
import {
  MAGENTO_PRODUCT_ATTRIBUTE_CODE,
  MAGENTO_PRODUCT_STATUS,
  MAGENTO_PRODUCT_VISIBILITY,
  PaginatedProductList,
  PRODUCT_BUY_FEATURE_STATUS,
  ProductListFilters,
  SALETYPE_OPTION,
} from './product.types'
import { CatalogProductEntityMediaGalleryRepo } from './repo/catalog-product-entity-media-gallery.repo'
import { CatalogProductEntityRepo } from './repo/catalog-product-entity.repo'
import { MagentoRPCService } from '@/rpc/rpc.service'
import { REQUEST_TYPE } from '@/shared/trace/trace.types'
import { MagentoSearchResultDto } from '@/rpc/rpc.types'

interface IProductService {
  getById(productId: number): Promise<CatalogProductEntity | null>
  getBySku(sku: string): Promise<CatalogProductEntity | null>

  validateAndGetById(productId: number): Promise<CatalogProductEntity>

  validateAndGetByIdentifier(
    identifier: string,
    store: CoreStore,
  ): Promise<{
    product: CatalogProductEntity
    productOptions: CatalogProductOption[]
    productVariants: CatalogProductEntity[]
    variantAttributes: EavAttribute[]
    productImages: CatalogProductEntityMediaGallery[]
    productLinks: CatalogProductLink[]
  }>

  validateSelectedOptions(
    product: CatalogProductEntity,
    childProduct: CatalogProductEntity | null,
    selectedOptions: Record<string, string>,
  ): Promise<void>

  getProductListByCategory(
    category: CatalogCategoryEntity,
    store: CoreStore,
    listQuery: ParsedQuery<ProductListFilters>,
  ): Promise<PaginatedProductList>

  getProductList(
    store: CoreStore,
    listQuery: ParsedQuery<ProductListFilters>,
  ): Promise<PaginatedProductList>

  getProductListByQuery(
    store: CoreStore,
    query: string,
  ): Promise<PaginatedProductList>
}

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly logger: AppLogger,
    private readonly catalogProductEntityRepo: CatalogProductEntityRepo,
    private readonly eavAttributeRepo: EavAttributeRepo,
    private readonly catalogProductEntityMediaGalleryRepo: CatalogProductEntityMediaGalleryRepo,
    private readonly magentoRpcService: MagentoRPCService,
  ) {}

  getById(productId: number): Promise<CatalogProductEntity | null> {
    return this.catalogProductEntityRepo.findOne({
      where: { entityId: productId },
    })
  }

  getBySku(sku: string): Promise<CatalogProductEntity | null> {
    return this.catalogProductEntityRepo.findOne({
      where: { sku },
    })
  }

  async validateAndGetById(productId: number): Promise<CatalogProductEntity> {
    const product = await this.catalogProductEntityRepo.findOneByPk(
      productId.toString(),
    )
    if (!product) {
      throw new ProductNotFoundException(
        `Product not found for ID: ${productId}`,
      )
    }

    return product
  }

  async validateAndGetByIdentifier(
    identifier: string,
    store: CoreStore,
  ): Promise<{
    product: CatalogProductEntity
    productOptions: CatalogProductOption[]
    productVariants: CatalogProductEntity[]
    variantAttributes: EavAttribute[]
    productImages: CatalogProductEntityMediaGallery[]
    productLinks: CatalogProductLink[]
  }> {
    const productAttributes =
      await this.eavAttributeRepo.findProductAttributes()
    const urlKeyAttribute = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.URL_KEY,
    )!
    const urlPathAttribute = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.URL_PATH,
    )!
    const visibilityAttribute = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.VISIBILITY,
    )!
    const statusAttribute = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.STATUS,
    )!
    const sizeOptionAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.SIZEFFD,
    )!
    const sizeSetOptionAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.SIZESETFFD,
    )!
    const saletypeAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.SALETYPE,
    )!
    const enableBuyFeature = productAttributes.find(
      (attribute) =>
        attribute.attributeCode ===
        MAGENTO_PRODUCT_ATTRIBUTE_CODE.ENABLE_BUY_FEATURE,
    )!

    const saletypeRelatedProductIdAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode ===
        MAGENTO_PRODUCT_ATTRIBUTE_CODE.SALETYPE_RELATED_PRODUCT_ID,
    )!

    const attributeIncludes: Includeable[] = [
      {
        model: CatalogProductEntityInt,
        required: false,
        where: {
          attributeId: {
            [Op.in]: [
              statusAttribute.attributeId,
              visibilityAttribute.attributeId,
              sizeOptionAttr.attributeId,
              saletypeAttr.attributeId,
              enableBuyFeature.attributeId,
            ],
          },
          storeId: {
            [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
          },
        },
      },
      {
        model: CatalogProductEntityText,
        required: false,
        where: {
          attributeId: {
            [Op.in]: [
              sizeSetOptionAttr.attributeId,
              saletypeRelatedProductIdAttr.attributeId,
            ],
          },
          storeId: {
            [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
          },
        },
      },
    ]

    const baseQuery: FindOptions<CatalogProductEntity> = {
      include: attributeIncludes,
    }

    const isNumeric = /^\d+$/.test(identifier)
    const whereCondition = isNumeric
      ? {
          entityId: parseInt(identifier, 10),
        }
      : {
          sku: identifier,
        }

    let product = await this.catalogProductEntityRepo.findOne({
      ...baseQuery,
      where: whereCondition,
    })

    if (!product) {
      product = await this.catalogProductEntityRepo.findOne({
        ...baseQuery,
        include: [
          ...attributeIncludes,
          {
            model: CatalogProductEntityVarchar,
            required: true,
            where: {
              [Op.or]: [
                {
                  attributeId: urlKeyAttribute.attributeId,
                  storeId: {
                    [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
                  },
                  value: identifier,
                },
                {
                  attributeId: urlPathAttribute.attributeId,
                  storeId: {
                    [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
                  },
                  value: identifier,
                },
              ],
            },
          },
        ],
      })
    }

    if (!product) {
      throw new ProductNotFoundException(
        `Product not found for identifier: ${identifier}`,
      )
    }

    // Validate product visibility
    const isVisible = await this._resolveProductVisibility(
      product,
      store,
      statusAttribute,
      visibilityAttribute,
    )

    if (!isVisible) {
      throw new ProductNotFoundException('Product is not visible or disabled')
    }

    const [
      productVariants,
      productRentalOptions,
      productBuyOptions,
      productImages,
      productLinks,
    ] = await Promise.all([
      this._getProductVariants(product, store, productAttributes),
      this._getProductRentalOptions(product, store),
      this._getProductBuyOptions(product, store),
      this._getProductImages(product, store),
      this._getProductLinks(product, store, productAttributes),
    ])

    const productVariantAttributes = await this._getVariantAttributes(
      productAttributes,
      store,
      productVariants,
    )

    return {
      product,
      productOptions: productRentalOptions.length
        ? productRentalOptions
        : productBuyOptions,
      productVariants,
      variantAttributes: productVariantAttributes,
      productImages: productImages,
      productLinks: productLinks,
    }
  }

  /**
   * Validates that the product is enabled and visible in the catalog.
   */
  private _resolveProductVisibility(
    product: CatalogProductEntity,
    store: CoreStore,
    statusAttribute: EavAttribute,
    visibilityAttribute: EavAttribute,
  ): Promise<boolean> {
    // 🧠 Fallback logic: ensure ENABLED and correct VISIBILITY
    const statusAttr = product.resolveAttributeValue(
      statusAttribute.attributeId,
      store.storeId,
    )

    const visibilityAttr = product.resolveAttributeValue(
      visibilityAttribute.attributeId,
      store.storeId,
    )

    // Check if the product is enabled and visible in the catalog or catalog and search
    if (
      !statusAttr ||
      !visibilityAttr ||
      statusAttr === null ||
      visibilityAttr === null
    ) {
      // If the product is not enabled or visibility is not set, we assume it's not visible
      return Promise.resolve(false)
    }

    const isValid =
      statusAttr === MAGENTO_PRODUCT_STATUS.ENABLED &&
      [
        MAGENTO_PRODUCT_VISIBILITY.CATALOG,
        MAGENTO_PRODUCT_VISIBILITY.CATALOG_AND_SEARCH,
      ].includes(visibilityAttr as MAGENTO_PRODUCT_VISIBILITY)

    return Promise.resolve(isValid)
  }

  /**
   * Validates that the product contains the selected option IDs.
   */
  async validateSelectedOptions(
    product: CatalogProductEntity,
    childProduct: CatalogProductEntity | null,
    selectedOptions: Record<string, string>,
  ): Promise<void> {
    const productOptions = await product.getCatalogProductOptions()
    const validOptionIds = productOptions.map((option) => option.optionId)
    const selectedOptionIds = Object.keys(selectedOptions).map((id) =>
      parseInt(id, 10),
    )
    const allValid = selectedOptionIds.every((id) =>
      validOptionIds.includes(id),
    )

    if (!allValid) {
      throw new ProductInvalidSelectOptionException(
        `Invalid option selected for product ID ${product.entityId}`,
      )
    }
  }

  private async _paginateProductList(
    store: CoreStore,
    listQuery: ParsedQuery<ProductListFilters>,
  ): Promise<PaginatedProductList> {
    const {
      filters,
      sorts,
      pagination: { limit, page },
    } = listQuery
    const { productId, ...attributeValueMap } = filters
    let opts: FindOptions<CatalogProductEntity> = {}

    const attributeFilterProductIds =
      await this._getProductIdsByAttributeFilters(
        attributeValueMap,
        store.storeId,
      )

    let finalEntityIds: number[] | undefined

    if (attributeFilterProductIds === null) {
      finalEntityIds = productId
    } else if (attributeFilterProductIds.length > 0) {
      if (productId) {
        finalEntityIds = productId.filter((id) =>
          attributeFilterProductIds.includes(id),
        )
      } else {
        finalEntityIds = attributeFilterProductIds
      }
    } else if (attributeFilterProductIds.length === 0) {
      finalEntityIds = []
    }

    if (finalEntityIds) {
      opts.where = {
        ...opts.where,
        entityId: {
          [Op.in]: finalEntityIds,
        },
      }
    }

    opts = {
      ...opts,
      include: await this._buildProductAttributeFilterQuery(
        attributeValueMap,
        store.storeId,
      ),
    }

    const { rows: productListPlusOne } =
      await this.catalogProductEntityRepo.findAllAndCount({
        ...opts,
        order: Object.entries(sorts),
        limit: limit + 1, // +1 to check if there are more  products
        offset: limit * (page - 1),
      })

    const productList = productListPlusOne.slice(0, limit)
    const hasMore = productListPlusOne.length > limit

    const productAttributes =
      await this.eavAttributeRepo.findProductAttributes()

    const visibilityAttribute = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.VISIBILITY,
    )!
    const statusAttribute = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.STATUS,
    )!

    const visibleProducts: CatalogProductEntity[] = []

    for (const product of productList) {
      const isVisible = await this._resolveProductVisibility(
        product,
        store,
        statusAttribute,
        visibilityAttribute,
      )

      if (isVisible) {
        visibleProducts.push(product)
      }
    }

    return {
      list: visibleProducts,
      length: visibleProducts.length,
      page,
      limit,
      hasMore,
      total: visibleProducts.length,
    }
  }

  async getProductList(
    store: CoreStore,
    listQuery: ParsedQuery<ProductListFilters>,
  ): Promise<PaginatedProductList> {
    const productList = await this._paginateProductList(store, listQuery)
    return productList
  }

  async getProductListByCategory(
    category: CatalogCategoryEntity,
    store: CoreStore,
    params: ParsedQuery<ProductListFilters>,
  ): Promise<PaginatedProductList> {
    const categoryProducts = await category.getCatalogProductEntities()
    const productIds = Array.from(
      new Set(categoryProducts.map((product) => product.entityId)),
    )

    return this._paginateProductList(store, {
      ...params,
      filters: {
        ...params.filters,
        productId: productIds,
      },
    })
  }

  private async _getProductIdsByAttributeFilters(
    attributeValueMap: ProductListFilters,
    storeId: number,
  ): Promise<number[] | null> {
    const productAttributes =
      await this.eavAttributeRepo.findProductAttributes()

    const matchingSets: number[][] = []

    if (Object.keys(attributeValueMap).length === 0) {
      return null
    }

    for (const [attributeCode, value] of Object.entries(attributeValueMap)) {
      if (value === undefined || value === null) {
        continue
      }

      const attribute = productAttributes.find(
        (a) => a.attributeCode === attributeCode,
      )
      if (!attribute) {
        continue
      }

      let data: { entityId: number }[] = []

      switch (attribute.backendType) {
        case MAGENTO_ATTRIBUTE_BACKEND_TYPE.VARCHAR:
          data = await CatalogProductEntityVarchar.findAll({
            where: {
              attributeId: attribute.attributeId,
              value: {
                [Op.in]: Array.isArray(value) ? value : [value],
              },
              storeId: {
                [Op.in]: [DEFAULT_STORE_VIEW_ID, storeId],
              },
            },
            attributes: ['entityId'],
          })
          break
        case MAGENTO_ATTRIBUTE_BACKEND_TYPE.INT:
          data = await CatalogProductEntityInt.findAll({
            where: {
              attributeId: attribute.attributeId,
              value: {
                [Op.in]: Array.isArray(value) ? value : [value],
              },
              storeId: {
                [Op.in]: [DEFAULT_STORE_VIEW_ID, storeId],
              },
            },
            attributes: ['entityId'],
          })
          break
        case MAGENTO_ATTRIBUTE_BACKEND_TYPE.TEXT:
          data = await CatalogProductEntityText.findAll({
            where: {
              attributeId: attribute.attributeId,
              value: {
                [Op.in]: Array.isArray(value) ? value : [value],
              },
              storeId: {
                [Op.in]: [DEFAULT_STORE_VIEW_ID, storeId],
              },
            },
            attributes: ['entityId'],
          })
          break
        default:
          this.logger.warn(
            `Unsupported backend type for attribute ${attributeCode}: ${attribute.backendType}`,
          )
          break
      }

      const ids = data.map((d) => d.entityId)
      if (ids.length === 0) {
        // No match for this filter, short-circuit
        continue
      }

      matchingSets.push(ids)
    }

    if (matchingSets.length === 0) {
      return []
    }

    // Compute intersection
    const [firstSet, ...rest] = matchingSets
    const result = firstSet.filter((id) =>
      rest.every((set) => set.includes(id)),
    )

    return result
  }

  private async _buildProductAttributeFilterQuery(
    attributeValueMap: ProductListFilters,
    storeId = DEFAULT_STORE_VIEW_ID,
  ): Promise<FindOptions<CatalogProductEntity>['include']> {
    attributeValueMap = {
      ...attributeValueMap,
      [MAGENTO_PRODUCT_ATTRIBUTE_CODE.VISIBILITY]: [
        MAGENTO_PRODUCT_VISIBILITY.CATALOG,
        MAGENTO_PRODUCT_VISIBILITY.CATALOG_AND_SEARCH,
      ],
      [MAGENTO_PRODUCT_ATTRIBUTE_CODE.STATUS]: MAGENTO_PRODUCT_STATUS.ENABLED,
    }

    const productAttributes =
      await this.eavAttributeRepo.findProductAttributes()
    const productIncludeQueries: FindOptions<CatalogProductEntity>['include'] =
      []

    const filteredVarcharAttributeIds = Object.keys(attributeValueMap)
      .map((attributeCode) => {
        const attribute = productAttributes.find(
          (attr) =>
            attr.attributeCode === attributeCode &&
            attr.backendType === MAGENTO_ATTRIBUTE_BACKEND_TYPE.VARCHAR,
        )
        return attribute?.attributeId
      })
      .filter((attributeId) => attributeId !== undefined)

    const filteredIntAttributeIds = Object.keys(attributeValueMap)
      .map((attributeCode) => {
        const attribute = productAttributes.find(
          (attr) =>
            attr.attributeCode === attributeCode &&
            attr.backendType === MAGENTO_ATTRIBUTE_BACKEND_TYPE.INT,
        )
        return attribute?.attributeId
      })
      .filter((attributeId) => attributeId !== undefined)

    const varcharIncludeQueries: Includeable = {
      model: CatalogProductEntityVarchar,
      required: true,
      where: {
        attributeId: {
          [Op.in]: filteredVarcharAttributeIds,
        },
        storeId: {
          [Op.in]: [DEFAULT_STORE_VIEW_ID, storeId],
        },
      },
    }

    const intIncludeQueries: Includeable = {
      model: CatalogProductEntityInt,
      required: true,
      where: {
        attributeId: {
          [Op.in]: filteredIntAttributeIds,
        },
        storeId: {
          [Op.in]: [DEFAULT_STORE_VIEW_ID, storeId],
        },
      },
    }

    if (filteredVarcharAttributeIds.length > 0) {
      productIncludeQueries.push(varcharIncludeQueries)
    }

    if (filteredIntAttributeIds.length > 0) {
      productIncludeQueries.push(intIncludeQueries)
    }

    return productIncludeQueries
  }

  private async _getProductVariants(
    product: CatalogProductEntity,
    store: CoreStore,
    productAttributes: EavAttribute[],
  ): Promise<CatalogProductEntity[]> {
    const statusAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.STATUS,
    )!
    const visibilityAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.VISIBILITY,
    )!
    const sizeOptionAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.SIZEFFD,
    )!
    const sizeSetOptionAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.SIZESETFFD,
    )!
    const enableBuyFeature = productAttributes.find(
      (attribute) =>
        attribute.attributeCode ===
        MAGENTO_PRODUCT_ATTRIBUTE_CODE.ENABLE_BUY_FEATURE,
    )!

    const productSizeSetOption = product.resolveAttributeValue(
      sizeSetOptionAttr.attributeId,
      store.storeId,
    )

    const enableBuyFeatureValue = product.resolveAttributeValue(
      enableBuyFeature.attributeId,
      store.storeId,
    )

    const variantProductIds: number[] = []

    if (productSizeSetOption) {
      const sizeSetVariantIds = await this._getProductIdsByAttributeFilters(
        {
          [MAGENTO_PRODUCT_ATTRIBUTE_CODE.SIZESETFFD]: productSizeSetOption,
          [MAGENTO_PRODUCT_ATTRIBUTE_CODE.SALETYPE]: SALETYPE_OPTION.RENT,
        },
        store.storeId,
      )

      if (sizeSetVariantIds) {
        variantProductIds.push(...sizeSetVariantIds)

        if (
          enableBuyFeatureValue &&
          enableBuyFeatureValue.toString() ===
            PRODUCT_BUY_FEATURE_STATUS.ENABLED.toString()
        ) {
          const buyFeatureVariantIds =
            await this._getProductIdsByAttributeFilters(
              {
                [MAGENTO_PRODUCT_ATTRIBUTE_CODE.ENABLE_BUY_FEATURE]:
                  PRODUCT_BUY_FEATURE_STATUS.ENABLED,
                [MAGENTO_PRODUCT_ATTRIBUTE_CODE.SALETYPE_RELATED_PRODUCT_ID]: [
                  sizeSetVariantIds,
                ],
              },
              store.storeId,
            )

          if (buyFeatureVariantIds) {
            variantProductIds.push(...buyFeatureVariantIds)
          }
        }
      }
    }

    // const sizeSetVariants = await this.catalogProductEntityRepo.findAll({
    //   include: [
    //     {
    //       model: CatalogProductEntityInt,
    //       required: true,
    //       where: {
    //         attributeId: saletypeAttr.attributeId,
    //         storeId: {
    //           [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
    //         },
    //       },
    //     },
    //     {
    //       model: CatalogProductEntityText,
    //       required: true,
    //       where: {
    //         attributeId: sizeSetOptionAttr.attributeId,
    //         storeId: {
    //           [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
    //         },
    //         value: productSizeSetOption,
    //       },
    //     },
    //   ],
    // })
    // const sizeSetVariantIds = sizeSetVariants.map((variant) => variant.entityId)
    // .filter((id) => id !== product.entityId)

    const attributeIncludes: Includeable[] = [
      {
        model: CatalogProductEntityInt,
        where: {
          attributeId: {
            [Op.in]: [
              statusAttr.attributeId,
              visibilityAttr.attributeId,
              sizeOptionAttr.attributeId,
            ],
          },
          storeId: {
            [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
          },
        },
      },
    ]

    const variantProducts = await this.catalogProductEntityRepo.findAll({
      where: {
        entityId: {
          [Op.in]: variantProductIds,
        },
      },
      include: attributeIncludes,
    })

    const visibleProducts: CatalogProductEntity[] = []
    for (const variant of variantProducts) {
      const isVisible = await this._resolveProductVisibility(
        variant,
        store,
        statusAttr,
        visibilityAttr,
      )

      if (isVisible) {
        visibleProducts.push(variant)
      }
    }

    return visibleProducts
  }

  private async _getProductRentalOptions(
    product: CatalogProductEntity,
    store: CoreStore,
  ): Promise<CatalogProductOption[]> {
    const productOptions = await product.getCatalogProductOptions({
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

      option.CatalogProductEntity = product
    })

    return productOptions
  }

  private async _getProductBuyOptions(
    product: CatalogProductEntity,
    store: CoreStore,
  ): Promise<CatalogProductOption[]> {
    const productOptions = await product.getCatalogProductOptions({
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

      option.CatalogProductEntity = product
    })

    return productOptions
  }

  private async _getVariantAttributes(
    productAttributes: EavAttribute[],
    store: CoreStore,
    productVariants: CatalogProductEntity[] = [],
  ): Promise<EavAttribute[]> {
    const sizeOptionAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.SIZEFFD,
    )!
    const saletypeAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.SALETYPE,
    )!

    const sizeOptions = productVariants.map((variant) =>
      variant.resolveAttributeValue(sizeOptionAttr.attributeId, store.storeId),
    )

    const [sizeOptionAttrOptions, saletypeAttrOptions] = await Promise.all([
      sizeOptionAttr.getEavAttributeOptions({
        where: {
          optionId: {
            [Op.in]: sizeOptions,
          },
        },
        include: [
          {
            model: EavAttributeOptionValue,
            where: {
              storeId: {
                [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
              },
            },
          },
        ],
      }),
      saletypeAttr.getEavAttributeOptions({
        include: [
          {
            model: EavAttributeOptionValue,
            where: {
              storeId: {
                [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
              },
            },
          },
        ],
      }),
    ])

    sizeOptionAttr.EavAttributeOptions = sizeOptionAttrOptions
    saletypeAttr.EavAttributeOptions = saletypeAttrOptions

    return [sizeOptionAttr, saletypeAttr]
  }

  private async _getProductImages(
    product: CatalogProductEntity,
    store: CoreStore,
  ): Promise<CatalogProductEntityMediaGallery[]> {
    const mediaGallery =
      await this.catalogProductEntityMediaGalleryRepo.findAll({
        where: {
          entityId: product.entityId,
        },
        include: [
          {
            model: CatalogProductEntityMediaGalleryValue,
            where: {
              storeId: {
                [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
              },
              disabled: 0, // Only include enabled images
            },
          },
        ],
      })

    return mediaGallery
  }

  private async _getProductLinks(
    product: CatalogProductEntity,
    store: CoreStore,
    productAttributes: EavAttribute[],
  ): Promise<CatalogProductLink[]> {
    const statusAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.STATUS,
    )!
    const visibilityAttr = productAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.VISIBILITY,
    )!

    if (
      !statusAttr ||
      !visibilityAttr ||
      statusAttr === null ||
      visibilityAttr === null
    ) {
      return []
    }

    const productLinks = await product.getCatalogProductLinks({
      include: [
        {
          model: CatalogProductLinkType,
        },
      ],
    })
    const linkedProductIds = productLinks.map((link) => link.linkedProductId)
    const attributeIncludes: Includeable[] = [
      {
        model: CatalogProductEntityInt,
        required: false,
        where: {
          attributeId: {
            [Op.in]: [statusAttr.attributeId, visibilityAttr.attributeId],
          },
          storeId: {
            [Op.in]: [DEFAULT_STORE_VIEW_ID, store.storeId],
          },
        },
      },
    ]

    const linkedProducts = await this.catalogProductEntityRepo.findAll({
      where: {
        entityId: {
          [Op.in]: linkedProductIds,
        },
      },
      include: attributeIncludes,
    })

    const visibleLinks: CatalogProductLink[] = []

    for (const productLink of productLinks) {
      const linkedProduct = linkedProducts.find(
        (p) => p.entityId === productLink.linkedProductId,
      )
      if (!linkedProduct) {
        continue
      }

      // Check if the linked product is visible
      const isVisible = await this._resolveProductVisibility(
        linkedProduct,
        store,
        statusAttr,
        visibilityAttr,
      )

      if (isVisible) {
        productLink.CatalogProductEntityLinked = linkedProduct
        visibleLinks.push(productLink)
      }
    }

    return visibleLinks
  }

  async getProductListByQuery(
    store: CoreStore,
    query: string,
  ): Promise<PaginatedProductList> {
    const magentoSearchResponse =
      await this.magentoRpcService.makeApiCall<MagentoSearchResultDto>({
        method: REQUEST_TYPE.GET,
        url: `/${store.code}/searchautocomplete/ajax/json`,
        params: {
          q: query,
          store_id: store.storeId,
        },
      })

    const productIds = magentoSearchResponse.items.map((item) => item.id)
    return this._paginateProductList(store, {
      filters: {
        productId: productIds,
      },
      sorts: {
        entityId: QUERY_SORT_TYPE.asc,
      },
      pagination: {
        page: 1,
        limit: 50,
      },
    })
  }
}
