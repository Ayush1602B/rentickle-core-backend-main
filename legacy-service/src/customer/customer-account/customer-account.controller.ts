import { AuthGuard } from '@/iam/auth/auth.guard'
import { AuthenticatedRequest } from '@/shared/api/api.types'
import { Body, Controller, Put, Request, UseGuards } from '@nestjs/common'
import { CustomerAccountApiService } from './api/customer-account.api'
import {
  UpsertCustomerAddressInputDto,
  UpsertCustomerAddressOutputDto,
} from './api/dto/upsert-customer-address.dto'

@Controller('account')
export class CustomerAccountController {
  constructor(
    private readonly customerAccountApiService: CustomerAccountApiService,
  ) {}

  @UseGuards(AuthGuard)
  @Put('addresses')
  async upsertCustomerAddress(
    @Request() req: AuthenticatedRequest,
    @Body() addressDto: UpsertCustomerAddressInputDto,
  ): Promise<UpsertCustomerAddressOutputDto> {
    const customerId = req.auth.decoded.id
    const res = await this.customerAccountApiService.upsertCustomerAddress(
      customerId,
      addressDto,
    )

    return res
  }
}
