import { CatalogCategoryEntityDatetime } from '@/catalog/category/models/catalog-category-entity-datetime.model'
import { CatalogCategoryEntityDecimal } from '@/catalog/category/models/catalog-category-entity-decimal.model'
import { CatalogCategoryEntityInt } from '@/catalog/category/models/catalog-category-entity-int.model'
import { CatalogCategoryEntityText } from '@/catalog/category/models/catalog-category-entity-text.model'
import { CatalogCategoryEntityVarchar } from '@/catalog/category/models/catalog-category-entity-varchar.model'
import { CatalogCategoryEntity } from '@/catalog/category/models/catalog-category-entity.model'
import { CatalogCategoryProduct } from '@/catalog/category/models/catalog-category-product.model'
import { CatalogProductEntityDatetime } from '@/catalog/product/models/catalog-product-entity-datetime.model'
import { CatalogProductEntityDecimal } from '@/catalog/product/models/catalog-product-entity-decimal.model'
import { CatalogProductEntityInt } from '@/catalog/product/models/catalog-product-entity-int.model'
import { CatalogProductEntityText } from '@/catalog/product/models/catalog-product-entity-text.model'
import { CatalogProductEntityVarchar } from '@/catalog/product/models/catalog-product-entity-varchar.model'
import { CatalogProductEntity } from '@/catalog/product/models/catalog-product-entity.model'
import { CatalogProductOptionPrice } from '@/catalog/product/models/catalog-product-option-price.model'
import { CatalogProductOption } from '@/catalog/product/models/catalog-product-option.model'
import { CoreStoreGroup } from '@/core/store/models/core-store-group.model'
import { CoreStore } from '@/core/store/models/core-store.model'
import { CoreWebsite } from '@/core/store/models/core-website.model'
import { CustomerAddressEntityDecimal } from '@/customer/customer/models/customer-address-entity-decimal.model'
import { CustomerAddressEntityInt } from '@/customer/customer/models/customer-address-entity-int.model'
import { CustomerAddressEntityText } from '@/customer/customer/models/customer-address-entity-text.model'
import { CustomerAddressEntityVarchar } from '@/customer/customer/models/customer-address-entity-varchar.model'
import { CustomerAddressEntity } from '@/customer/customer/models/customer-address-entity.model'
import { CustomerEntityVarchar } from '@/customer/customer/models/customer-entity-varchar.model'
import { CustomerEntity } from '@/customer/customer/models/customer-entity.model'
import { CatalogEavAttribute } from '@/eav/models/catalog-eav-attribute.model'
import { EavAttributeGroup } from '@/eav/models/eav-attribute-group.model'
import { EavAttributeOptionValue } from '@/eav/models/eav-attribute-option-value.model'
import { EavAttributeOption } from '@/eav/models/eav-attribute-option.model'
import { EavAttributeSet } from '@/eav/models/eav-attribute-set.model'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { EavEntityAttribute } from '@/eav/models/eav-entity-attribute.model'
import { EavEntityType } from '@/eav/models/eav-entity-type.model'
import { Otp } from '@/iam/otp/models/otp.model'
import { Global, Module } from '@nestjs/common'
import { AppConfigModule } from '@shared/config/config.module'
import { AppConfigService } from '@shared/config/config.service'
import { Db, MongoClient } from 'mongodb'
import { Sequelize } from 'sequelize'
import {
  CORE_DB_PROVIDER,
  MAGNETO_DB_PROVIDER,
  RMP_COLLECTION_NAME,
  RMP_DB_PROVIDER,
} from './db.types'

import { AvaCatalogProductEntityDeposit } from '@/catalog/product/models/ava-catalog-product-entity-deposit.model'
import { CatalogProductEntityMediaGalleryValue } from '@/catalog/product/models/catalog-product-entity-media-gallery-value.model'
import { CatalogProductEntityMediaGallery } from '@/catalog/product/models/catalog-product-entity-media-gallery.model'
import { CatalogProductLinkType } from '@/catalog/product/models/catalog-product-link-type.model'
import { CatalogProductLink } from '@/catalog/product/models/catalog-product-link.model'
import { CatalogProductOptionTitle } from '@/catalog/product/models/catalog-product-option-title.model'
import { CatalogProductOptionTypePrice } from '@/catalog/product/models/catalog-product-option-type-price.model'
import { CatalogProductOptionTypeTitle } from '@/catalog/product/models/catalog-product-option-type-title.model'
import { CatalogProductOptionTypeValue } from '@/catalog/product/models/catalog-product-option-type-value.model'
import { CatalogProductSuperAttribute } from '@/catalog/product/models/catalog-product-super-attritbute.model'
import { RatingEntity } from '@/catalog/review/models/rating-entity.model'
import { RatingOptionVoteAggregated } from '@/catalog/review/models/rating-option-vote-aggregated.model'
import { RatingOptionVote } from '@/catalog/review/models/rating-option-vote.model'
import { RatingOption } from '@/catalog/review/models/rating-option.model'
import { RatingStore } from '@/catalog/review/models/rating-store.model'
import { RatingTitle } from '@/catalog/review/models/rating-title.model'
import { Rating } from '@/catalog/review/models/rating.model'
import { ReviewDetail } from '@/catalog/review/models/review-detail.model'
import { ReviewEntity } from '@/catalog/review/models/review-entity.model'
import { ReviewStatus } from '@/catalog/review/models/review-status.model'
import { ReviewStore } from '@/catalog/review/models/review-store.model'
import { Review } from '@/catalog/review/models/review.model'
import { SalesFlatQuoteAddress } from '@/checkout/cart/models/sales-flat-quote-address.model'
import { SalesFlatQuoteItemOption } from '@/checkout/cart/models/sales-flat-quote-item-option.model'
import { SalesFlatQuoteItem } from '@/checkout/cart/models/sales-flat-quote-item.model'
import { SalesFlatQuotePayment } from '@/checkout/cart/models/sales-flat-quote-payment.model'
import { SalesFlatQuoteShippingRate } from '@/checkout/cart/models/sales-flat-quote-shipping-rate.model'
import { SalesFlatQuote } from '@/checkout/cart/models/sales-flat-quote.model'
import { SalesRuleCoupon } from '@/checkout/offer/models/salesrule-coupon.model'
import { SalesRule } from '@/checkout/offer/models/salesrule.model'
import { BannerEntity } from '@/core/cms/models'
import { CoreConfigData } from '@/core/config/models/core-config-data.model'
import { DirectoryCountryRegion } from '@/core/store/models/directory-country-region.model'
import { DirectoryCountry } from '@/core/store/models/directory-country.model'
import { DirectoryRegionCity } from '@/core/store/models/directory-region-city.model'
import { EavEntityStore } from '@/eav/models/eav-entity-store.model'
import { SalesFlatOrderAddress } from '@/sales/order/models/sales-flat-order-address.model'
import { SalesFlatOrderDocument } from '@/sales/order/models/sales-flat-order-document.model'
import { SalesFlatOrderGrid } from '@/sales/order/models/sales-flat-order-grid.model'
import { SalesFlatOrderItem } from '@/sales/order/models/sales-flat-order-item.model'
import { SalesFlatOrderPayment } from '@/sales/order/models/sales-flat-order-payment.model'
import { SalesFlatOrderStatusHistory } from '@/sales/order/models/sales-flat-order-status-history.model'
import { SalesFlatOrder } from '@/sales/order/models/sales-flat-order.model'
import { SalesPaymentTransaction } from '@/sales/order/models/sales-payment-transaction.model'
import { DatabaseService } from './db.service'
import { ReviewEntitySummary } from '@/catalog/review/models'
import { CataloginventoryStockItem } from '@/catalog/product/models/cataloginventory-stock-item.model'

const loadCoreModels = (sequelize: Sequelize) => {
  Otp.initialize(sequelize)
}

const associateCoreModels = () => {
  Otp.associate()
}

const loadMagentoModels = (sequelize: Sequelize) => {
  try {
    CoreStore.initialize(sequelize)
    CoreStoreGroup.initialize(sequelize)
    CoreWebsite.initialize(sequelize)

    CustomerEntity.initialize(sequelize)
    CustomerEntityVarchar.initialize(sequelize)
    CustomerAddressEntity.initialize(sequelize)
    CustomerAddressEntityVarchar.initialize(sequelize)
    CustomerAddressEntityText.initialize(sequelize)
    CustomerAddressEntityInt.initialize(sequelize)
    CustomerAddressEntityDecimal.initialize(sequelize)

    EavEntityType.initialize(sequelize)
    EavAttribute.initialize(sequelize)
    EavEntityAttribute.initialize(sequelize)
    EavAttributeGroup.initialize(sequelize)
    EavAttributeOption.initialize(sequelize)
    EavAttributeOptionValue.initialize(sequelize)
    CatalogEavAttribute.initialize(sequelize)
    EavAttributeSet.initialize(sequelize)
    EavEntityStore.initialize(sequelize)

    CatalogCategoryEntity.initialize(sequelize)
    CatalogCategoryEntityDatetime.initialize(sequelize)
    CatalogCategoryEntityDecimal.initialize(sequelize)
    CatalogCategoryEntityInt.initialize(sequelize)
    CatalogCategoryEntityText.initialize(sequelize)
    CatalogCategoryEntityVarchar.initialize(sequelize)
    CatalogCategoryProduct.initialize(sequelize)

    CoreStore.initialize(sequelize)
    CoreStoreGroup.initialize(sequelize)
    CoreWebsite.initialize(sequelize)

    CatalogProductEntity.initialize(sequelize)

    SalesFlatQuote.initialize(sequelize)
    SalesFlatQuoteAddress.initialize(sequelize)
    SalesFlatQuoteItem.initialize(sequelize)
    SalesFlatQuotePayment.initialize(sequelize)
    SalesFlatQuoteItemOption.initialize(sequelize)
    SalesFlatQuoteShippingRate.initialize(sequelize)

    SalesRule.initialize(sequelize)
    SalesRuleCoupon.initialize(sequelize)

    CatalogProductEntity.initialize(sequelize)
    CatalogProductEntityInt.initialize(sequelize)
    CatalogProductEntityVarchar.initialize(sequelize)
    CatalogProductEntityDecimal.initialize(sequelize)
    CatalogProductEntityText.initialize(sequelize)
    CatalogProductEntityDatetime.initialize(sequelize)
    CatalogProductSuperAttribute.initialize(sequelize)

    CatalogProductOption.initialize(sequelize)
    CatalogProductOptionPrice.initialize(sequelize)
    CatalogProductOptionTitle.initialize(sequelize)
    CatalogProductOptionTypeValue.initialize(sequelize)
    CatalogProductOptionTypePrice.initialize(sequelize)
    CatalogProductOptionTypeTitle.initialize(sequelize)
    AvaCatalogProductEntityDeposit.initialize(sequelize)
    CatalogProductEntityMediaGallery.initialize(sequelize)
    CatalogProductEntityMediaGalleryValue.initialize(sequelize)
    CatalogProductLink.initialize(sequelize)
    CatalogProductLinkType.initialize(sequelize)
    CataloginventoryStockItem.initialize(sequelize)

    CoreConfigData.initialize(sequelize)
    DirectoryCountry.initialize(sequelize)
    DirectoryCountryRegion.initialize(sequelize)
    DirectoryRegionCity.initialize(sequelize)

    SalesFlatOrder.initialize(sequelize)
    SalesFlatOrderAddress.initialize(sequelize)
    SalesFlatOrderItem.initialize(sequelize)
    SalesFlatOrderPayment.initialize(sequelize)
    SalesFlatOrderGrid.initialize(sequelize)
    SalesFlatOrderStatusHistory.initialize(sequelize)
    SalesFlatOrderDocument.initialize(sequelize)
    SalesPaymentTransaction.initialize(sequelize)

    RatingEntity.initialize(sequelize)
    RatingOptionVoteAggregated.initialize(sequelize)
    RatingOptionVote.initialize(sequelize)
    RatingOption.initialize(sequelize)
    RatingStore.initialize(sequelize)
    RatingTitle.initialize(sequelize)
    Rating.initialize(sequelize)

    ReviewDetail.initialize(sequelize)
    ReviewEntity.initialize(sequelize)
    ReviewEntitySummary.initialize(sequelize)
    ReviewStatus.initialize(sequelize)
    ReviewStore.initialize(sequelize)
    Review.initialize(sequelize)

    BannerEntity.initialize(sequelize)
  } catch (error) {
    throw error
  }
}

const associateMagentoModels = () => {
  try {
    CoreStore.associate()
    CoreStoreGroup.associate()
    CoreWebsite.associate()

    CustomerEntity.associate()
    CustomerEntityVarchar.associate()
    CustomerAddressEntity.associate()
    CustomerAddressEntityVarchar.associate()
    CustomerAddressEntityText.associate()
    CustomerAddressEntityInt.associate()
    CustomerAddressEntityDecimal.associate()

    EavEntityType.associate()
    EavAttribute.associate()
    EavEntityAttribute.associate()
    EavAttributeGroup.associate()
    EavAttributeOption.associate()
    EavAttributeOptionValue.associate()
    CatalogEavAttribute.associate()
    EavAttributeSet.associate()
    EavEntityStore.associate()

    CatalogCategoryEntity.associate()
    CatalogCategoryEntityDatetime.associate()
    CatalogCategoryEntityDecimal.associate()
    CatalogCategoryEntityInt.associate()
    CatalogCategoryEntityText.associate()
    CatalogCategoryEntityVarchar.associate()
    CatalogCategoryProduct.associate()

    SalesFlatQuote.associate()
    SalesFlatQuoteAddress.associate()
    SalesFlatQuoteItem.associate()
    SalesFlatQuotePayment.associate()
    SalesFlatQuoteItemOption.associate()
    SalesFlatQuoteShippingRate.associate()

    SalesRule.associate()
    SalesRuleCoupon.associate()

    CatalogProductEntity.associate()
    CatalogProductEntityInt.associate()
    CatalogProductEntityVarchar.associate()
    CatalogProductEntityDecimal.associate()
    CatalogProductEntityText.associate()
    CatalogProductEntityDatetime.associate()
    CatalogProductSuperAttribute.associate()

    CatalogProductOption.associate()
    CatalogProductOptionPrice.associate()
    CatalogProductOptionTitle.associate()
    CatalogProductOptionTypeValue.associate()
    CatalogProductOptionTypePrice.associate()
    CatalogProductOptionTypeTitle.associate()
    AvaCatalogProductEntityDeposit.associate()
    CatalogProductEntityMediaGallery.associate()
    CatalogProductEntityMediaGalleryValue.associate()
    CatalogProductLink.associate()
    CatalogProductLinkType.associate()
    CataloginventoryStockItem.associate()

    CoreConfigData.associate()
    DirectoryCountry.associate()
    DirectoryCountryRegion.associate()
    DirectoryRegionCity.associate()

    SalesFlatOrder.associate()
    SalesFlatOrderAddress.associate()
    SalesFlatOrderItem.associate()
    SalesFlatOrderPayment.associate()
    SalesFlatOrderGrid.associate()
    SalesFlatOrderStatusHistory.associate()
    SalesFlatOrderDocument.associate()
    SalesPaymentTransaction.associate()

    RatingEntity.associate()
    RatingOptionVoteAggregated.associate()
    RatingOptionVote.associate()
    RatingOption.associate()
    RatingStore.associate()
    RatingTitle.associate()
    Rating.associate()

    ReviewDetail.associate()
    ReviewEntity.associate()
    ReviewEntitySummary.associate()
    ReviewStatus.associate()
    ReviewStore.associate()
    Review.associate()

    BannerEntity.associate()
  } catch (error) {
    throw error
  }
}

const loadRmpCollections = (rmpDatabase: Db) => {
  rmpDatabase.collection(RMP_COLLECTION_NAME.ORDER)
  rmpDatabase.collection(RMP_COLLECTION_NAME.DMI)
  rmpDatabase.collection(RMP_COLLECTION_NAME.PICKUP)
  rmpDatabase.collection(RMP_COLLECTION_NAME.CUSTOMER)
  rmpDatabase.collection(RMP_COLLECTION_NAME.ECS)
  rmpDatabase.collection(RMP_COLLECTION_NAME.PRODUCT)
  rmpDatabase.collection(RMP_COLLECTION_NAME.INTERVIEW)
  rmpDatabase.collection(RMP_COLLECTION_NAME.VEHICLE)
  rmpDatabase.collection(RMP_COLLECTION_NAME.DRIVER)
  rmpDatabase.collection(RMP_COLLECTION_NAME.HELPER)
  rmpDatabase.collection(RMP_COLLECTION_NAME.LORRY)
  rmpDatabase.collection(RMP_COLLECTION_NAME.REPORT)
}

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: CORE_DB_PROVIDER,
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => {
        const databaseUri = appConfigService.getOrThrow('POSTGRES_DATABASE_URI')

        const sequelize = new Sequelize(databaseUri, {
          dialect: 'postgres',
          logging:
            appConfigService.get('POSTGRES_DATABASE_DEBUG') === true
              ? console.debug
              : false,
        })

        try {
          await sequelize.authenticate()

          loadCoreModels(sequelize)
          associateCoreModels()

          await sequelize.sync()
          console.log(
            'Connection to POSTGRES_SEQUELIZE_DB has been established successfully.',
          )
        } catch (error) {
          console.error('Unable to connect to the database:', error)
          throw error
        }
        return sequelize
      },
    },
    {
      provide: MAGNETO_DB_PROVIDER,
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => {
        const databaseUri = appConfigService.getOrThrow('MAGENTO_DATABASE_URI')

        const sequelize = new Sequelize(databaseUri, {
          dialect: 'mysql',
          logging:
            appConfigService.get('MAGENTO_DATABASE_DEBUG') === true
              ? console.debug
              : false,
        })

        try {
          await sequelize.authenticate()

          loadMagentoModels(sequelize)
          associateMagentoModels()

          console.log(
            'Connection to MAGENTO_SEQUELIZE_DB has been established successfully.',
          )
        } catch (error) {
          console.error('Unable to connect to the database:', error)
          throw error
        }
        return sequelize
      },
    },
    {
      provide: RMP_DB_PROVIDER,
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => {
        const databaseUri = appConfigService.getOrThrow('RMP_DATABASE_URI')
        const mongoClient = new MongoClient(databaseUri, {
          monitorCommands: appConfigService.get('RMP_DATABASE_DEBUG') || false,
        })

        await mongoClient.connect()
        console.log(
          `Connection to ${RMP_DB_PROVIDER} has been established successfully.`,
        )
        const databaseInstance = mongoClient.db()

        loadRmpCollections(databaseInstance)
        return databaseInstance
      },
    },
    DatabaseService,
  ],
  exports: [
    CORE_DB_PROVIDER,
    MAGNETO_DB_PROVIDER,
    RMP_DB_PROVIDER,
    DatabaseService,
  ],
})
export class DatabaseModule {
  constructor() {}
}
