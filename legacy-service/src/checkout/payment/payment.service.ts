import { Injectable } from '@nestjs/common'
import { PaymentMethodNotFoundException } from './payment.error'
import { PaymentRepo } from './payment.repo'
import { PaymentMethod } from './payment.types'

interface IPaymentService {
  getPaymentMethods: (onlyActive?: boolean) => Promise<PaymentMethod[]>
  getActivePaymentMethods: () => Promise<PaymentMethod[]>
  getPaymentMethodByCode: (code: string) => Promise<PaymentMethod | null>
}

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(private readonly paymentRepo: PaymentRepo) {}

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const allPaymentMethods = await this.paymentRepo.getAll()
    return allPaymentMethods
  }

  async getPaymentMethodByCode(code: string): Promise<PaymentMethod | null> {
    const paymentMethod = await this.paymentRepo.getByCode(code)
    return paymentMethod
  }

  async validateAndGetPaymentMethodByCode(
    code: string,
  ): Promise<PaymentMethod> {
    const paymentMethod = await this.getPaymentMethodByCode(code)
    if (!paymentMethod) {
      throw new PaymentMethodNotFoundException(
        `Payment method with code ${code} not found`,
      )
    }

    return paymentMethod
  }

  async getActivePaymentMethods(): Promise<PaymentMethod[]> {
    const allPaymentMethods = await this.paymentRepo.getAll()
    return allPaymentMethods.filter((paymentMethod) => paymentMethod.isActive)
  }
}
