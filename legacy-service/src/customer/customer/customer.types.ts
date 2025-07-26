import { CustomerAddressEntityDecimal } from './models/customer-address-entity-decimal.model'
import { CustomerAddressEntityInt } from './models/customer-address-entity-int.model'
import { CustomerAddressEntityText } from './models/customer-address-entity-text.model'
import { CustomerAddressEntityVarchar } from './models/customer-address-entity-varchar.model'

export enum MAGENTO_CUSTOMER_ATTRIBUTE_CODE {
  IS_CONFIRMED = 'confirmation',
  CREATED_AT = 'created_at',
  CREATED_IN = 'created_in',
  CREDIT_POINT = 'credit_point',
  DEFAULT_BILLING = 'default_billing',
  DEFAULT_SHIPPING = 'default_shipping',
  DISABLE_AUTO_GROUP_CHANGE = 'disable_auto_group_change',
  DOB = 'dob',
  EMAIL = 'email',
  FIRSTNAME = 'firstname',
  GENDER = 'gender',
  GROUP_ID = 'group_id',
  INCHOO_SOCIALCONNECT_FID = 'inchoo_socialconnect_fid',
  INCHOO_SOCIALCONNECT_FTOKEN = 'inchoo_socialconnect_ftoken',
  INCHOO_SOCIALCONNECT_GID = 'inchoo_socialconnect_gid',
  INCHOO_SOCIALCONNECT_GTOKEN = 'inchoo_socialconnect_gtoken',
  INCHOO_SOCIALCONNECT_TID = 'inchoo_socialconnect_tid',
  INCHOO_SOCIALCONNECT_TTOKEN = 'inchoo_socialconnect_ttoken',
  LASTNAME = 'lastname',
  MIDDLENAME = 'middlename',
  PASSWORD_HASH = 'password_hash',
  PREFIX = 'prefix',
  RP_TOKEN = 'rp_token',
  RP_TOKEN_CREATED_AT = 'rp_token_created_at',
  STORE_ID = 'store_id',
  SUFFIX = 'suffix',
  TAXVAT = 'taxvat',
  WEBSITE_ID = 'website_id',
}

export type MagentoCustomerAttributes = {
  [attribute in MAGENTO_CUSTOMER_ATTRIBUTE_CODE]?: string | null
}

export enum MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE {
  CITY = 'city',
  CITY_ID = 'city_id',
  COMPANY = 'company',
  COUNTRY_ID = 'country_id',
  FAX = 'fax',
  FIRSTNAME = 'firstname',
  LASTNAME = 'lastname',
  MIDDLENAME = 'middlename',
  POSTCODE = 'postcode',
  PREFIX = 'prefix',
  REGION = 'region',
  REGION_ID = 'region_id',
  STREET = 'street',
  SUFFIX = 'suffix',
  TELEPHONE = 'telephone',
  VAT_ID = 'vat_id',
  VAT_IS_VALID = 'vat_is_valid',
  VAT_REQUEST_DATE = 'vat_request_date',
  VAT_REQUEST_ID = 'vat_request_id',
  VAT_REQUEST_SUCCESS = 'vat_request_succes',
  ADDRESS_TYPE = 'address_type',
  LATTITUDE = 'latitude',
  LONGITUDE = 'longitude',
}

export type MagentoCustomerAddressAttributes = {
  [attribute in MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE]?: any | null
}

export type MagentoCustomerAddressAttributeValueClass =
  | CustomerAddressEntityVarchar
  | CustomerAddressEntityText
  | CustomerAddressEntityInt
  | CustomerAddressEntityDecimal
  | null

export type MagentoCustomerAddressAttributeValueType = string | number | null
