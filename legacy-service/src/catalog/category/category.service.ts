import { CoreStore } from '@/core/store/models/core-store.model'
import { DEFAULT_STORE_VIEW_ID } from '@/database/db.types'
import { MAGENTO_ATTRIBUTE_BACKEND_TYPE } from '@/eav/eav.types'
import { CatalogEavAttribute } from '@/eav/models/catalog-eav-attribute.model'
import { EavAttributeOptionValue } from '@/eav/models/eav-attribute-option-value.model'
import { EavAttributeOption } from '@/eav/models/eav-attribute-option.model'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { EavEntityAttribute } from '@/eav/models/eav-entity-attribute.model'
import { EavAttributeSetRepo } from '@/eav/repo/eav-attribute-set.repo'
import { EavAttributeRepo } from '@/eav/repo/eav-attribute.repo'
import { AppLogger } from '@/shared/logging/logger.service'
import { ParsedQuery } from '@/shared/utils/query-parser.util'
import { Injectable } from '@nestjs/common'
import { FindOptions, Includeable, Op } from 'sequelize'
import {
  CategoryListFilters,
  PaginatedCategoryList,
} from '../product/product.types'
import {
  CategoryNotFoundException,
  InvalidRootCategoryException,
} from './category.errors'
import { CategoryTree } from './category.tree'
import {
  MAGENTO_CATEGORY_ATTRIBUTE_CODE,
  MAGENTO_CATEGORY_STATUS,
} from './category.types'
import { CatalogCategoryEntityInt } from './models/catalog-category-entity-int.model'
import { CatalogCategoryEntityVarchar } from './models/catalog-category-entity-varchar.model'
import { CatalogCategoryEntity } from './models/catalog-category-entity.model'
import { CatalogCategoryEntityRepo } from './repo/catalog-category-entity.repo'

interface ICategoryService {
  validateAndGetCategoryById(categoryId: number): Promise<CatalogCategoryEntity>
  generateTree(rootCategory: CatalogCategoryEntity): Promise<CategoryTree>
  getCategoryDiscoveryOptions(
    category: CatalogCategoryEntity,
    store: CoreStore,
  ): Promise<{
    filters: EavAttribute[]
    sorts: EavAttribute[]
  }>
  getCategoryList(
    store: CoreStore,
    listQuery: ParsedQuery<CategoryListFilters>,
  ): Promise<PaginatedCategoryList>

  getActiveCategoryList(
    store: CoreStore,
    listQuery: ParsedQuery<CategoryListFilters>,
  ): Promise<PaginatedCategoryList>
}

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    private readonly catalogCategoryEntityRepo: CatalogCategoryEntityRepo,
    private readonly eavAttributeSetRepo: EavAttributeSetRepo,
    private readonly eavAttributeRepo: EavAttributeRepo,
    private readonly logger: AppLogger,
  ) {}

  async validateAndGetCategoryById(
    categoryId: number,
  ): Promise<CatalogCategoryEntity> {
    const category = await this.catalogCategoryEntityRepo.findOneByPk(
      categoryId.toString(),
    )
    if (!category) {
      throw new CategoryNotFoundException('Category not found')
    }

    return category
  }

  async generateTree(
    rootCategory: CatalogCategoryEntity,
  ): Promise<CategoryTree> {
    const categoryAttributes =
      await this.eavAttributeRepo.findCategoryAttributes()
    const isActiveAttribute = categoryAttributes.find(
      (attr) =>
        attr.attributeCode === MAGENTO_CATEGORY_ATTRIBUTE_CODE.IS_ACTIVE,
    )

    const [rootIsActiveValue] = await rootCategory.getCatalogCategoryEntityInts(
      {
        where: {
          attributeId: isActiveAttribute?.attributeId,
        },
      },
    )

    if (!rootIsActiveValue || rootIsActiveValue.value !== 1) {
      throw new InvalidRootCategoryException('Category is not active')
    }

    const allCategories = await this.catalogCategoryEntityRepo.findAll({
      include: [
        {
          model: CatalogCategoryEntityVarchar,
        },
        {
          model: CatalogCategoryEntityInt,
          where: {
            attributeId: isActiveAttribute?.attributeId,
            value: 1,
          },
        },
      ],
    })

    const categoryTree = CategoryTree.buildTree(
      rootCategory,
      allCategories,
      categoryAttributes,
    )

    return categoryTree
  }

  async getCategoryDiscoveryOptions(
    category: CatalogCategoryEntity,
    store: CoreStore,
  ): Promise<{
    filters: EavAttribute[]
    sorts: EavAttribute[]
  }> {
    // Load all associated products in the category
    const categoryProducts = await category.getCatalogProductEntities()

    // Extract unique attribute set IDs
    const attributeSetIds = [
      ...new Set(
        categoryProducts.map((cp) => cp.attributeSetId).filter(Boolean),
      ),
    ]

    // Fetch all relevant attribute sets and all attribute options
    const [attributeSets] = await Promise.all([
      this.eavAttributeSetRepo.findAll({
        where: { attributeSetId: { [Op.in]: attributeSetIds } },
        include: [
          {
            model: EavEntityAttribute,
            include: [
              {
                model: EavAttribute,
                include: [
                  {
                    model: EavAttributeOption,
                    include: [
                      {
                        model: EavAttributeOptionValue,
                        where: {
                          storeId: {
                            [Op.or]: [
                              { [Op.eq]: store.storeId },
                              { [Op.eq]: DEFAULT_STORE_VIEW_ID }, // Default value
                            ],
                          },
                        },
                      },
                    ],
                  },
                  {
                    model: CatalogEavAttribute,
                  },
                ],
              },
            ],
          },
        ],
      }),
    ])

    // Find common attributes across all attribute sets
    const commonAttributes = attributeSets.reduce(
      (acc, set) => {
        const attrs = set.EavEntityAttributes.map((ea) => ea.EavAttribute)
        return acc.filter((attr) =>
          attrs.some((a) => a.attributeId === attr.attributeId),
        )
      },
      attributeSets[0]?.EavEntityAttributes.map((ea) => ea.EavAttribute) || [],
    )

    // Select only the attributes used for filters
    const filters = commonAttributes.filter(
      (attr) => attr.CatalogEavAttribute?.isFilterable === 1,
    )

    // Select only the attributes used for sorting
    const sorts = commonAttributes.filter(
      (attr) => attr.CatalogEavAttribute?.usedForSortBy === 1,
    )

    return { filters, sorts }
  }

  getById(categoryId: number): Promise<CatalogCategoryEntity | null> {
    return this.catalogCategoryEntityRepo.findOneByPk(categoryId.toString())
  }

  async validateAndGetByIdentifier(
    identifier: string,
    store: CoreStore,
  ): Promise<CatalogCategoryEntity> {
    const categoryAttributes =
      await this.eavAttributeRepo.findCategoryAttributes()

    const urlKeyAttribute = categoryAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_CATEGORY_ATTRIBUTE_CODE.URL_KEY,
    )!
    const urlPathAttribute = categoryAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_CATEGORY_ATTRIBUTE_CODE.URL_PATH,
    )!
    const isActiveAttribute = categoryAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_CATEGORY_ATTRIBUTE_CODE.IS_ACTIVE,
    )!

    let query: FindOptions<CatalogCategoryEntity> = {
      include: [
        {
          model: CatalogCategoryEntityInt,
          where: {
            attributeId: isActiveAttribute.attributeId,
            value: MAGENTO_CATEGORY_STATUS.ACTIVE,
            storeId: {
              [Op.in]: [
                store.storeId,
                DEFAULT_STORE_VIEW_ID, // Default value
              ],
            },
          },
        },
      ],
    }

    const isNumeric = /^\d+$/.test(identifier)
    if (isNumeric) {
      const categoryId = parseInt(identifier, 10)
      const category = await this.catalogCategoryEntityRepo.findOne({
        ...query,
        where: { entityId: categoryId },
      })
      if (category) {
        return category
      }
    }

    query = {
      ...query,
      include: [
        ...(query.include as Includeable[]),
        {
          model: CatalogCategoryEntityVarchar,
          where: {
            [Op.or]: [
              {
                attributeId: urlKeyAttribute.attributeId,
                value: identifier,
              },
              {
                attributeId: urlPathAttribute.attributeId,
                value: identifier,
              },
            ],
          },
        },
      ],
    }

    // If not found by ID, try to find by URL key
    const category = await this.catalogCategoryEntityRepo.findOne(query)
    if (!category) {
      throw new CategoryNotFoundException(
        `Category not found for identifier: ${identifier}`,
      )
    }

    // Check if the category is active
    const isActiveValue = await this._resolveCategorytVisibility(
      category,
      store,
      isActiveAttribute,
    )
    if (!isActiveValue) {
      throw new CategoryNotFoundException(
        `Category not found for identifier: ${identifier}`,
      )
    }

    return category
  }

  /**
   * Validates that the product is enabled and visible in the catalog.
   */
  private _resolveCategorytVisibility(
    category: CatalogCategoryEntity,
    store: CoreStore,
    statusAttribute: EavAttribute,
  ): Promise<boolean> {
    // 🧠 Fallback logic: ensure ENABLED and correct VISIBILITY
    const statusAttr = category.resolveAttributeValue(
      statusAttribute.attributeId,
      store.storeId,
    )

    // Check if the product is enabled and visible in the catalog or catalog and search
    if (!statusAttr || statusAttr === null) {
      // If the product is not enabled or visibility is not set, we assume it's not visible
      return Promise.resolve(false)
    }

    const isValid = Number(statusAttr) === MAGENTO_CATEGORY_STATUS.ACTIVE
    return Promise.resolve(isValid)
  }

  getActiveCategoryList(
    store: CoreStore,
    listQuery: ParsedQuery<CategoryListFilters>,
  ): Promise<PaginatedCategoryList> {
    const activeFilters = {
      ...listQuery.filters,
      is_active: MAGENTO_CATEGORY_STATUS.ACTIVE,
    }

    return this.getCategoryList(store, {
      ...listQuery,
      filters: activeFilters,
    })
  }

  async getCategoryList(
    store: CoreStore,
    listQuery: ParsedQuery<CategoryListFilters>,
  ): Promise<PaginatedCategoryList> {
    const storeCategories = await this._getStoreCategories(store)
    const storeCategoryIds = storeCategories.map(
      (category) => category.entityId,
    )

    const categoryList = await this._paginateCategoryList(store, {
      ...listQuery,
      filters: {
        ...listQuery.filters,
        categoryId: storeCategoryIds,
      },
    })
    return categoryList
  }

  private async _getStoreCategories(
    store: CoreStore,
  ): Promise<CatalogCategoryEntity[]> {
    const coreStoreGroup = await store.getCoreStoreGroup()
    let rootCategory = await this.catalogCategoryEntityRepo.findOne({
      where: {
        entityId: coreStoreGroup.rootCategoryId,
      },
    })

    if (!rootCategory) {
      rootCategory = await this.catalogCategoryEntityRepo.findOne({
        where: {
          entityId: coreStoreGroup.defaultStoreId,
        },
      })
    }

    if (!rootCategory) {
      throw new InvalidRootCategoryException(
        `Root category with ID ${coreStoreGroup.rootCategoryId} not found!`,
      )
    }

    const storeCategories = await this.catalogCategoryEntityRepo.findAll({
      where: {
        path: {
          [Op.like]: `1/${rootCategory.entityId}/%`,
        },
      },
    })

    return storeCategories
  }

  private async _getCategoryIdsByAttributeFilters(
    attributeValueMap: CategoryListFilters,
    storeId: number,
  ): Promise<number[]> {
    const categoryAttributes =
      await this.eavAttributeRepo.findCategoryAttributes()

    const matchingSets: number[][] = []

    for (const [attributeCode, value] of Object.entries(attributeValueMap)) {
      if (value === undefined || value === null) {
        continue
      }

      const attribute = categoryAttributes.find(
        (a) => a.attributeCode === attributeCode,
      )
      if (!attribute) {
        continue
      }

      let data: { entityId: number }[] = []

      switch (attribute.backendType) {
        case MAGENTO_ATTRIBUTE_BACKEND_TYPE.VARCHAR:
          data = await CatalogCategoryEntityVarchar.findAll({
            where: {
              attributeId: attribute.attributeId,
              value: value.toString(),
              storeId: {
                [Op.in]: [DEFAULT_STORE_VIEW_ID, storeId],
              },
            },
            attributes: ['entityId'],
          })
          break
        case MAGENTO_ATTRIBUTE_BACKEND_TYPE.INT:
          data = await CatalogCategoryEntityInt.findAll({
            where: {
              attributeId: attribute.attributeId,
              value: value.toString(),
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
        return []
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

  private async _buildCategoryAttributeFilterQuery(
    attributeValueMap: CategoryListFilters,
    storeId = DEFAULT_STORE_VIEW_ID,
  ): Promise<FindOptions<CatalogCategoryEntity>['include']> {
    const categoryAttributes =
      await this.eavAttributeRepo.findCategoryAttributes()
    const categoryIncludeQueries: FindOptions<CatalogCategoryEntity>['include'] =
      []

    const filteredVarcharAttributeIds = Object.keys(attributeValueMap)
      .map((attributeCode) => {
        const attribute = categoryAttributes.find(
          (attr) =>
            attr.attributeCode === attributeCode &&
            attr.backendType === MAGENTO_ATTRIBUTE_BACKEND_TYPE.VARCHAR,
        )
        return attribute?.attributeId
      })
      .filter((attributeId) => attributeId !== undefined)

    const filteredIntAttributeIds = Object.keys(attributeValueMap)
      .map((attributeCode) => {
        const attribute = categoryAttributes.find(
          (attr) =>
            attr.attributeCode === attributeCode &&
            attr.backendType === MAGENTO_ATTRIBUTE_BACKEND_TYPE.INT,
        )
        return attribute?.attributeId
      })
      .filter((attributeId) => attributeId !== undefined)

    const varcharIncludeQueries: Includeable = {
      model: CatalogCategoryEntityVarchar,
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
      model: CatalogCategoryEntityInt,
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
      categoryIncludeQueries.push(varcharIncludeQueries)
    }

    if (filteredIntAttributeIds.length > 0) {
      categoryIncludeQueries.push(intIncludeQueries)
    }

    return categoryIncludeQueries
  }

  private async _paginateCategoryList(
    store: CoreStore,
    listQuery: ParsedQuery<CategoryListFilters>,
  ): Promise<PaginatedCategoryList> {
    const {
      filters,
      sorts,
      pagination: { limit, page },
    } = listQuery
    const { categoryId, ...attributeValueMap } = filters
    let opts: FindOptions<CatalogCategoryEntity> = {}

    const attributeFilterCategoryIds =
      await this._getCategoryIdsByAttributeFilters(
        attributeValueMap,
        store.storeId,
      )

    let finalEntityIds: number[] | undefined

    if (categoryId && attributeFilterCategoryIds.length > 0) {
      finalEntityIds = categoryId.filter((id) =>
        attributeFilterCategoryIds.includes(id),
      )
    } else if (categoryId) {
      finalEntityIds = categoryId
    } else if (attributeFilterCategoryIds.length > 0) {
      finalEntityIds = attributeFilterCategoryIds
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
      include: await this._buildCategoryAttributeFilterQuery(
        attributeValueMap,
        store.storeId,
      ),
    }

    const { count, rows: categoryListPlusOne } =
      await this.catalogCategoryEntityRepo.findAllAndCount({
        ...opts,
        order: Object.entries(sorts),
        limit: limit + 1, // +1 to check if there are more products
        offset: limit * (page - 1),
      })

    const categoryList = categoryListPlusOne.slice(0, limit)
    const hasMore = categoryListPlusOne.length > limit

    const categoryAttributes =
      await this.eavAttributeRepo.findCategoryAttributes()

    const statusAttribute = categoryAttributes.find(
      (attribute) =>
        attribute.attributeCode === MAGENTO_CATEGORY_ATTRIBUTE_CODE.IS_ACTIVE,
    )!

    const visibleCategories: CatalogCategoryEntity[] = []

    for (const category of categoryList) {
      const isVisible = await this._resolveCategorytVisibility(
        category,
        store,
        statusAttribute,
      )

      if (isVisible) {
        visibleCategories.push(category)
      }
    }

    return {
      list: visibleCategories,
      length: visibleCategories.length,
      page,
      limit,
      hasMore,
      total: count - 1, // -1 because we fetched one extra to check for hasMore
    }
  }
}
