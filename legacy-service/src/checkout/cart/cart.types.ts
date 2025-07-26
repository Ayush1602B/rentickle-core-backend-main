export enum UPDATE_IDENTIFIER {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
}

export enum CART_ITEM_OPTION_CODE {
  INFO_BUY_REQUEST = 'info_buyRequest',
  OPTION_IDS = 'option_ids',
  SIMPLE_PRODUCT = 'simple_product',
  ATTRIBUTES = 'attributes',
}

export enum CART_CHECKOUT_METHOD {
  GUEST = 'guest',
  REGISTER = 'register',
  CUSTOMER = 'customer',
}

export enum CART_CONFIG_KEY {
  ALLOW_GUEST_CHECKOUT = 'checkout/options/guest_checkout',
}
