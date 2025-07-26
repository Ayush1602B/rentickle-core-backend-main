import { CatalogHelper } from '@/catalog/catalog.helper'
import { CatalogProductOptionTypeValue } from '@/catalog/product/models/catalog-product-option-type-value.model'
import { CoreStore } from '@/core/store/models/core-store.model'
import { ADDRESS_TYPE } from '@/rmp/rmp.types'
import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'
import { SalesFlatQuoteAddress } from '../../models/sales-flat-quote-address.model'
import { SalesFlatQuoteItem } from '../../models/sales-flat-quote-item.model'
import { SalesFlatQuoteShippingRate } from '../../models/sales-flat-quote-shipping-rate.model'
import { SalesFlatQuote } from '../../models/sales-flat-quote.model'

export class CartTotalItemDto extends BaseDto<CartTotalItemDto> {
  @ApiProperty()
  @IsString()
  declare title: string

  @ApiProperty()
  @IsNumber()
  declare amount: number

  static fromEntity(total: CartTotalItemDto): CartTotalItemDto {
    return new CartTotalItemDto({
      title: total.title,
      amount: Number(total.amount),
    })
  }
}

class CartItemSelectedOptionDto extends BaseDto<CartItemSelectedOptionDto> {
  @ApiProperty()
  @IsNumber()
  declare optionId: number

  @ApiProperty()
  @IsString()
  declare optionTitle: string

  @ApiProperty()
  @IsNumber()
  declare optionValueId: number

  @ApiProperty()
  @IsString()
  declare optionValueTitle: string

  static fromEntity(optionType: CatalogProductOptionTypeValue) {
    return new CartItemSelectedOptionDto({
      optionId: optionType.CatalogProductOption.optionId,
      optionTitle:
        optionType.CatalogProductOption.CatalogProductOptionTitles[0].title,
      optionValueId: optionType.optionTypeId,
      optionValueTitle: optionType.CatalogProductOptionTypeTitles[0].title,
    })
  }
}

export class CartItemDto extends BaseDto<CartItemDto> {
  @ApiProperty()
  @IsNumber()
  declare itemId: number

  @ApiProperty()
  @IsNumber()
  declare quoteId: number

  @ApiProperty()
  @IsString()
  declare createdAt: Date

  @ApiProperty()
  @IsString()
  declare updatedAt: Date

  @ApiProperty({ type: Number })
  @IsNumber()
  declare productId: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare storeId: number | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare parentItemId: number | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare isVirtual: number | null

  @ApiProperty({ type: String })
  @IsString()
  declare sku: string

  @ApiProperty({ type: String })
  @IsString()
  declare name: string

  @ApiProperty({ type: String })
  @IsString()
  declare description: string | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare noDiscount: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare weight: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare qty: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare price: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare customPrice: number | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare discountPercent: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare discountAmount: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare taxAmount: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare taxPercent: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare rowTotal: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare rowTotalWithDiscount: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare rowWeight: number

  @ApiProperty({ type: Number })
  @IsNumber()
  declare productType: string | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare taxBeforeDiscount: number | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare originalCustomPrice: number | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare priceInclTax: number | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare rowTotalInclTax: number | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare refundableDeposit: number

  @ApiProperty({ type: String })
  @IsString()
  declare rentalStartDatetime: Date | null

  @ApiProperty({ type: String })
  @IsString()
  declare rentalEndDatetime: Date | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare rentalType: string | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare depositDiscount: number | null

  @ApiProperty({ type: Number })
  @IsNumber()
  declare depositDiscountPercent: number | null

  @ApiProperty({ type: Object })
  @IsObject()
  declare selectedOptionsMap: Record<string, string | any>

  @ApiProperty({ type: () => CartItemSelectedOptionDto, isArray: true })
  @IsObject()
  declare selectedOptions: CartItemSelectedOptionDto[]

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
  declare isRentalMonthly: number

  static async fromEntity(
    catalogHelper: CatalogHelper,
    item: SalesFlatQuoteItem,
    store: CoreStore,
  ): Promise<CartItemDto> {
    const product = await item.getCatalogProductEntity()

    const [itemOptions, attributeValueMap] = await Promise.all([
      item.getSelectedProductOptions(),
      product.resolveAttributeMapForStore(store.storeId),
    ])

    const {
      image,
      image_label,
      small_image,
      small_image_label,
      thumbnail,
      thumbnail_label,
      rotator_image,
      is_rental_monthly,
    } = attributeValueMap

    return new CartItemDto({
      itemId: Number(item.itemId),
      productId: Number(item.productId),
      sku: item.sku!,
      name: item.name!,
      qty: Number(item.qty),
      price: Number(item.price),
      rowTotal: Number(item.rowTotal),
      taxAmount: Number(item.taxAmount),
      taxPercent: Number(item.taxPercent),
      discountAmount: Number(item.discountAmount),
      discountPercent: Number(item.discountPercent),
      noDiscount: Number(item.noDiscount),
      refundableDeposit: Number(item.refundableDeposit),
      selectedOptionsMap: JSON.parse(await item.serializeProductOptions()),
      selectedOptions: itemOptions.map((option) =>
        CartItemSelectedOptionDto.fromEntity(option),
      ),
      image: catalogHelper.formatProductImageUrl(image as string) ?? '',
      imageLabel: (image_label as string) ?? '',
      smallImage:
        catalogHelper.formatProductImageUrl(small_image as string) ?? '',
      smallImageLabel: (small_image_label as string) ?? '',
      thumbnail: catalogHelper.formatProductImageUrl(thumbnail as string) ?? '',
      thumbnailLabel: (thumbnail_label as string) ?? '',
      rotatorImage:
        catalogHelper.formatProductImageUrl(rotator_image as string) ?? '',
      isRentalMonthly: Number(is_rental_monthly),
    })
  }
}

export class CartAddressDto extends BaseDto<CartAddressDto> {
  @ApiProperty()
  @IsNumber()
  declare addressId: number

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  declare customerAddressId: number | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare addressType: ADDRESS_TYPE | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare prefix: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare firstname: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare middlename: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare lastname: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare suffix: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare company: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare street: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare city: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare cityId: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare region: string | null

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  declare regionId: number | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare postcode: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare countryId: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare telephone: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare vatId: string | null

  static fromEntity(address: SalesFlatQuoteAddress): Promise<CartAddressDto> {
    return Promise.resolve(
      new CartAddressDto({
        addressId: address.addressId,
        addressType: address.addressType,
        firstname: address.firstname,
        lastname: address.lastname,
        street: address.street,
        city: address.city,
        cityId: address.cityId,
        region: address.region,
        regionId: address.regionId,
        postcode: address.postcode,
        countryId: address.countryId,
        telephone: address.telephone,
      }),
    )
  }
}

export class CartShippingRateDto extends BaseDto<CartShippingRateDto> {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare carrier: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare carrierTitle: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare code: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare method: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare methodDescription: string | null

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  declare price: number

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare errorMessage: string | null

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  declare methodTitle: string | null

  static fromEntity(
    shippingRate: SalesFlatQuoteShippingRate,
  ): CartShippingRateDto {
    return new CartShippingRateDto({
      carrier: shippingRate.carrier,
      carrierTitle: shippingRate.carrierTitle,
      code: shippingRate.code,
      method: shippingRate.method,
      methodDescription: shippingRate.methodDescription,
      price: Number(shippingRate.price),
      errorMessage: shippingRate.errorMessage,
      methodTitle: shippingRate.methodTitle,
    })
  }
}

export class CartDto extends BaseDto<CartDto> {
  @ApiProperty()
  @IsNumber()
  declare cartId: number

  @ApiProperty()
  @IsNumber()
  declare storeId: number

  @ApiProperty()
  @IsString()
  declare createdAt: Date

  @ApiProperty()
  @IsString()
  declare updatedAt: Date

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  declare convertedAt: Date | null

  @ApiProperty()
  @IsBoolean()
  declare isActive: boolean

  @ApiProperty()
  @IsBoolean()
  declare isVirtual: boolean

  @ApiProperty()
  @IsNumber()
  declare itemsCount: number

  @ApiProperty()
  @IsNumber()
  declare itemsQty: number

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  declare checkoutMethod: string | null

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  declare customerId: number | null

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  declare customerTaxClassId: number | null

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  declare couponCode: string | null

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  declare customerGroupId: number | null

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  declare customerIsGuest: boolean

  @ApiProperty()
  @IsBoolean()
  declare isChanged: boolean

  @ApiProperty()
  @IsBoolean()
  declare isPersistent: boolean

  @ApiProperty({
    type: CartTotalItemDto,
    isArray: true,
  })
  @IsObject()
  declare totals: CartTotalItemDto[]

  @ApiProperty({
    type: CartItemDto,
    isArray: true,
  })
  @IsArray({ each: true })
  declare items: CartItemDto[]

  @ApiProperty({
    type: CartAddressDto,
    isArray: true,
  })
  @IsArray({ each: true })
  declare addresses: CartAddressDto[]

  @ApiProperty({
    type: CartShippingRateDto,
  })
  @IsOptional()
  @IsObject()
  declare shipping: CartShippingRateDto | null

  static async fromEntity(
    catalogHelper: CatalogHelper,
    cart: SalesFlatQuote,
    items: SalesFlatQuoteItem[] = [],
    addresses: SalesFlatQuoteAddress[] = [],
    shippingRate: SalesFlatQuoteShippingRate | null = null,
    totals: CartTotalItemDto[] = [],
  ): Promise<CartDto> {
    const store = await cart.getCoreStore()

    return new CartDto({
      cartId: Number(cart.entityId),
      storeId: Number(cart.storeId),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      convertedAt: cart.convertedAt,
      isActive: Number(cart.isActive) === 1,
      isVirtual: Number(cart.isVirtual) === 1,
      itemsCount: Number(cart.itemsCount),
      itemsQty: Number(cart.itemsQty),
      checkoutMethod: cart.checkoutMethod,
      customerId: Number(cart.customerId),
      customerTaxClassId: Number(cart.customerTaxClassId),
      couponCode: cart.couponCode,
      customerGroupId: cart.customerGroupId,
      customerIsGuest: cart.customerIsGuest === 1,
      isChanged: Number(cart.isChanged) === 1,
      isPersistent: Number(cart.isPersistent) === 1,
      items: await Promise.all(
        items.map((item) => CartItemDto.fromEntity(catalogHelper, item, store)),
      ),
      addresses: await Promise.all(addresses.map(CartAddressDto.fromEntity)),
      shipping: shippingRate
        ? CartShippingRateDto.fromEntity(shippingRate)
        : null,
      totals: totals.map((total) => CartTotalItemDto.fromEntity(total)),
    })
  }
}

export class CartItemSelectedOptionsDto extends BaseDto<CartItemSelectedOptionsDto> {
  [key: string]: string
}
