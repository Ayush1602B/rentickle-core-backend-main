import { CatalogHelper } from '@/catalog/catalog.helper'
import { ProductDto } from '@/catalog/product/api/dto/product-common.dto'
import { ProductService } from '@/catalog/product/product.service'
import {
  CategoryListFilters,
  ProductListFilters,
} from '@/catalog/product/product.types'
import { StoreService } from '@/core/store/store.service'
import { EavService } from '@/eav/eav.service'
import { ParsedQuery } from '@/shared/utils/query-parser.util'
import { Injectable } from '@nestjs/common'
import { CategoryService } from '../category.service'
import { CategoryDto } from './dto/category-common.dto'
import {
  GetCategoryDiscoverOptionsInputDto,
  GetCategoryDiscoverOptionsOutputDto,
} from './dto/category-discovery-options.dto'
import {
  CategoryTreeNodeDto,
  CategoryTreeOutputDto,
} from './dto/category-get-tree.dto'
import { CategoryProductListOutputDto } from './dto/category-product-list.dto'
import { GetCategoryByIdentifierOutputDto } from './dto/get-category-by-identifier.dto'
import { GetCategoryListOutputDto } from './dto/get-category-list.dto'

interface ICategoryApiService {
  getCategoryTreeByStoreId(storeId: number): Promise<CategoryTreeOutputDto>
  getCategoryDiscoveryOptions(
    dto: GetCategoryDiscoverOptionsInputDto,
  ): Promise<GetCategoryDiscoverOptionsOutputDto>
}

@Injectable()
export class CategoryApiService implements ICategoryApiService {
  constructor(
    private readonly storeService: StoreService,
    private readonly categoryService: CategoryService,
    private readonly eavService: EavService,
    private readonly productService: ProductService,
    private readonly catalogHelper: CatalogHelper,
  ) {}

  async getCategoryTreeByStoreId(
    storeId: number,
  ): Promise<CategoryTreeOutputDto> {
    const store = await this.storeService.validateAndGetStoreById(storeId)
    const storeGroup = await store.getCoreStoreGroup()

    const storeRootCategoryId = storeGroup.rootCategoryId
    const rootCategory =
      await this.categoryService.validateAndGetCategoryById(storeRootCategoryId)

    const categoryTree = await this.categoryService.generateTree(rootCategory)
    return {
      storeId,
      tree: CategoryTreeNodeDto.fromEntity(categoryTree),
    }
  }

  async getCategoryDiscoveryOptions(
    dto: GetCategoryDiscoverOptionsInputDto,
  ): Promise<GetCategoryDiscoverOptionsOutputDto> {
    const [category, store] = await Promise.all([
      this.categoryService.validateAndGetCategoryById(dto.categoryId),
      this.storeService.validateAndGetStoreById(dto.storeId),
    ])

    const result = await this.categoryService.getCategoryDiscoveryOptions(
      category,
      store,
    )

    return GetCategoryDiscoverOptionsOutputDto.fromEntity(result)
  }

  async getCategoryProductList(
    categoryId: number,
    storeId: number,
    params: ParsedQuery<ProductListFilters>,
  ): Promise<CategoryProductListOutputDto> {
    const [category, store] = await Promise.all([
      this.categoryService.validateAndGetCategoryById(categoryId),
      this.storeService.validateAndGetStoreById(storeId),
    ])

    const paginatedResponse =
      await this.productService.getProductListByCategory(
        category,
        store,
        params,
      )

    return new CategoryProductListOutputDto({
      list: await Promise.all(
        paginatedResponse.list.map((product) =>
          ProductDto.fromEntity(this.catalogHelper, product, store),
        ),
      ),
      length: paginatedResponse.list.length,
      page: paginatedResponse.page,
      limit: paginatedResponse.limit,
      hasMore: paginatedResponse.hasMore,
      total: paginatedResponse.total,
    })
  }

  async getCategoryByIdentifier(
    identifier: string,
    storeId: number,
  ): Promise<GetCategoryByIdentifierOutputDto> {
    const store = await this.storeService.validateAndGetStoreById(storeId)
    const category = await this.categoryService.validateAndGetByIdentifier(
      identifier,
      store,
    )

    return CategoryDto.fromEntity(this.catalogHelper, category, store)
  }

  async getCategoryList(
    storeId: number,
    params: ParsedQuery<CategoryListFilters>,
  ): Promise<GetCategoryListOutputDto> {
    const store = await this.storeService.validateAndGetStoreById(storeId)
    const paginatedResponse = await this.categoryService.getActiveCategoryList(
      store,
      params,
    )

    return new GetCategoryListOutputDto({
      list: await Promise.all(
        paginatedResponse.list.map((category) =>
          CategoryDto.fromEntity(this.catalogHelper, category, store),
        ),
      ),
      length: paginatedResponse.list.length,
      page: paginatedResponse.page,
      limit: paginatedResponse.limit,
      hasMore: paginatedResponse.hasMore,
      total: paginatedResponse.total,
    })
  }
}
