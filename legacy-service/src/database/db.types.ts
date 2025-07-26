import {
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes,
  ModelStatic,
  Sequelize,
  Transaction,
  UpdateOptions,
} from 'sequelize'

export enum CORE_TABLE_NAME {
  OTP = 'otps',
}

export enum CORE_MODEL_NAME {
  OTP = 'Otp',
}

export enum MONGO_MODEL_NAME {
  USER = 'UserModel',
  STATUS_LOG = 'StatusLogModel',
  ORDER = 'OrderModel',
  COMMENT = 'CommentModel',
}

export enum MAGENTO_TABLE_NAME {
  CUSTOMER_ENTITY = 'customer_entity',
  CUSTOMER_ENTITY_VARCHAR = 'customer_entity_varchar',
  CUSTOMER_ADDRESS_ENTITY = 'customer_address_entity',
  CUSTOMER_ADDRESS_ENTITY_VARCHAR = 'customer_address_entity_varchar',
  CUSTOMER_ADDRESS_ENTITY_INT = 'customer_address_entity_int',
  CUSTOMER_ADDRESS_ENTITY_TEXT = 'customer_address_entity_text',
  CUSTOMER_ADDRESS_ENTITY_DECIMAL = 'customer_address_entity_decimal',

  EAV_ENTITY_TYPE = 'eav_entity_type',
  EAV_ATTRIBUTE = 'eav_attribute',
  EAV_ATTRIBUTE_GROUP = 'eav_attribute_group',
  EAV_ENTITY_ATTRIBUTE = 'eav_entity_attribute',
  EAV_ATTRIBUTE_SET = 'eav_attribute_set',
  EAV_ATTRIBUTE_OPTION = 'eav_attribute_option',
  EAV_ATTRIBUTE_OPTION_VALUE = 'eav_attribute_option_value',
  EAV_ENTITY_STORE = 'eav_entity_store',

  CATALOG_EAV_ATTRIBUTE = 'catalog_eav_attribute',

  CATALOG_CATEGORY_ENTITY = 'catalog_category_entity',
  CATALOG_CATEGORY_ENTITY_VARCHAR = 'catalog_category_entity_varchar',
  CATALOG_CATEGORY_ENTITY_DECIMAL = 'catalog_category_entity_decimal',
  CATALOG_CATEGORY_ENTITY_DATETIME = 'catalog_category_entity_datetime',
  CATALOG_CATEGORY_ENTITY_TEXT = 'catalog_category_entity_text',
  CATALOG_CATEGORY_ENTITY_INT = 'catalog_category_entity_int',
  CATALOG_CATEGORY_PRODUCT = 'catalog_category_product',
  CATALOG_PRODUCT_LINK = 'catalog_product_link',
  CATALOG_PRODUCT_LINK_TYPE = 'catalog_product_link_type',

  CATALOG_PRODUCT_ENTITY = 'catalog_product_entity',

  CORE_STORE = 'core_store',
  CORE_STORE_GROUP = 'core_store_group',
  CORE_WEBSITE = 'core_website',
  SALES_FLAT_QUOTE = 'sales_flat_quote',
  SALES_FLAT_QUOTE_ADDRESS = 'sales_flat_quote_address',
  SALES_FLAT_QUOTE_ITEM = 'sales_flat_quote_item',
  SALES_FLAT_QUOTE_PAYMENT = 'sales_flat_quote_payment',
  SALES_FLAT_QUOTE_ITEM_OPTION = 'sales_flat_quote_item_option',
  SALES_FLAT_QUOTE_SHIPPING_RATE = 'sales_flat_quote_shipping_rate',

  SALESRULE = 'salesrule',
  SALESRULE_COUPON = 'salesrule_coupon',

  CATALOG_PRODUCT_ENTITY_VARCHAR = 'catalog_product_entity_varchar',
  CATALOG_PRODUCT_ENTITY_INT = 'catalog_product_entity_int',
  CATALOG_PRODUCT_ENTITY_TEXT = 'catalog_product_entity_text',
  CATALOG_PRODUCT_ENTITY_DECIMAL = 'catalog_product_entity_decimal',
  CATALOG_PRODUCT_ENTITY_DATETIME = 'catalog_product_entity_datetime',
  CATALOG_PRODUCT_OPTION = 'catalog_product_option',
  CATALOG_PRODUCT_OPTION_PRICE = 'catalog_product_option_price',
  CATALOG_PRODUCT_SUPER_ATTRIBUTE = 'catalog_product_super_attribute',
  CATALOG_PRODUCT_OPTION_TITLE = 'catalog_product_option_title',
  CATALOG_PRODUCT_OPTION_TYPE_PRICE = 'catalog_product_option_type_price',
  CATALOG_PRODUCT_OPTION_TYPE_TITLE = 'catalog_product_option_type_title',
  CATALOG_PRODUCT_OPTION_TYPE_VALUE = 'catalog_product_option_type_value',
  AVA_CATALOG_PRODUCT_ENTITY_DEPOSIT = 'ava_catalog_product_entity_deposit',
  CATALOG_PRODUCT_ENTITY_MEDIA_GALLERY = 'catalog_product_entity_media_gallery',
  CATALOG_PRODUCT_ENTITY_MEDIA_GALLERY_VALUE = 'catalog_product_entity_media_gallery_value',
  CATALOGINVENTORY_STOCK_ITEM = 'cataloginventory_stock_item',

  CORE_CONFIG_DATA = 'core_config_data',
  DIRECTORY_COUNTRY = 'directory_country',
  DIRECTORY_COUNTRY_REGION = 'directory_country_region',
  DIRECTORY_REGION_CITY = 'directory_region_city',

  SALES_FLAT_ORDER = 'sales_flat_order',
  SALES_FLAT_ORDER_ADDRESS = 'sales_flat_order_address',
  SALES_FLAT_ORDER_ITEM = 'sales_flat_order_item',
  SALES_FLAT_ORDER_PAYMENT = 'sales_flat_order_payment',
  SALES_FLAT_ORDER_STATUS_HISTORY = 'sales_flat_order_status_history',
  SALES_FLAT_ORDER_GRID = 'sales_flat_order_grid',
  SALES_FLAT_ORDER_DOCUMENT = 'sales_flat_order_document',
  SALES_PAYMENT_TRANSACTION = 'sales_payment_transaction',

  RATING_ENTITY = 'rating_entity',
  RATING_OPTION_VOTE_AGGREGATED = 'rating_option_vote_aggregated',
  RATING_OPTION_VOTE = 'rating_option_vote',
  RATING_OPTION = 'rating_option',
  RATING_STORE = 'rating_store',
  RATING_TITLE = 'rating_title',
  RATING = 'rating',

  REVIEW_DETAIL = 'review_detail',
  REVIEW_ENTITY = 'review_entity',
  REVIEW_ENTITY_SUMMARY = 'review_entity_summary',
  REVIEW_STATUS = 'review_status',
  REVIEW_STORE = 'review_store',
  REVIEW = 'review',

  BANNER_ENTITY = 'banner7',
}

export enum MAGENTO_MODEL_NAME {
  CUSTOMER_ENTITY = 'CustomerEntity',
  CUSTOMER_ENTITY_VARCHAR = 'CustomerEntityVarchar',
  CUSTOMER_ADDRESS_ENTITY = 'CustomerAddressEntity',
  CUSTOMER_ADDRESS_ENTITY_VARCHAR = 'CustomerAddressEntityVarchar',
  CUSTOMER_ADDRESS_ENTITY_INT = 'CustomerAddressEntityInt',
  CUSTOMER_ADDRESS_ENTITY_TEXT = 'CustomerAddressEntityText',
  CUSTOMER_ADDRESS_ENTITY_DECIMAL = 'CustomerAddressEntityDecimal',

  EAV_ENTITY_TYPE = 'EavEntityType',
  EAV_ATTRIBUTE = 'EavAttribute',
  EAV_ATTRIBUTE_GROUP = 'EavAttributeGroup',
  EAV_ENTITY_ATTRIBUTE = 'EavEntityAttribute',
  EAV_ATTRIBUTE_SET = 'EavAttributeSet',
  EAV_ATTRIBUTE_OPTION = 'EavAttributeOption',
  EAV_ATTRIBUTE_OPTION_VALUE = 'EavAttributeOptionValue',
  EAV_ENTITY_STORE = 'EavEntityStore',

  CATALOG_EAV_ATTRIBUTE = 'CatalogEavAttribute',

  CATALOG_CATEGORY_ENTITY = 'CatalogCategoryEntity',
  CATALOG_CATEGORY_ENTITY_VARCHAR = 'CatalogCategoryEntityVarchar',
  CATALOG_CATEGORY_ENTITY_DECIMAL = 'CatalogCategoryEntityDecimal',
  CATALOG_CATEGORY_ENTITY_DATETIME = 'CatalogCategoryEntityDatetime',
  CATALOG_CATEGORY_ENTITY_TEXT = 'CatalogCategoryEntityText',
  CATALOG_CATEGORY_ENTITY_INT = 'CatalogCategoryEntityInt',
  CATALOG_CATEGORY_PRODUCT = 'CatalogCategoryProduct',
  CATALOG_PRODUCT_LINK = 'CatalogProductLink',
  CATALOG_PRODUCT_LINK_TYPE = 'CatalogProductLinkType',

  CATALOG_PRODUCT_ENTITY = 'CatalogProductEntity',

  CORE_STORE = 'CoreStore',
  CORE_STORE_GROUP = 'CoreStoreGroup',
  CORE_WEBSITE = 'CoreWebsite',
  SALES_FLAT_QUOTE = 'SalesFlatQuote',
  SALES_FLAT_QUOTE_ADDRESS = 'SalesFlatQuoteAddress',
  SALES_FLAT_QUOTE_ITEM = 'SalesFlatQuoteItem',
  SALES_FLAT_QUOTE_PAYMENT = 'SalesFlatQuotePayment',
  SALES_FLAT_QUOTE_ITEM_OPTION = 'SalesFlatQuoteItemOption',
  SALES_FLAT_QUOTE_SHIPPING_RATE = 'SalesFlatQuoteShippingRate',

  SALESRULE = 'SalesRule',
  SALESRULE_COUPON = 'SalesRuleCoupon',

  CATALOG_PRODUCT_ENTITY_VARCHAR = 'CatalogProductEntityVarchar',
  CATALOG_PRODUCT_ENTITY_INT = 'CatalogProductEntityInt',
  CATALOG_PRODUCT_ENTITY_TEXT = 'CatalogProductEntityText',
  CATALOG_PRODUCT_ENTITY_DECIMAL = 'CatalogProductEntityDecimal',
  CATALOG_PRODUCT_ENTITY_DATETIME = 'CatalogProductEntityDatetime',
  CATALOG_PRODUCT_OPTION = 'CatalogProductOption',
  CATALOG_PRODUCT_OPTION_PRICE = 'CatalogProductOptionPrice',
  CATALOG_PRODUCT_SUPER_ATTRIBUTE = 'CatalogProductSuperAttribute',
  CATALOG_PRODUCT_OPTION_TITLE = 'CatalogProductOptionTitle',
  CATALOG_PRODUCT_OPTION_TYPE_PRICE = 'CatalogProductOptionTypePrice',
  CATALOG_PRODUCT_OPTION_TYPE_TITLE = 'CatalogProductOptionTypeTitle',
  CATALOG_PRODUCT_OPTION_TYPE_VALUE = 'CatalogProductOptionTypeValue',
  AVA_CATALOG_PRODUCT_ENTITY_DEPOSIT = 'AvaCatalogProductEntityDeposit',
  CATALOG_PRODUCT_ENTITY_MEDIA_GALLERY = 'CatalogProductEntityMediaGallery',
  CATALOG_PRODUCT_ENTITY_MEDIA_GALLERY_VALUE = 'CatalogProductEntityMediaGalleryValue',
  CATALOGINVENTORY_STOCK_ITEM = 'CataloginventoryStockItem',

  CORE_CONFIG_DATA = 'CoreConfigData',
  DIRECTORY_COUNTRY = 'DirectoryCountry',
  DIRECTORY_COUNTRY_REGION = 'DirectoryCountryRegion',
  DIRECTORY_REGION_CITY = 'DirectoryRegionCity',

  SALES_FLAT_ORDER = 'SalesFlatOrder',
  SALES_FLAT_ORDER_ADDRESS = 'SalesFlatOrderAddress',
  SALES_FLAT_ORDER_ITEM = 'SalesFlatOrderItem',
  SALES_FLAT_ORDER_PAYMENT = 'SalesFlatOrderPayment',
  SALES_FLAT_ORDER_STATUS_HISTORY = 'SalesFlatOrderStatusHistory',
  SALES_FLAT_ORDER_GRID = 'SalesFlatOrderGrid',
  SALES_FLAT_ORDER_DOCUMENT = 'SalesFlatOrderDocument',
  SALES_PAYMENT_TRANSACTION = 'SalesPaymentTransaction',

  RATING_ENTITY = 'RatingEntity',
  RATING_OPTION_VOTE_AGGREGATED = 'RatingOptionVoteAggregated',
  RATING_OPTION_VOTE = 'RatingOptionVote',
  RATING_OPTION = 'RatingOption',
  RATING_STORE = 'RatingStore',
  RATING_TITLE = 'RatingTitle',
  RATING = 'Rating',

  REVIEW_DETAIL = 'ReviewDetail',
  REVIEW_ENTITY = 'ReviewEntity',
  REVIEW_ENTITY_SUMMARY = 'ReviewEntitySummary',
  REVIEW_STATUS = 'ReviewStatus',
  REVIEW_STORE = 'ReviewStore',
  REVIEW = 'Review',

  BANNER_ENTITY = 'BannerEntity',
}

export enum RMP_COLLECTION_NAME {
  ORDER = '5juhp2i3jw309xqi9',
  DMI = '5juhp2i3jw30a4w02',
  PICKUP = 'g1i5cwk304u30l6',
  CUSTOMER = '5juhp2i3jw30a1cl6',
  ECS = 'g1iagvk05sxw3b8',
  PRODUCT = '5juhp2i3jw30aa5l8',
  INTERVIEW = 'g1ib5qjwlwyvnk0',
  VEHICLE = '16fknhtp1gmqkfdo173f7',
  DRIVER = '16fknhtp1gmqkfdo2gtd8',
  HELPER = '16fknhtp1gmqkfdo3nd41',
  LORRY = '16fknhtp1gmqkfdo0kkh6',
  REPORT = '16fknhtp1gmqkfdoby0e5',
}

export const CORE_DB_PROVIDER = 'CORE_POSTGRES_DB_PROVIDER'
export const MAGNETO_DB_PROVIDER = 'MAGENTO_SEQUELIZE_DB'
export const RMP_DB_PROVIDER = 'RMP_DB_PROVIDER'

export enum MAX_CHAR_COLUMN_LENGTH {
  CHAR_2 = 2,
  CHAR_3 = 3,
  CHAR_4 = 4,
  CHAR_32 = 32,
  CHAR_50 = 50,
  CHAR_100 = 100,
  CHAR_255 = 255,
}

export const DEFAULT_STORE_ID = 1
export const DEFAULT_STORE_VIEW_ID = 0
export const MAGENTO_ADMIN_STORE_ID = 0

export class BaseSequelizeRepo<T extends Model> {
  protected model: ModelStatic<T>
  protected sequelize: Sequelize

  constructor(sequelize: Sequelize, model: ModelStatic<T>) {
    this.sequelize = sequelize
    this.model = model
  }

  startTransaction<T = any>(autoCallback: (t: Transaction) => PromiseLike<T>) {
    return this.sequelize.transaction<T>(autoCallback)
  }

  create(data: CreationAttributes<T>, opts?: CreateOptions<T>) {
    return this.model.create(data, opts)
  }

  findAll(opts?: FindOptions<T>) {
    return this.model.findAll(opts)
  }

  findOne(opts?: FindOptions<T>) {
    return this.model.findOne(opts)
  }

  findOneByPk(id: string, opts?: FindOptions<T>) {
    return this.model.findByPk(id, opts)
  }

  updateMany(data: ModelAttributes<T>, opts: UpdateOptions<T>) {
    return this.model.update(data, opts)
  }

  delete(opts: DestroyOptions<T>) {
    return this.model.destroy(opts)
  }

  findAllAndCount(opts?: FindOptions<T>) {
    return this.model.findAndCountAll(opts)
  }
}

export class BaseSequilizeModel<T extends Model> extends Model<
  InferAttributes<T>,
  InferCreationAttributes<T>
> {}

export type PaginatedList<T> = {
  list: T[]
  length: number
  page: number
  limit: number
  hasMore: boolean
  total?: number
}
