import { Body, Controller, Post } from '@nestjs/common'
import { UpdateCustomerAddressCronDto } from './crons/dto/update-customer-address.dto'
import { FixNobrokerOrderRentalInputDto } from './crons/dto/update-no-broker.dto'
import { UpdateCustomerAddressCron } from './crons/update-customer-address.cron'
import { FixNobrokerOrderRentalCron } from './crons/update-no-broker-rental-cron'
@Controller('/job')
export class JobController {
  constructor(
    private readonly updateCustomerAddressCron: UpdateCustomerAddressCron,
    private readonly fixNobrokerOrderRental: FixNobrokerOrderRentalCron,
  ) {}

  @Post('/update-customer-address')
  updateCustomerAddress(@Body() body: UpdateCustomerAddressCronDto) {
    return this.updateCustomerAddressCron.run(body)
  }

  @Post('/update-rmp-details')
  async fixNobrokerOrderRentalCronApi(
    @Body() body: FixNobrokerOrderRentalInputDto,
  ) {
    await this.fixNobrokerOrderRental.run(body) // pass the path
  }
}
