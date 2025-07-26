import { CatalogHelper } from '@/catalog/catalog.helper'
import { Rating, RatingOptionVote, Review } from '@/catalog/review/models'
import { CoreStore } from '@/core/store/models/core-store.model'
import { DEFAULT_STORE_VIEW_ID } from '@/database/db.types'
import { EavAttributeOption } from '@/eav/models/eav-attribute-option.model'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'
import { AvaCatalogProductEntityDeposit } from '../../models/ava-catalog-product-entity-deposit.model'
import { CatalogProductEntityMediaGallery } from '../../models/catalog-product-entity-media-gallery.model'
import { CatalogProductEntity } from '../../models/catalog-product-entity.model'
import { CatalogProductLink } from '../../models/catalog-product-link.model'
import { CatalogProductOptionTypeValue } from '../../models/catalog-product-option-type-value.model'
import { CatalogProductOption } from '../../models/catalog-product-option.model'
import { CataloginventoryStockItem } from '../../models/cataloginventory-stock-item.model'
import {
  MAGENTO_PRODUCT_ATTRIBUTE_CODE,
  MAGENTO_PRODUCT_TYPE_ID,
  MagentoProductAttributes,
  SALETYPE_OPTION,
} from '../../product.types'

class ProductVariantDto extends BaseDto<ProductVariantDto> {
  @ApiProperty()
  @IsNumber()
  declare productId: number

  @ApiProperty()
  @IsString()
  declare sku: string

  @ApiProperty()
  @IsString()
  declare name: string

  @ApiProperty()
  @IsString()
  declare urlKey: string

  @ApiProperty()
  @IsString()
  declare urlPath: string

  @ApiProperty({ type: Object })
  @IsObject()
  declare variantConfiguration: Record<string, any>

  static async fromEntity(
    variant: CatalogProductEntity,
    store: CoreStore,
    variantAttributes: EavAttribute[],
  ): Promise<ProductVariantDto> {
    const attributeValueMap = await variant.resolveAttributeMapForStore(
      store.storeId,
    )

    const sizeAttrValue = attributeValueMap.sizeffd
    const saletypeAttrValue = attributeValueMap.saletype

    const sizeAttrOption = variantAttributes
      .flatMap((attr) => attr.EavAttributeOptions || [])
      .find((option) => option.optionId === sizeAttrValue)

    const saletypeAttrOption = variantAttributes
      .flatMap((attr) => attr.EavAttributeOptions || [])
      .find((option) => option.optionId === saletypeAttrValue)

    // if (!sizeAttrOption || !saletypeAttrOption) {
    //   return new ProductVariantDto({})
    // }

    const variantConfiguration: Record<string, any> = {}
    if (sizeAttrOption) {
      variantConfiguration[sizeAttrOption.attributeId] = sizeAttrOption.optionId
    }

    if (saletypeAttrOption) {
      variantConfiguration[saletypeAttrOption.attributeId] =
        saletypeAttrOption.optionId
    }

    return new ProductVariantDto({
      productId: variant.entityId,
      variantConfiguration: variantConfiguration,
      sku: variant.sku,
      name: (attributeValueMap.name as string) || '',
      urlKey: (attributeValueMap.url_key as string) || '',
      urlPath: (attributeValueMap.url_path as string) || '',
    })
  }
}

class ProductVariantOptionValueDto extends BaseDto<ProductVariantOptionValueDto> {
  @ApiProperty()
  @IsNumber()
  declare id: number

  @ApiProperty()
  @IsNumber()
  declare sortOrder: number

  @ApiProperty()
  @IsNumber()
  declare storeId: number

  @ApiProperty()
  @IsString()
  declare value: string

  static fromEntity(
    option: EavAttributeOption,
    store: CoreStore,
  ): ProductVariantOptionValueDto {
    const defaultValue = (option.EavAttributeOptionValues || []).find(
      (value) => value.storeId === DEFAULT_STORE_VIEW_ID,
    )

    const storeValue = (option.EavAttributeOptionValues || []).find(
      (value) => value.storeId === store.storeId,
    )

    return new ProductVariantOptionValueDto({
      id: option.optionId,
      sortOrder: option.sortOrder,
      storeId: store.storeId,
      value: storeValue?.value || defaultValue?.value || '',
    })
  }
}

class ProductVariantOptionDto extends BaseDto<ProductVariantOptionDto> {
  @ApiProperty()
  @IsNumber()
  declare id: number

  @ApiProperty()
  @IsString()
  declare code: string

  @ApiProperty()
  @IsString()
  declare title: string

  @ApiProperty({ type: ProductVariantOptionValueDto, isArray: true })
  declare values: ProductVariantOptionValueDto[]

  static fromEntity(
    attribute: EavAttribute,
    store: CoreStore,
  ): ProductVariantOptionDto {
    return new ProductVariantOptionDto({
      id: attribute.attributeId,
      code: attribute.attributeCode,
      title: attribute.frontendLabel,
      values: (attribute.EavAttributeOptions || []).map((option) =>
        ProductVariantOptionValueDto.fromEntity(option, store),
      ),
    })
  }
}

class ProductDepositOptionDto extends BaseDto<ProductDepositOptionDto> {
  @ApiProperty()
  @IsNumber()
  declare depositOptionId: number

  @ApiProperty()
  @IsNumber()
  declare tenureOptionId: number

  @ApiProperty()
  @IsNumber()
  declare value: number

  @ApiProperty()
  @IsBoolean()
  declare isPercent: boolean

  static fromEntity(
    option: AvaCatalogProductEntityDeposit,
  ): ProductDepositOptionDto {
    return new ProductDepositOptionDto({
      depositOptionId: option.depositId,
      tenureOptionId: option.tenureOptionId,
      value: Number(option.value),
      isPercent: Boolean(option.isPercent),
    })
  }
}

class ProductOptionValueDto extends BaseDto<ProductOptionValueDto> {
  @ApiProperty()
  @IsNumber()
  declare optionValueId: number

  @ApiProperty()
  @IsString()
  declare title: string

  @ApiProperty()
  @IsString()
  declare sku: string

  @ApiProperty()
  @IsNumber()
  declare sortOrder: number

  @ApiProperty()
  @IsString()
  declare priceType: string

  @ApiProperty()
  @IsNumber()
  declare price: number

  @ApiProperty()
  @IsBoolean()
  declare hasDeposit: boolean

  @ApiProperty()
  @IsNumber()
  declare priceIncludingBase: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare deposit: number | null

  @ApiProperty()
  @IsBoolean()
  declare isDepositPercent: boolean

  @ApiProperty()
  @IsNumber()
  declare finalDeposit: number

  static async fromEntity(
    value: CatalogProductOptionTypeValue,
    store: CoreStore,
  ): Promise<ProductOptionValueDto> {
    const product = value.CatalogProductOption.CatalogProductEntity

    const productAttributes = await product.getAttributes()
    const priceAttribute = productAttributes.find(
      (attr) => attr.attributeCode === MAGENTO_PRODUCT_ATTRIBUTE_CODE.PRICE,
    )!

    const defaultTitle = (value.CatalogProductOptionTypeTitles || []).find(
      (title) => title.storeId === DEFAULT_STORE_VIEW_ID,
    )

    const storeTitle = (value.CatalogProductOptionTypeTitles || []).find(
      (title) => title.storeId === store.storeId,
    )

    const title = storeTitle?.title || defaultTitle?.title || ''

    const defaultPrice = (value.CatalogProductOptionTypePrices || []).find(
      (title) => title.storeId === DEFAULT_STORE_VIEW_ID,
    )

    const storePrice = (value.CatalogProductOptionTypePrices || []).find(
      (title) => title.storeId === store.storeId,
    )

    const tenureDepositOptions = (
      value.AvaCatalogProductEntityDeposits || []
    ).filter((deposit) => deposit.tenureOptionId)

    const hasDeposit = tenureDepositOptions.length > 0
    const defaultDepositOption = tenureDepositOptions.find(
      (deposit) => deposit.storeId === DEFAULT_STORE_VIEW_ID,
    )

    const storeDepositOption = tenureDepositOptions.find(
      (deposit) => deposit.storeId === store.storeId,
    )

    const basePrice = product.resolveAttributeValue(
      priceAttribute.attributeId,
      store.storeId,
    )

    const optionPrice =
      Number(storePrice?.price) || Number(defaultPrice?.price) || 0
    const finalPrice = Number(basePrice) + optionPrice

    const finalDepositOption =
      storeDepositOption || defaultDepositOption || null

    const isDepositPercent = Boolean(finalDepositOption?.isPercent) || false
    const depositValue = finalDepositOption
      ? Number(finalDepositOption.value)
      : 0

    const finalDepositValue = isDepositPercent
      ? (finalPrice * depositValue) / 100
      : depositValue

    return new ProductOptionValueDto({
      optionValueId: value.optionTypeId,
      title: title,
      sku: value.sku,
      sortOrder: value.sortOrder,
      priceType: storePrice?.priceType || defaultPrice?.priceType || 'fixed',
      price: optionPrice,
      priceIncludingBase: finalPrice,
      hasDeposit: hasDeposit,
      deposit: depositValue,
      isDepositPercent: isDepositPercent,
      finalDeposit: finalDepositValue,
    })
  }
}

class ProductOptionDto extends BaseDto<ProductOptionDto> {
  @ApiProperty()
  @IsNumber()
  declare optionId: number

  @ApiProperty()
  @IsString()
  declare title: string

  @ApiProperty()
  @IsString()
  declare type: string

  @ApiProperty()
  @IsNumber()
  declare sortOrder: number

  @ApiProperty({ type: ProductOptionValueDto, isArray: true })
  declare values: ProductOptionValueDto[]

  static async fromEntity(
    option: CatalogProductOption,
    store: CoreStore,
  ): Promise<ProductOptionDto> {
    const defaultTitle = (option.CatalogProductOptionTitles || []).find(
      (title) => title.storeId === DEFAULT_STORE_VIEW_ID,
    )

    const storeTitle = (option.CatalogProductOptionTitles || []).find(
      (title) => title.storeId === store.storeId,
    )

    const title = storeTitle?.title || defaultTitle?.title || ''

    return new ProductOptionDto({
      optionId: option.optionId,
      title: title,
      type: option.type!,
      sortOrder: option.sortOrder,
      values: await Promise.all(
        (option.CatalogProductOptionTypeValues || []).map((value) =>
          ProductOptionValueDto.fromEntity(value, store),
        ),
      ),
    })
  }
}

class SaleConfigurationDto extends BaseDto<SaleConfigurationDto> {
  @ApiProperty()
  @IsBoolean()
  declare allowRent: boolean

  @ApiProperty()
  @IsBoolean()
  declare allowBuy: boolean

  @ApiProperty()
  @IsBoolean()
  declare basePrice: number

  @ApiProperty()
  @IsNumber()
  declare minPrice: number

  @ApiProperty()
  @IsNumber()
  declare maxPrice: number

  @ApiProperty()
  @IsNumber()
  declare minDeposit: number

  @ApiProperty()
  @IsNumber()
  declare maxDeposit: number

  @ApiProperty({ type: ProductOptionDto, isArray: true })
  declare options: ProductOptionDto[]

  @ApiProperty({ type: () => Date })
  declare depositOptions: ProductDepositOptionDto[]
}

class ProductGalleryImageDto extends BaseDto<ProductGalleryImageDto> {
  @ApiProperty()
  @IsNumber()
  declare id: number

  @ApiProperty()
  @IsNumber()
  declare attributeId: number

  @ApiProperty()
  @IsString()
  declare url: string

  @ApiProperty()
  @IsNumber()
  declare storeId: number

  @ApiProperty()
  @IsString()
  declare label: string

  @ApiProperty()
  @IsNumber()
  declare position: number

  @ApiProperty()
  @IsBoolean()
  declare disabled: boolean

  static fromEntity(
    image: CatalogProductEntityMediaGallery,
    store: CoreStore,
    catalogHelper: CatalogHelper,
  ): ProductGalleryImageDto {
    const defaultValue = (
      image.CatalogProductEntityMediaGalleryValues || []
    ).find((value) => value.storeId === DEFAULT_STORE_VIEW_ID)

    const storeValue = (
      image.CatalogProductEntityMediaGalleryValues || []
    ).find((value) => value.storeId === store.storeId)

    return new ProductGalleryImageDto({
      id: image.valueId,
      attributeId: image.attributeId,
      url: catalogHelper.formatProductImageUrl(image.value),
      storeId: store.storeId,
      label: storeValue?.label || defaultValue?.label || '',
      position: storeValue?.position || defaultValue?.position || 0,
      disabled: Boolean(storeValue?.disabled || defaultValue?.disabled),
    })
  }
}

class ProductRatingVoteDto extends BaseDto<ProductRatingVoteDto> {
  @ApiProperty()
  @IsNumber()
  declare ratingId: number

  @ApiProperty()
  @IsString()
  declare ratingCode: string

  @ApiProperty()
  @IsNumber()
  declare position: number

  @ApiProperty()
  @IsNumber()
  declare value: number

  @ApiProperty()
  @IsNumber()
  declare percent: number

  static fromEntity(optionVote: RatingOptionVote): ProductRatingVoteDto {
    return new ProductRatingVoteDto({
      ratingId: optionVote.ratingId,
      ratingCode: optionVote.Rating.ratingCode,
      position: optionVote.Rating.position,
      value: optionVote.value,
      percent: optionVote.percent,
    })
  }
}

class ProductReviewDto extends BaseDto<ProductReviewDto> {
  @ApiProperty()
  @IsNumber()
  declare reviewId: number

  @ApiProperty()
  @IsString()
  declare title: string

  @ApiProperty()
  @IsString()
  declare detail: string

  @ApiProperty()
  @IsString()
  declare nickname: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  declare customerId: number | null

  @ApiProperty()
  @IsNumber()
  declare summaryRatingValue: number

  @ApiProperty()
  @IsNumber()
  declare summaryRatingPercent: number

  @ApiProperty({ type: () => ProductRatingVoteDto, isArray: true })
  @IsObject()
  declare ratingVotes: ProductRatingVoteDto[]

  @ApiProperty({ type: () => Date })
  @IsString()
  declare createdAt: Date | null

  static fromEntity(review: Review): ProductReviewDto {
    //  calculate summary rating, we have percentage of each rating option
    let summaryRatingValue = review.RatingOptionVotes.reduce((acc, vote) => {
      return acc + (vote.value || 0)
    }, 0)
    summaryRatingValue = Number(
      Number(summaryRatingValue / review.RatingOptionVotes.length).toPrecision(
        2,
      ),
    )

    let summaryRatingPercent = review.RatingOptionVotes.reduce((acc, vote) => {
      return acc + (vote.percent || 0)
    }, 0)
    summaryRatingPercent = Math.round(
      summaryRatingPercent / review.RatingOptionVotes.length,
    )

    return new ProductReviewDto({
      reviewId: review.reviewId,
      title: review.ReviewDetail.title,
      detail: review.ReviewDetail.detail,
      nickname: review.ReviewDetail.nickname,
      customerId: Number(review.ReviewDetail.customerId) || null,
      createdAt: review.createdAt ? new Date(review.createdAt) : null,
      summaryRatingValue: summaryRatingValue,
      summaryRatingPercent: summaryRatingPercent,
      ratingVotes: review.RatingOptionVotes.map(
        (optionVote: RatingOptionVote) =>
          ProductRatingVoteDto.fromEntity(optionVote),
      ),
    })
  }
}

class ProductRatingOptionDto extends BaseDto<ProductRatingOptionDto> {
  @ApiProperty()
  @IsNumber()
  declare ratingOptionId: number

  @ApiProperty()
  @IsString()
  declare code: string

  @ApiProperty()
  @IsNumber()
  declare value: number

  @ApiProperty()
  @IsNumber()
  declare position: number
}

class ProductRatingDto extends BaseDto<ProductRatingDto> {
  @ApiProperty()
  @IsNumber()
  declare ratingId: number

  @ApiProperty()
  @IsString()
  declare ratingCode: string

  @ApiProperty()
  @IsNumber()
  declare position: number

  @ApiProperty()
  @IsString()
  declare options: ProductRatingOptionDto[]

  static fromEntity(rating: Rating): ProductRatingDto {
    return new ProductRatingDto({
      ratingId: rating.ratingId,
      ratingCode: rating.ratingCode,
      position: rating.position,
      options: (rating.RatingOptions || []).map(
        (option) =>
          new ProductRatingOptionDto({
            ratingOptionId: option.optionId,
            code: option.code,
            value: option.value,
            position: option.position,
          }),
      ),
    })
  }
}

class ProductReviewAndRatingDto extends BaseDto<ProductReviewAndRatingDto> {
  @ApiProperty()
  @IsNumber()
  declare totalReviews: number

  @ApiProperty()
  @IsNumber()
  declare totalRatingSummaryValue: number

  @ApiProperty()
  @IsNumber()
  declare totalRatingSummaryPercent: number

  @ApiProperty({ type: () => ProductReviewDto, isArray: true })
  declare customerReviews: ProductReviewDto[]

  @ApiProperty({ type: () => ProductRatingDto, isArray: true })
  declare availableRatings: ProductRatingDto[]

  static fromEntity(
    reviews: Review[],
    availableRatings: Rating[],
  ): ProductReviewAndRatingDto {
    const productReviews = reviews.map((review) => {
      return ProductReviewDto.fromEntity(review)
    })

    let totalSummaryValue = productReviews.reduce(
      (acc, review) => acc + review.summaryRatingValue,
      0,
    )
    let totalSummaryPercent = productReviews.reduce(
      (acc, review) => acc + review.summaryRatingPercent,
      0,
    )
    const totalReviews = productReviews.length
    if (totalReviews > 0) {
      totalSummaryValue = Number((totalSummaryValue / totalReviews).toFixed(1))
      totalSummaryPercent = Math.round(totalSummaryPercent / totalReviews)
    }

    return new ProductReviewAndRatingDto({
      totalReviews: totalReviews,
      totalRatingSummaryValue: totalSummaryValue,
      totalRatingSummaryPercent: totalSummaryPercent,
      availableRatings: availableRatings.map((rating) =>
        ProductRatingDto.fromEntity(rating),
      ),
      customerReviews: reviews.map((review) =>
        ProductReviewDto.fromEntity(review),
      ),
    })
  }
}

export class ProductInventoryDto extends BaseDto<ProductInventoryDto> {
  @ApiProperty()
  @IsNumber()
  declare qty: number

  @ApiProperty()
  @IsNumber()
  declare minSaleQty: number

  @ApiProperty()
  @IsNumber()
  declare maxSaleQty: number

  @ApiProperty()
  @IsBoolean()
  declare isInStock: boolean

  @ApiProperty()
  @IsBoolean()
  declare qtyIncrement: boolean

  @ApiProperty()
  @IsBoolean()
  declare stockName: string

  static fromEntity(stockItem: CataloginventoryStockItem) {
    return new ProductInventoryDto({
      qty: stockItem.qty,
      minSaleQty: stockItem.minSaleQty,
      maxSaleQty: stockItem.maxSaleQty,
      isInStock: Boolean(stockItem.isInStock),
      qtyIncrement: Boolean(stockItem.enableQtyIncrements),
      stockName: 'default', // Assuming default stock type, can be extended
    })
  }
}

export class ProductDto extends BaseDto<ProductDto> {
  @ApiProperty()
  @IsNumber()
  productId: number

  @ApiProperty()
  @IsString()
  sku: string

  @ApiProperty()
  @IsNumber()
  attributeSetId: number

  @ApiProperty()
  @IsString()
  typeId: MAGENTO_PRODUCT_TYPE_ID

  @ApiProperty()
  @IsNumber()
  hasOptions: number

  @ApiProperty()
  @IsNumber()
  requiredOptions: number

  @ApiProperty()
  @IsNumber()
  name: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty()
  @IsString()
  shortDescription: string

  @ApiProperty()
  @IsString()
  specifications: string

  @ApiProperty()
  @IsString()
  metaTitle: string

  @ApiProperty()
  @IsString()
  metaDescription: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  metaKeyword: string

  @ApiProperty()
  @IsString()
  image: string

  @ApiProperty()
  @IsString()
  imageLabel: string

  @ApiProperty()
  @IsString()
  smallImage: string

  @ApiProperty()
  @IsString()
  smallImageLabel: string

  @ApiProperty()
  @IsString()
  thumbnail: string

  @ApiProperty()
  @IsString()
  thumbnailLabel: string

  @ApiProperty()
  @IsString()
  rotatorImage: string

  @ApiProperty()
  @IsString()
  urlKey: string

  @ApiProperty()
  @IsString()
  urlPath: string

  @ApiProperty()
  @IsNumber()
  taxClassId: number

  @ApiProperty()
  @IsNumber()
  price: number

  @ApiProperty()
  @IsNumber()
  specialPrice: number

  @ApiProperty({ type: () => Date })
  @IsString()
  createdAt: Date | null

  @ApiProperty({ type: () => Date })
  @IsString()
  updatedAt: Date | null

  @ApiProperty({ type: () => Date })
  @IsString()
  newsFromDate: Date | null

  @ApiProperty({ type: () => Date })
  @IsString()
  newsToDate: Date | null

  @ApiProperty({ type: Object })
  additionalAttributes: MagentoProductAttributes

  @ApiProperty({ type: SaleConfigurationDto })
  declare saleConfiguration: SaleConfigurationDto

  @ApiProperty({ type: ProductVariantOptionDto, isArray: true })
  declare variantOptions: ProductVariantOptionDto[]

  @ApiProperty({ type: ProductVariantDto, isArray: true })
  declare variants: ProductVariantDto[]

  @ApiProperty({ type: ProductGalleryImageDto, isArray: true })
  declare galleryImages: ProductGalleryImageDto[]

  @ApiProperty({ type: () => ProductLinkDto, isArray: true })
  declare addonLinks: ProductLinkDto[]

  @ApiProperty({ type: ProductReviewAndRatingDto })
  declare reviewAndRating: ProductReviewAndRatingDto

  @ApiProperty({ type: ProductInventoryDto })
  declare inventoryStock: ProductInventoryDto

  static async fromEntity(
    catalogHelper: CatalogHelper,
    product: CatalogProductEntity,
    store: CoreStore,
    productOptions: CatalogProductOption[] = [],
    productVariants: CatalogProductEntity[] = [],
    variantAttributes: EavAttribute[] = [],
    productImages: CatalogProductEntityMediaGallery[] = [],
    productLinks: CatalogProductLink[] = [],
    productReviews: Review[] = [],
    availableRatings: Rating[] = [],
  ): Promise<ProductDto> {
    const attributeValueMap = await product.resolveAttributeMapForStore(
      store.storeId,
    )
    const finalProductOptions = await Promise.all(
      productOptions.map((option) =>
        ProductOptionDto.fromEntity(option, store),
      ),
    )
    const [defaultInventoryStock] =
      await product.getCataloginventoryStockItems()

    const {
      name,
      description,
      short_description,
      specifications,
      meta_title,
      meta_description,
      meta_keyword,
      image,
      image_label,
      small_image,
      small_image_label,
      thumbnail,
      thumbnail_label,
      rotator_image,
      url_key,
      url_path,
      tax_class_id,
      price,
      special_price,
      news_from_date,
      news_to_date,
      created_at,
      updated_at,
      ...rest
    } = attributeValueMap

    const basePrice = Number(price) || 0
    const minPrice = basePrice
    const maxPrice =
      Math.max(
        ...finalProductOptions
          .flatMap((option) => option.values)
          .map((value) => value.priceIncludingBase || 0)
          .filter((value) => value > 0),
      ) || minPrice

    const minDeposit =
      Math.min(
        ...finalProductOptions
          .flatMap((option) => option.values)
          .map((value) => value.deposit || 0)
          .filter((value) => value > 0),
      ) || 0

    const maxDeposit =
      Math.max(
        ...finalProductOptions
          .flatMap((option) => option.values)
          .map((value) => value.deposit || 0)
          .filter((value) => value > 0),
      ) || 0

    return new ProductDto({
      productId: product.entityId,
      sku: product.sku,
      attributeSetId: product.attributeSetId,
      typeId: product.typeId,
      hasOptions: product.hasOptions,
      requiredOptions: product.requiredOptions,
      name: (name as string) ?? '',
      description: (description as string) ?? '',
      shortDescription: (short_description as string) ?? '',
      specifications: (specifications as string) ?? '',
      metaTitle: (meta_title as string) ?? '',
      metaDescription: (meta_description as string) ?? '',
      metaKeyword: (meta_keyword as string) ?? '',
      image: catalogHelper.formatProductImageUrl(image as string) ?? '',
      imageLabel: (image_label as string) ?? '',
      smallImage:
        catalogHelper.formatProductImageUrl(small_image as string) ?? '',
      smallImageLabel: (small_image_label as string) ?? '',
      thumbnail: catalogHelper.formatProductImageUrl(thumbnail as string) ?? '',
      thumbnailLabel: (thumbnail_label as string) ?? '',
      rotatorImage:
        catalogHelper.formatProductImageUrl(rotator_image as string) ?? '',
      urlKey: (url_key as string) ?? '',
      urlPath: (url_path as string) ?? '',
      taxClassId: (tax_class_id as number) ?? 0,
      price: Number(price) ?? 0,
      specialPrice: Number(special_price) ?? 0,
      createdAt: created_at ? new Date(created_at) : null,
      updatedAt: updated_at ? new Date(updated_at) : null,
      newsFromDate: news_from_date ? new Date(news_from_date) : null,
      newsToDate: news_to_date ? new Date(news_to_date) : null,
      additionalAttributes: {
        ...rest,
      },
      saleConfiguration: new SaleConfigurationDto({
        allowRent: rest.saletype
          ? rest.saletype.toString() === SALETYPE_OPTION.RENT.toString()
          : false,
        allowBuy: rest.saletype
          ? rest.saletype.toString() === SALETYPE_OPTION.BUY.toString()
          : false,
        basePrice: basePrice,
        minPrice: minPrice,
        maxPrice: maxPrice,
        minDeposit: minDeposit,
        maxDeposit: maxDeposit,
        options: finalProductOptions,
      }),
      variants: await Promise.all(
        productVariants.map((variant) => {
          return ProductVariantDto.fromEntity(variant, store, variantAttributes)
        }),
      ),
      variantOptions: variantAttributes.map((attr) => {
        return ProductVariantOptionDto.fromEntity(attr, store)
      }),
      galleryImages: productImages.map((image) => {
        return ProductGalleryImageDto.fromEntity(image, store, catalogHelper)
      }),
      addonLinks: await Promise.all(
        productLinks.map((link) => {
          return ProductLinkDto.fromEntity(catalogHelper, link, store)
        }),
      ),
      reviewAndRating: ProductReviewAndRatingDto.fromEntity(
        productReviews,
        availableRatings,
      ),
      inventoryStock: ProductInventoryDto.fromEntity(defaultInventoryStock),
    })
  }
}

class LinkedProductDto extends BaseDto<LinkedProductDto> {
  @ApiProperty()
  @IsNumber()
  declare productId: number

  @ApiProperty()
  @IsString()
  declare sku: string

  @ApiProperty()
  @IsString()
  declare name: string

  @ApiProperty()
  @IsString()
  declare urlKey: string

  @ApiProperty()
  @IsString()
  declare urlPath: string

  @ApiProperty()
  @IsString()
  declare image: string

  @ApiProperty()
  @IsString()
  declare imageLabel: string

  @ApiProperty()
  @IsString()
  declare smallImage: string

  @ApiProperty()
  @IsString()
  declare smallImageLabel: string

  @ApiProperty()
  @IsString()
  declare thumbnail: string

  @ApiProperty()
  @IsString()
  declare thumbnailLabel: string

  @ApiProperty()
  @IsString()
  declare rotatorImage: string

  @ApiProperty()
  @IsNumber()
  declare price: number

  @ApiProperty({ type: Object })
  @IsObject()
  declare additionalAttributes: MagentoProductAttributes

  static async fromEntity(
    catalogHelper: CatalogHelper,
    product: CatalogProductEntity,
    store: CoreStore,
  ): Promise<LinkedProductDto> {
    const attributeValueMap = await product.resolveAttributeMapForStore(
      store.storeId,
    )

    const {
      name,
      url_key,
      url_path,
      image,
      image_label,
      small_image,
      small_image_label,
      thumbnail,
      thumbnail_label,
      rotator_image,
      price,
      is_rental_monthly,
    } = attributeValueMap

    return new LinkedProductDto({
      productId: product.entityId,
      sku: product.sku,
      name: (name as string) || '',
      urlKey: (url_key as string) || '',
      urlPath: (url_path as string) || '',
      image: catalogHelper.formatProductImageUrl(image as string),
      imageLabel: (image_label as string) || '',
      smallImage: catalogHelper.formatProductImageUrl(small_image as string),
      smallImageLabel: (small_image_label as string) || '',
      thumbnail: catalogHelper.formatProductImageUrl(thumbnail as string),
      thumbnailLabel: (thumbnail_label as string) || '',
      rotatorImage: catalogHelper.formatProductImageUrl(
        rotator_image as string,
      ),
      price: Number(price) || 0,
      additionalAttributes: {
        is_rental_monthly,
      },
    })
  }
}

class ProductLinkDto extends BaseDto<ProductLinkDto> {
  @ApiProperty()
  @IsString()
  declare linkTypeCode: string

  @ApiProperty()
  @IsNumber()
  declare linkId: number

  @ApiProperty()
  @IsObject()
  declare linkedProduct: LinkedProductDto

  static async fromEntity(
    catalogHelper: CatalogHelper,
    productLink: CatalogProductLink,
    store: CoreStore,
  ): Promise<ProductLinkDto> {
    const linkedProduct = productLink.CatalogProductEntityLinked
    return new ProductLinkDto({
      linkTypeCode: productLink.CatalogProductLinkType.code,
      linkId: productLink.linkId,
      linkedProduct: await LinkedProductDto.fromEntity(
        catalogHelper,
        linkedProduct,
        store,
      ),
    })
  }
}
