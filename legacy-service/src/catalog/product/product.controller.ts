import { BaseRequest, HTTP_STATUS_CODE } from '@/shared/api/api.types'
import {
  SWAGGER_STORE_ID_HEADER,
  SWAGGER_STORE_ID_QUERY,
} from '@/shared/api/swagger.types'
import { Controller, Get, HttpCode, Param, Query, Req } from '@nestjs/common'
import { ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { GetProductByIdentifierOutputDto } from './api/dto/get-product-by-identifier.dto'
import { GetProductListByQueryOutputDto } from './api/dto/get-product-list-by-query.dto'
import { GetProductListOutputDto } from './api/dto/get-product-list.dto'
import { ProductApiService } from './api/product-api.service'

@Controller('products')
export class ProductController {
  constructor(private readonly productApiService: ProductApiService) {}

  @Get('')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: GetProductListOutputDto,
  })
  async getProductsList(
    @Req() req: BaseRequest,
  ): Promise<GetProductListOutputDto> {
    const productsList = await this.productApiService.getProductList(
      req.storeId,
      req.parsedQuery,
    )
    return productsList
  }

  @Get('search')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: GetProductListByQueryOutputDto,
  })
  async getProductListByQuery(
    @Query('query') query: string,
    @Req() req: BaseRequest,
  ): Promise<GetProductListByQueryOutputDto> {
    const productsList = await this.productApiService.getProductListByQuery({
      query,
      storeId: req.storeId,
    })

    return productsList
  }

  @Get(':identifier')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiQuery(SWAGGER_STORE_ID_QUERY)
  @ApiHeader(SWAGGER_STORE_ID_HEADER)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: GetProductByIdentifierOutputDto,
  })
  async getProductByIdentifier(
    @Param('identifier') identifier: string,
    @Req() req: BaseRequest,
  ): Promise<GetProductByIdentifierOutputDto> {
    const product = await this.productApiService.getProductByIdentifier({
      identifier,
      storeId: req.storeId,
    })
    return product
  }

  // @Get(':identifier/review/:storeId')
  // @HttpCode(HTTP_STATUS_CODE.Ok)
  // @ApiQuery(SWAGGER_STORE_ID_QUERY)
  // @ApiHeader(SWAGGER_STORE_ID_HEADER)
  // @ApiResponse({
  //   status: HTTP_STATUS_CODE.Ok,
  //   type: GetReviewByIdentifierOutputListDto,
  // })
  // async getProductReviews(
  //   @Param('identifier') identifier: number,
  //   @Param('storeId') storeId: number,
  // ): Promise<GetReviewByIdentifierOutputListDto> {
  //   const reviews = await this.productApiService.getProductReviews({
  //     identifier,
  //     storeId,
  //   })
  //   return reviews
  // }
}
