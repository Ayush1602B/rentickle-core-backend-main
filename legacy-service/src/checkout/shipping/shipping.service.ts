import { Injectable } from '@nestjs/common'
import { ShippingRepo } from './shipping.repo'
import { ShippingMethod } from './shipping.types'
import { ShippingMethodNotFoundException } from './shipping.error'

interface IShippingService {
  getShippingMethods: (onlyActive?: boolean) => Promise<ShippingMethod[]>
  getActiveShippingMethods: () => Promise<ShippingMethod[]>
  getShippingMethodByCode: (code: string) => Promise<ShippingMethod | null>
  validateAndGetShippingMethodByCode: (code: string) => Promise<ShippingMethod>
}

@Injectable()
export class ShippingService implements IShippingService {
  constructor(private readonly shippingRepo: ShippingRepo) {}

  async getShippingMethods(): Promise<ShippingMethod[]> {
    const allShippingMethods = await this.shippingRepo.getAll()
    return allShippingMethods
  }

  getShippingMethodByCode(code: string): Promise<ShippingMethod | null> {
    return this.shippingRepo.getByCode(code)
  }

  async getActiveShippingMethods(): Promise<ShippingMethod[]> {
    const allShippingMethods = await this.shippingRepo.getAll()

    return allShippingMethods.filter(
      (shippingMethod) => shippingMethod.isActive,
    )
  }

  async validateAndGetShippingMethodByCode(
    code: string,
  ): Promise<ShippingMethod> {
    const shippingMethod = await this.getShippingMethodByCode(code)
    if (!shippingMethod) {
      throw new ShippingMethodNotFoundException(
        `Shipping method with code ${code} not found`,
      )
    }

    return shippingMethod
  }
}
