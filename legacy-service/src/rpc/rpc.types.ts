import { BaseDto } from '@/shared/api/api.types'

export enum MAGENTO_RPC_METHOD {
  CATALOG_CATEGORY_TREE = 'catalog_category.tree',
  CATALOG_CATEGORY_INFO = 'catalog_category.info',
  CATALOG_PRODUCT_LIST = 'catalog_product.list',
  CART_COUPON_ADD = 'cart_coupon.add',
  CART_COUPON_REMOVE = 'cart_coupon.remove',
  CART_TOTALS = 'cart.totals',
  CART_SET_CUSTOMER = 'cart_customer.set',
  CUSTOMER_ADDRESS_UPDATE = 'customer_address.update',
  CUSTOMER_ADDRESS_CREATE = 'customer_address.create',
}

export class MagentoSearchResultDto extends BaseDto<MagentoSearchResultDto> {
  declare query: string
  declare items: {
    id: number
  }[]
  declare count: number
  declare success: boolean
}
