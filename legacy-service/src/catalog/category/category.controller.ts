import { BaseRequest, HTTP_STATUS_CODE } from '@/shared/api/api.types'
import {
  SWAGGER_STORE_ID_HEADER,
  SWAGGER_STORE_ID_QUERY,
} from '@/shared/api/swagger.types'
import { QUERY_SORT_TYPE } from '@/shared/utils/query-parser.util'
import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common'
import { ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { CategoryApiService } from './api/category-api.service'
import { GetCategoryDiscoverOptionsOutputDto } from './api/dto/category-discovery-options.dto'
import { CategoryTreeOutputDto } from './api/dto/category-get-tree.dto'
import { CategoryProductListOutputDto } from './api/dto/category-product-list.dto'
import { GetCategoryByIdentifierOutputDto } from './api/dto/get-category-by-identifier.dto'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryApiService: CategoryApiService) {}

  @Get('tree')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiQuery(SWAGGER_STORE_ID_QUERY)
  @ApiHeader(SWAGGER_STORE_ID_HEADER)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: CategoryTreeOutputDto,
  })
  getCategoryTree(@Req() req: BaseRequest): Promise<CategoryTreeOutputDto> {
    return this.categoryApiService.getCategoryTreeByStoreId(req.storeId)
  }

  @Get(':categoryId/discovery-options')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiQuery(SWAGGER_STORE_ID_QUERY)
  @ApiHeader(SWAGGER_STORE_ID_HEADER)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: GetCategoryDiscoverOptionsOutputDto,
  })
  getCategoryDiscoveryOptions(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Req() req: BaseRequest,
  ) {
    return this.categoryApiService.getCategoryDiscoveryOptions({
      categoryId,
      storeId: req.storeId,
    })
  }

  @Get(':categoryId/products')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: CategoryProductListOutputDto,
  })
  getCategoryProductList(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Req() req: BaseRequest,
  ) {
    return this.categoryApiService.getCategoryProductList(
      categoryId,
      req.storeId,
      {
        ...req.parsedQuery,
        sorts: {
          entityId: QUERY_SORT_TYPE.desc,
          ...(req.parsedQuery.sorts || {}),
        },
      },
    )
  }

  @Get(':identifier')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiQuery(SWAGGER_STORE_ID_QUERY)
  @ApiHeader(SWAGGER_STORE_ID_HEADER)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: GetCategoryByIdentifierOutputDto,
  })
  async getProductByIdentifier(
    @Param('identifier') identifier: string,
    @Req() req: BaseRequest,
  ): Promise<GetCategoryByIdentifierOutputDto> {
    identifier = identifier.replaceAll('--', '/')
    const product = await this.categoryApiService.getCategoryByIdentifier(
      identifier,
      req.storeId,
    )
    return product
  }

  @Get('/')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: CategoryProductListOutputDto,
  })
  getCategoryList(@Req() req: BaseRequest) {
    return this.categoryApiService.getCategoryList(req.storeId, {
      ...req.parsedQuery,
      sorts: {
        entityId: QUERY_SORT_TYPE.desc,
        ...(req.parsedQuery.sorts || {}),
      },
    })
  }
}
