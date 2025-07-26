import { PaginatedList } from '@/database/db.types'
import { CatalogCategoryEntityVarchar } from '../category/models/catalog-category-entity-varchar.model'
import { CatalogCategoryEntity } from '../category/models/catalog-category-entity.model'
import { CatalogProductEntityDatetime } from './models/catalog-product-entity-datetime.model'
import { CatalogProductEntityDecimal } from './models/catalog-product-entity-decimal.model'
import { CatalogProductEntityInt } from './models/catalog-product-entity-int.model'
import { CatalogProductEntityText } from './models/catalog-product-entity-text.model'
import { CatalogProductEntity } from './models/catalog-product-entity.model'

export enum MAGENTO_PRODUCT_ATTRIBUTE_CODE {
  BUTTON_URL = 'button_url',
  BUY_BACK_PRICE = 'buy_back_price',
  CATEGORY_IDS = 'category_ids',
  COLOR = 'color',
  COST = 'cost',
  COUNTRY_OF_MANUFACTURE = 'country_of_manufacture',
  CREATED_AT = 'created_at',
  CUSTOM_DESIGN = 'custom_design',
  CUSTOM_DESIGN_FROM = 'custom_design_from',
  CUSTOM_DESIGN_TO = 'custom_design_to',
  CUSTOM_LAYOUT_UPDATE = 'custom_layout_update',
  DAY_KM_LIMIT = 'day_km_limit',
  DAY_KM_LIMIT_BIKE = 'day_km_limit_bike',
  DAY_RENTAL_PRODUCT = 'day_rental_product',
  DELIVERY_CHARGES = 'delivery_charges',
  DESCRIPTION = 'description',
  DIMENSION = 'dimension',
  EXTRA_HELMET_CHARGES = 'extra_helmet_charges',
  EXTRA_HOUR_CHARGES = 'extra_hour_charges',
  EXTRA_KM_CHARGES = 'extra_km_charges',
  FEATURED = 'featured',
  FFD = 'ffd',
  FORT_NIGHT_DISCOUNT = 'fort_night_discount',
  GALLERY = 'gallery',
  GIFT_MESSAGE_AVAILABLE = 'gift_message_available',
  GROUP_PRICE = 'group_price',
  HAS_OPTIONS = 'has_options',
  IMAGE = 'image',
  IMAGE_LABEL = 'image_label',
  IPL_PACKAGE_BEANBAG = 'ipl_package_beanbag',
  IPL_PACKAGE_BED = 'ipl_package_bed',
  IPL_PACKAGE_COOLER = 'ipl_package_cooler',
  IPL_PACKAGE_SOFA = 'ipl_package_sofa',
  IPL_PACKAGE_TV = 'ipl_package_tv',
  IS_BIKE_PRODUCT = 'is_bike_product',
  IS_MARKETPLACE_PRODUCT = 'is_marketplace_product',
  IS_PACKAGE = 'is_package',
  IS_RECURRING = 'is_recurring',
  IS_RENTAL_MONTHLY = 'is_rental_monthly',
  LARGEDISCOUNT = 'largedicount',
  LINKS_EXIST = 'links_exist',
  LINKS_PURCHASED_SEPARATELY = 'links_purchased_separately',
  LINKS_TITLE = 'links_title',
  LINK_BUTTON = 'link_button',
  MANUFACTURER = 'manufacturer',
  MATERIAL = 'material',
  MEDIA_GALLERY = 'media_gallery',
  META_DESCRIPTION = 'meta_description',
  META_KEYWORD = 'meta_keyword',
  META_TITLE = 'meta_title',
  MINIMAL_PRICE = 'minimal_price',
  MINIMUM_BOOKING_CYCLE = 'minimum_booking_cycle',
  MIN_BOOKING_DAYS = 'min_booking_days',
  MIN_TENDURE = 'min_tendure',
  MONTHLY_DISCOUNT = 'monthly_discount',
  MSRP = 'msrp',
  MSRP_DISPLAY_ACTUAL_PRICE_TYPE = 'msrp_display_actual_price_type',
  MSRP_ENABLED = 'msrp_enabled',
  NAME = 'name',
  NEWS_FROM_DATE = 'news_from_date',
  NEWS_TO_DATE = 'news_to_date',
  OLD_ID = 'old_id',
  OPTIONS_CONTAINER = 'options_container',
  OUTSTATION_DAILY_ALLOWANCE = 'outstation_daily_allowance',
  OUTSTATION_KM_DAY_LIMIT = 'outstation_km_day_limit',
  OUTSTATION_PER_KM_CHARGES = 'outstation_per_km_charges',
  PACKAGEBED = 'packagebed',
  PACKAGEPRODUCT = 'packageproduct',
  PACKAGESIZE = 'packagesize',
  PAGE_LAYOUT = 'page_layout',
  PICKUP_CHARGES = 'pickup_charges',
  PRICE = 'price',
  PRICE_TYPE = 'price_type',
  PRICE_VIEW = 'price_view',
  RECURRING_PROFILE = 'recurring_profile',
  REDUCING_RENTALS = 'reducing_rentals',
  REFUNDABLE_DEPOSIT = 'refundable_deposit',
  RENTING_HOUR_CYCLE = 'renting_hour_cycle',
  REQUIRED_OPTIONS = 'required_options',
  ROTATOR_IMAGE = 'rotator_image',
  SAMPLES_TITLE = 'samples_title',
  SEARCHINDEX_WEIGHT = 'searchindex_weight',
  SECURITY_DEPOSIT = 'security_deposit',
  SHIPMENT_TYPE = 'shipment_type',
  SHORT_DESCRIPTION = 'short_description',
  SIZE = 'size',
  SIZEFFD = 'sizeffd',
  SIZESETFFD = 'sizesetffd',
  SKU = 'sku',
  SKU_TYPE = 'sku_type',
  SMALL_IMAGE = 'small_image',
  SMALL_IMAGE_LABEL = 'small_image_label',
  SPECIAL_FROM_DATE = 'special_from_date',
  SPECIAL_PRICE = 'special_price',
  SPECIAL_TO_DATE = 'special_to_date',
  SPECIFICATIONS = 'specifications',
  STATUS = 'status',
  TAX_CLASS_ID = 'tax_class_id',
  TENURE = 'tenure',
  THUMBNAIL = 'thumbnail',
  THUMBNAIL_LABEL = 'thumbnail_label',
  TIER_PRICE = 'tier_price',
  TIMERSHOW = 'timershow',
  TYPE = 'type',
  UPDATED_AT = 'updated_at',
  URL_KEY = 'url_key',
  URL_PATH = 'url_path',
  VENDOR_FAQ_BLOCK_ID = 'vendor_faq_block_id',
  VENDOR_TNC_BLOCK_ID = 'vendor_tnc_block_id',
  VIEW360 = 'view360',
  VISIBILITY = 'visibility',
  WEEKLY_DISCOUNT = 'weekly_discount',
  WEIGHT = 'weight',
  WEIGHT_TYPE = 'weight_type',
  STOCK_AVAILABILITY = 'stock_availability',
  QTY = 'qty',
  SPECIAL_LABEL = 'special_label',
  RENTAL_PRICE = 'rental_price',
  TAX_AMOUNT = 'tax_amount',
  DISCOUNT_PERCENTAGE = 'discount_percentage',
  RETURNABLE = 'returnable',
  DELIVERY_TIME = 'delivery_time',
  WARRANTY = 'warranty',
  ENERGY_EFFICIENCY_CLASS = 'energy_efficiency_class',
  EXPIRATION_DATE = 'expiration_date',
  SALETYPE = 'saletype',
  SALETYPE_RELATED_PRODUCT_ID = 'saletype_related_product_id',
  ENABLE_BUY_FEATURE = 'enable_buy_feature',
  FEW_LEFT = 'few_left',
  BEST_SELLER = 'best_seller',
}

export type MagentoProductAttributeValueType = string | number | Date | null
export type MagentoProductAttributeValueClass =
  | CatalogCategoryEntityVarchar
  | CatalogProductEntityInt
  | CatalogProductEntityDecimal
  | CatalogProductEntityText
  | CatalogProductEntityDatetime

export type MagentoProductAttributes = {
  [attribute in MAGENTO_PRODUCT_ATTRIBUTE_CODE]?: MagentoProductAttributeValueType
}

export enum MAGENTO_PRODUCT_TYPE_ID {
  SIMPLE = 'simple',
  CONFIGURABLE = 'configurable',
  GROUPED = 'grouped',
  BUNDLE = 'bundle',
}

export enum MAGENTO_PRODUCT_VISIBILITY {
  NOT_VISIBLE = 1,
  CATALOG = 2,
  SEARCH = 3,
  CATALOG_AND_SEARCH = 4,
}

export enum MAGENTO_PRODUCT_STATUS {
  ENABLED = 1,
  DISABLED = 2,
}

export type ProductListFilters = Record<string, any> & {
  productId?: number[]
}

export type CategoryListFilters = Record<string, any> & {
  categoryId?: number[]
  is_featured?: string | number
  is_active?: string | number
}

export type PaginatedProductList = PaginatedList<CatalogProductEntity>
export type PaginatedCategoryList = PaginatedList<CatalogCategoryEntity>

export enum SALETYPE_OPTION {
  BUY = 195,
  RENT = 196,
}

export enum PRODUCT_STOCK_STATUS {
  IN_STOCK = 1,
  OUT_OF_STOCK = 0,
}

export enum PRODUCT_BUY_FEATURE_STATUS {
  ENABLED = 1,
  DISABLED = 0,
}

export enum PRODUCT_CACHE_TTL {
  GET_PRODUCT_INFO = 60 * 60 * 12 * 1000, // 1/2 day
}
