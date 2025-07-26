import { Injectable } from '@nestjs/common'
import { Op } from 'sequelize'
import { OfferDto } from './dto/offer-common.dto'
import { GetOfferListDto } from './dto/offer-service.dto'
import { SalesRuleCoupon } from './models/salesrule-coupon.model'
import { SalesRule } from './models/salesrule.model'
import { COUPON_TYPE } from './offer.types'
import { SalesRuleRepo } from './repo/salesrule.repo'

interface IOfferService {
  getOffers(dto: GetOfferListDto): Promise<any>
}

@Injectable()
export class OfferService implements IOfferService {
  constructor(private readonly salesRuleRepo: SalesRuleRepo) {}

  async getOffers({
    sorts,
    pagination: { page, limit },
  }: GetOfferListDto): Promise<any> {
    const now = new Date()

    // Fetch sales rules with coupons
    const { rows: salesRules, count: total } =
      await this.salesRuleRepo.findAllAndCount({
        where: {
          isActive: true,
          fromDate: { [Op.lte]: now },
          toDate: { [Op.gte]: now },
          couponType: COUPON_TYPE.SPECIFIC_COUPON,
          useAutoGeneration: false,
        },
        include: [
          {
            model: SalesRuleCoupon,
            order: [['expirationDate', 'ASC']],
          },
        ],
        limit,
        offset: (page - 1) * limit,
        order: Object.entries(sorts),
      })

    // Convert to DTO
    const offers = await Promise.all(salesRules.map(this.toOfferDto))
    return {
      list: offers.flat(),
      limit,
      page,
      total,
      hasMore: total > page * limit,
    }
  }

  private async toOfferDto(rule: SalesRule): Promise<OfferDto[]> {
    const coupons = await rule.getSalesRuleCoupons()

    return coupons.map((coupon) => {
      return new OfferDto({
        couponId: coupon.couponId,
        ruleId: rule.ruleId,
        name: rule.name,
        description: rule.description || null,
        fromDate: rule.fromDate,
        toDate: rule.toDate,
        isActive: rule.isActive,
        sortOrder: rule.sortOrder,
        discountAmount: Number(rule.discountAmount),
        timesUsed: rule.timesUsed,
        couponType: rule.couponType,
        couponCode: coupon.code,
        expirationDate: coupon.expirationDate,
      })
    })
  }
}
