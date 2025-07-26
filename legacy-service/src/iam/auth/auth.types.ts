export enum AUTH_USER_TYPE {
  CUSTOMER = 'CUSTOMER',
}

export interface AuthTokenPayload {
  id: number
  type: AUTH_USER_TYPE
  email: string
  role?: string
  iat: number
  exp: number
}

export enum AUTH_OTP_PURPOSE {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
}
