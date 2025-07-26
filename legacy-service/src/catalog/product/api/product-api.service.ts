import { CatalogHelper } from '@/catalog/catalog.helper'
import { ReviewService } from '@/catalog/review/review.service'
import { StoreService } from '@/core/store/store.service'
import { CoreCacheService } from '@/shared/cache/services/core-cache.service'
import { ParsedQuery } from '@/shared/utils/query-parser.util'
import { Injectable } from '@nestjs/common'
import { ProductService } from '../product.service'
import { PRODUCT_CACHE_TTL, ProductListFilters } from '../product.types'
import {
  GetProductByIdentifierInputDto,
  GetProductByIdentifierOutputDto,
} from './dto/get-product-by-identifier.dto'
import {
  GetProductListByQueryInputDto,
  GetProductListByQueryOutputDto,
} from './dto/get-product-list-by-query.dto'
import { GetProductListOutputDto } from './dto/get-product-list.dto'
import { ProductDto } from './dto/product-common.dto'

interface IProductApiService {
  getProductList(
    storeId: number,
    dto: ParsedQuery<ProductListFilters>,
  ): Promise<GetProductListOutputDto>

  getProductByIdentifier(
    dto: GetProductByIdentifierInputDto,
  ): Promise<GetProductByIdentifierOutputDto>

  getProductListByQuery(
    dto: GetProductListByQueryInputDto,
  ): Promise<GetProductListByQueryOutputDto>
}

@Injectable()
export class ProductApiService implements IProductApiService {
  constructor(
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
    private readonly reviewService: ReviewService,
    private readonly catalogHelper: CatalogHelper,
    private readonly coreCacheService: CoreCacheService,
  ) {}

  async getProductList(
    storeId: number,
    listQuery: ParsedQuery<ProductListFilters>,
  ): Promise<GetProductListOutputDto> {
    const store = await this.storeService.validateAndGetStoreById(storeId)
    const paginatedResponse = await this.productService.getProductList(
      store,
      listQuery,
    )

    return new GetProductListOutputDto({
      list: await Promise.all(
        paginatedResponse.list.map((product) =>
          ProductDto.fromEntity(this.catalogHelper, product, store),
        ),
      ),
      page: paginatedResponse.page,
      limit: paginatedResponse.limit,
      hasMore: paginatedResponse.hasMore,
      total: paginatedResponse.total,
    })
  }

  async getProductByIdentifier(
    dto: GetProductByIdentifierInputDto,
  ): Promise<GetProductByIdentifierOutputDto> {
    const { identifier, storeId } = dto

    const productCacheKey = `product:${storeId}:${identifier}`
    const cachedProduct =
      await this.coreCacheService.get<ProductDto>(productCacheKey)
    if (cachedProduct) {
      return cachedProduct
    }

    const store = await this.storeService.validateAndGetStoreById(storeId)
    const {
      product,
      productOptions,
      productVariants,
      variantAttributes,
      productImages,
      productLinks,
    } = await this.productService.validateAndGetByIdentifier(identifier, store)

    const [productReviews, availableRatings] = await Promise.all([
      this.reviewService.getProductReviews(product.entityId, store.storeId),
      this.reviewService.getAvailableProductRatings(),
    ])

    const productData = await ProductDto.fromEntity(
      this.catalogHelper,
      product,
      store,
      productOptions,
      productVariants,
      variantAttributes,
      productImages,
      productLinks,
      productReviews,
      availableRatings,
    )

    await this.coreCacheService.set(
      productCacheKey,
      productData,
      PRODUCT_CACHE_TTL.GET_PRODUCT_INFO,
    )

    return productData
  }

  async getProductListByQuery(
    dto: GetProductListByQueryInputDto,
  ): Promise<GetProductListByQueryOutputDto> {
    const { query, storeId } = dto

    const store = await this.storeService.validateAndGetStoreById(storeId)
    const paginatedResponse = await this.productService.getProductListByQuery(
      store,
      query,
    )

    return new GetProductListByQueryOutputDto({
      list: await Promise.all(
        paginatedResponse.list.map((product) =>
          ProductDto.fromEntity(this.catalogHelper, product, store),
        ),
      ),
      page: paginatedResponse.page,
      limit: paginatedResponse.limit,
      hasMore: paginatedResponse.hasMore,
      total: paginatedResponse.total,
    })
  }
}
