export const SESSION_PROVIDER = 'SESSION_PROVIDER'

interface BaseSession {
  customerId?: number
  formKey?: string
  csrfToken?: string
  storeId?: number
  // globally shared fields
}

interface CheckoutSession {
  cartId?: number
  cartToken?: string
  shippingMethodId?: string
  paymentMethodId?: string
  shippingAddressId?: string
  billingAddressId?: string
  reservedOrderId?: string
}

interface UserSession {
  isLoggedIn?: boolean
  loginId?: string
  isGuest?: boolean
  authToken?: string
  roles?: string[]
}

export interface AppSession extends BaseSession, CheckoutSession, UserSession {}
