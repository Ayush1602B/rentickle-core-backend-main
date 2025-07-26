export enum MAGENTO_CATEGORY_ATTRIBUTE_CODE {
  ALL_CHILDREN = 'all_children',
  AVAILABLE_SORT_BY = 'available_sort_by',
  CATLIST = 'catlist',
  CATLIST_THUMBNAIL = 'catlist_thumbnail',
  CATTHUMB = 'catthumb',
  CHILDREN = 'children',
  CHILDREN_COUNT = 'children_count',
  CUSTOM_APPLY_TO_PRODUCTS = 'custom_apply_to_products',
  CUSTOM_DESIGN = 'custom_design',
  CUSTOM_DESIGN_FROM = 'custom_design_from',
  CUSTOM_DESIGN_TO = 'custom_design_to',
  CUSTOM_LAYOUT_UPDATE = 'custom_layout_update',
  CUSTOM_USE_PARENT_SETTINGS = 'custom_use_parent_settings',
  DEFAULT_SORT_BY = 'default_sort_by',
  DISPLAY_MODE = 'display_mode',
  DESCRIPTION = 'description',
  FILTER_PRICE_RANGE = 'filter_price_range',
  IMAGE = 'image',
  INCLUDE_IN_MENU = 'include_in_menu',
  IS_ACTIVE = 'is_active',
  IS_ANCHOR = 'is_anchor',
  LANDING_PAGE = 'landing_page',
  LEVEL = 'level',
  META_DESCRIPTION = 'meta_description',
  META_KEYWORDS = 'meta_keywords',
  META_TITLE = 'meta_title',
  NAME = 'name',
  NAME_TO_DISPLAY = 'name_to_display',
  PAGE_LAYOUT = 'page_layout',
  PATH = 'path',
  PATH_IN_STORE = 'path_in_store',
  POSITION = 'position',
  SEARCHINDEX_WEIGHT = 'searchindex_weight',
  SEO_TEXT_CONTENT = 'seo_text_content',
  SEO_TEXT_HEADER = 'seo_text_header',
  THUMBNAIL = 'thumbnail',
  URL_KEY = 'url_key',
  URL_PATH = 'url_path',
  IS_FEATURED = 'is_featured',
}

export type MagentoCategorySystemAttributes = {
  [key in MAGENTO_CATEGORY_ATTRIBUTE_CODE]?: any | null
}

export type MagentoCategoryCustomAttributes = {
  [key: string]: any | null
}

export type MagentoCategoryAttributes = MagentoCategorySystemAttributes &
  MagentoCategoryCustomAttributes

export type MagentoCategoryAttributeValueType = string | number | Date | null

export enum MAGENTO_CATEGORY_STATUS {
  ACTIVE = 1,
  INACTIVE = 2,
}
