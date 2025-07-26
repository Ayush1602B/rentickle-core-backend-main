import { Injectable } from '@nestjs/common'
import { SessionService } from './session.service'

@Injectable()
export class SessionHelper {
  constructor(private readonly sessionService: SessionService) {}

  getCartId(): number | null {
    return this.sessionService.get('cartId') || null
  }

  getOrThrowCartId(): number {
    const cartId = this.getCartId()
    if (!cartId) {
      throw new Error('Cart ID not found in session')
    }
    return cartId
  }

  setCartId(cartId: number) {
    this.sessionService.set('cartId', cartId)
  }

  clearCartId() {
    this.sessionService.delete('cartId')
  }

  getCustomerId(): number | null {
    return this.sessionService.get('customerId') || null
  }

  getOrThrowCustomerId(): number {
    const customerId = this.getCustomerId()
    if (!customerId) {
      throw new Error('Customer ID not found in session')
    }
    return customerId
  }

  setCustomerId(customerId: number) {
    this.sessionService.set('customerId', customerId)
  }

  clearCustomerId() {
    this.sessionService.delete('customerId')
  }

  getStoreId(): number | null {
    return this.sessionService.get('storeId')
  }

  getOrThrowStoreId(): number {
    const storeId = this.getStoreId()
    if (!storeId) {
      throw new Error('Store ID not found in session')
    }
    return storeId
  }

  setStoreId(storeId: number) {
    this.sessionService.set('storeId', storeId)
  }

  clearStoreId() {
    this.sessionService.delete('storeId')
  }

  // Generic utility methods
  get = this.sessionService.get
  getAll = this.sessionService.getAll
  set = this.sessionService.set
  delete = this.sessionService.delete
  clear = this.sessionService.clear
}
