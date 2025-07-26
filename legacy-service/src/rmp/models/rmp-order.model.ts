import { Document } from 'mongodb'
import {
  ADDRESS_TYPE,
  AddressInfo,
  BankInfo,
  RMPEmbeddedUser,
  RMPRecordComment,
  RMPRecordDocument,
  RMPStatusLog,
} from '../rmp.types'

export enum ORDER_PAYMENT_MODE {
  ECS = 'ecs',
  ADVANCE_PAYMENT = 'advancePayment',
  CHEQUE = 'cheque',
}

export enum CANCELLATION_REASON {
  ORDER_PLACED_BY_MISTAKE = 'Order Placed by Mistake',
}

export enum ORDER_ITEM_TYPE {
  SIMPLE = 'simple',
  PACKAGE = 'package',
}

export enum ORDER_ITEM_STATUS {
  ORDERED = 'ordered',
  INVOICED = 'invoiced',
  CANCELLED = 'cancelled',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  PARTIALLY_DELIVERED = 'partiallyDelivered',
  PICKED = 'picked',
  REFUNDED = 'refunded',
  RETURNED = 'returned',
  UPGRADED = 'upgraded',
  DOWNGRADED = 'downgraded',
  REPLACEMENT_REQUESTED = 'replacementRequested',
}

export enum DISCOUNT_TYPE {
  RECURRING = 'recurring',
  NON_RECURRING = 'nonRecurring',
  FIXED = 'fixed',
  TO_DEPOSIT = 'toDeposit',
}

export enum TENURE_TYPE {
  HOURLY = 'hour',
  DAILY = 'day',
  WEEKLY = 'week',
  FORT_NIGHTLY = 'fortNight',
  MONTHLY = 'month',
}

export enum BANK_ACCOUNT_TYPE {
  SALARY = 'salary',
  SAVING = 'saving',
  CURRENT = 'current',
}

export class OrderItemProductRental {
  declare duration: number
  declare rent: number
  declare deposit: number
}

class OrderItemReplacementProduct {
  declare name: string
  declare id: number
  declare replaceSku: string
  declare rentalDifference: number
  declare reviseRental: 'yes' | 'no'
}

class OrderItemProduct {
  declare name: string
  declare id: number
  declare sku: string
  declare rentals: string
  declare categoryPath?: string | undefined
}

class OrderItemRental {
  declare notional: number
  declare running: number
  declare discount: number
  declare discountType: DISCOUNT_TYPE
  declare deposit: number
  declare runningDeposit: number
  declare notionalDeposit: number
  declare depositDiscount: number
  declare tenure: number
  declare tenureType: TENURE_TYPE
  declare tenureSubType: 'limited' | 'unlimited'
  declare startDate: string
  declare endDate: string
  declare extensionMonth: number
  declare gstAmount: number
}

class OrderItemMetaInfo {
  declare barcode: string
  declare damageAmount: number
  declare damageRemarks: string
  declare deliveryDate: string
  declare pickupDate: string
}

class OrderItemPackageItem {
  declare name: string
  declare sku: string
  declare productId: number
  declare barcode: string
  declare status: ORDER_ITEM_STATUS
  declare deliveryDate: string
  declare rentals: string
}

class OrderMaster {
  declare orderId: string
  declare customerName: string
  declare phone: string
  declare customerEmail: string
  declare orderDate: string
  declare runningRent: number
  declare modeOfPayment: ORDER_PAYMENT_MODE
  declare deliveryDate: string
  declare customerId: number
  declare remarks: string
  declare gstAmount: number
  declare cancellationReason: CANCELLATION_REASON
}

export class OrderItem extends Document {
  declare name: string
  declare type: ORDER_ITEM_TYPE
  declare status: ORDER_ITEM_STATUS
  declare replacementProduct?: OrderItemReplacementProduct
  declare product: OrderItemProduct
  declare rental: OrderItemRental
  declare metaInfo: OrderItemMetaInfo
  declare packageItems: OrderItemPackageItem[]
  declare itemId: number
  declare childProductId: number
}

export class OrderAddress extends Document {
  declare addressId: number
  declare addressType: ADDRESS_TYPE
  declare customerName: string
  declare phone: string
  declare email: string
  declare companyName: string
  declare addressInfo: AddressInfo
}

class OrderRentalInfo extends Document {
  declare total: {
    firstTimePaid: number
    notional: number
    discount: number
    running: number
    deposit: number
    paid: number
    due: number
    gstAmount: number
  }
  declare runningTotal: {
    rent: number
    deposit: number
    discount: number
    totalRefund: number
    due: number
  }
  declare couponCode: string
  declare discountType: DISCOUNT_TYPE
  declare nextPaymentDate: string
  declare lastPaymentDate: string
  declare couponInfo: {
    code: string
    description: string
    discountType: DISCOUNT_TYPE
    amount: number
  }
}

class OrderAgreement extends Document {
  declare agreementType: 'primary' | 'annexure'
  declare isActive: 'yes' | 'no'
  declare signedOnDate: string
  declare agreementFile: string
  declare scannedAgreement: string
  declare verification: string
  declare appliedRental: {
    itemId: number
    itemName: string
    rental: string
  }[]
  declare shipmentId: string
  declare approvalDate: string
  declare plannedDeliveryDate: string
  declare outForDeliveryDate: string
  declare deliveryPersonName: string
  declare deliveryPersonPhone: string
}

class OrderBankDetails extends Document {
  declare accountHolderName: string
  declare accountNumber: string
  declare ifsc: string
  declare accountType: BANK_ACCOUNT_TYPE
  declare bankInfo: BankInfo
  declare advanceInfo: {
    tenure: number
    amount: number
    paymentLink: string
    type: 'full' | 'partial'
  }
}

class OrderShipment extends Document {
  declare vehicleNumber: string
  declare transporterName: string
  declare driverName: string
  declare driverNumber: string
  declare isActive: 'yes' | 'no'
  declare lorryId: string
  declare helpers: {
    helperName: string
    helperNumber: string
  }[]
  declare shipmentDate: string
  declare shipmentItems: string
}

class OrderDetails {
  0: OrderMaster[]
  1: OrderItem[]
  2: OrderAddress[]
  3: OrderRentalInfo[]
  4: OrderAgreement[]
  5: OrderBankDetails[]
  6: OrderShipment[]
}

export class OrderDocument extends RMPRecordDocument<OrderDetails> {
  declare _id: string
  declare state: string
  declare status: string
  declare user: RMPEmbeddedUser
  declare details: OrderDetails
  declare store: string
  declare comments: [RMPRecordComment]
  declare createdAt?: any
  declare updatedAt?: any
  declare statusLog: [RMPStatusLog]
}
