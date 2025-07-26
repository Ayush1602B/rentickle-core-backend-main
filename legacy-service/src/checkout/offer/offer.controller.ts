import { BaseRequest } from '@/shared/api/api.types'
import { Controller, Get, Request } from '@nestjs/common'
import { OfferService } from './offer.service'

@Controller('offers')
export class OfferController {
  constructor(private readonly offersService: OfferService) {}

  @Get('')
  async getOffers(@Request() req: BaseRequest): Promise<any> {
    const offers = await this.offersService.getOffers({ ...req.parsedQuery })
    return offers
  }
}
