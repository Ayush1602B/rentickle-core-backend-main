export enum MAGENTO_ENTITY_TYPE_CODE {
  CUSTOMER = 'customer',
  CUSTOMER_ADDRESS = 'customer_address',
  CATALOG_CATEGORY = 'catalog_category',
  CATALOG_PRODUCT = 'catalog_product',
  ORDER = 'order',
  INVOICE = 'invoice',
  CREDIT_MEMO = 'creditmemo',
  SHIPMENT = 'shipment',
}

export enum MAGENTO_ENTITY_TYPE_ID {
  CUSTOMER = 1,
  CUSTOMER_ADDRESS = 2,
  CATALOG_CATEGORY = 3,
  CATALOG_PRODUCT = 4,
  ORDER = 5,
  INVOICE = 6,
  CREDIT_MEMO = 7,
  SHIPMENT = 8,
}

export enum MAGENTO_ATTRIBUTE_BACKEND_TYPE {
  DATETIME = 'datetime',
  DECIMAL = 'decimal',
  INT = 'int',
  STATIC = 'static',
  TEXT = 'text',
  VARCHAR = 'varchar',
}
