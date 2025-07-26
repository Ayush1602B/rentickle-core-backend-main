// src/cart/guards/cart-ownership.guard.ts
import { CustomerService } from '@/customer/customer/customer.service'
import { AuthenticatedRequest } from '@/shared/api/api.types'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { CartService } from '../cart/cart.service'

@Injectable()
export class CartOwnershipGuard implements CanActivate {
  constructor(
    private readonly cartService: CartService,
    private readonly customerService: CustomerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const userId = request.auth?.decoded?.id
    const cartId = Number(request.params.cartId)

    const [cart, customer] = await Promise.all([
      this.cartService.validateAndGetById(cartId),
      this.customerService.validateAndGetCustomerById(userId),
    ])

    if (!cart.customerId) {
      // If the cart does not have a customerId, it is considered unowned.
      return true
    }

    await this.cartService.validateCartOwnership(cart, customer)
    return true
  }
}
