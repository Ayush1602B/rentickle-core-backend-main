export enum MAGENTO_ORDER_STATE {
  NEW = 'new',
  PENDING_PAYMENT = 'pending_payment',
  PROCESSING = 'processing',
  COMPLETE = 'complete',
  CLOSED = 'closed',
  CANCELED = 'canceled',
  HOLDED = 'holded',
  PAYMENT_REVIEW = 'payment_review',
}

export enum MAGENTO_ORDER_STATUS {
  APPROVED = 'approved',
  CANCELED = 'canceled',
  CANCELLED = 'cancelled',
  COMPLETE = 'complete',
  DELIVERED = 'delivered',
  DOCUMENT_RECEIVED = 'document_received',
  HOLDED = 'holded',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  PARTIALLY_CANCELLED = 'partially_canceled',
  PARTIALLY_DELIVERED = 'partially_delivered',
  PENDING = 'pending',
  PENDING_PAYMENT = 'pending_payment',
  PROCESSED = 'processed',
  PROCESSING = 'processing',
  REFUNDED = 'refunded',
  REFUND_INITIATED = 'refund_initiated',
  REJECTED = 'rejected',
}

export enum MAGENTO_SALES_PAYMENT_TRANSACTION_TYPE {
  AUTHORIZATION = 'authorization',
  SALE = 'sale',
  VOID = 'void',
  REFUND = 'refund',
}

export enum MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PENDING = 'pending',
  CANCELED = 'canceled',
  ERROR = 'error',
}

export enum ORDER_CACHE_KEY {
  RESERVE_ORDER_ID = 'order:reserve',
}

export enum ORDER_CACHE_TTL {
  RESERVE_ORDER_ID = 60 * 60 * 12 * 1000, // 1/2 day
}

export const ORDER_CACHE_KEY_BUILDERS = {
  [ORDER_CACHE_KEY.RESERVE_ORDER_ID]: (orderId: string) =>
    `${ORDER_CACHE_KEY.RESERVE_ORDER_ID}:${orderId}`,
}
