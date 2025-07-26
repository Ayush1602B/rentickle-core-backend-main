import { OrderItemProductRental } from '@/rmp/models/rmp-order.model'
import { RmpOrderRepo } from '@/rmp/repo/rmp-order.repo'
import { AppConfigService } from '@/shared/config/config.service'
import { AppLogger } from '@/shared/logging/logger.service'
import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as XLSX from 'xlsx'
import { BaseCron } from '../job.types'
import {
  FixNobrokerOrderRentalInputDto,
  OrderRowInfo,
} from './dto/update-no-broker.dto'
// ===========IMPORTANT==================
// Sheet name must match and validate all columns are present.
// For ORDER LEVEL SHEET NAME = 'Order'
// FOR ITEM LEVEL SHEET NAME ='Item'
// ======================================
@Injectable()
export class FixNobrokerOrderRentalCron implements BaseCron {
  private orderSheetData: OrderRowInfo[] = []
  private itemSheetData: Record<string, string | number>[] = []

  constructor(
    private readonly rmpOrderRepo: RmpOrderRepo,
    private readonly logger: AppLogger,
    private readonly appConfigService: AppConfigService,
  ) {}

  async run(
    payload: FixNobrokerOrderRentalInputDto = {
      filePath: `${this.appConfigService.getAppRoot()}/data/rmp-order-rental-update.xlsx`,
    },
  ): Promise<void> {
    const fileBuffer = fs.readFileSync(payload.filePath)
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' })

    const itemSheet = workbook.Sheets.Item
    const orderSheet = workbook.Sheets.Order

    this.itemSheetData = XLSX.utils.sheet_to_json(itemSheet)
    this.orderSheetData = XLSX.utils.sheet_to_json(orderSheet)
    await this._processOrders()
  }
  private async _processOrders() {
    for (const orderRow of this.orderSheetData) {
      await this._updateRmpDetails(orderRow as OrderRowInfo)
    }
  }

  private async _updateRmpDetails(orderRow: OrderRowInfo) {
    const orderId = orderRow['Order ID']?.toString()?.trim()
    const orderInRmp = await this.rmpOrderRepo.findOne({
      'details.0.0.orderId': orderId,
    })
    if (!orderInRmp) {
      this.logger.debug(`order ID "${orderId}" not found`)
      return
    }
    this.logger.info(`Processing order ID "${orderId}"`)
    const orderItemsInSheet = this.itemSheetData.filter(
      (row) => row['Order ID']?.toString()?.trim() === orderId,
    )
    const orderItems = orderInRmp.details[1]
    if (!Array.isArray(orderItems)) {
      this.logger.warn(`Invalid order items structure in order ${orderId}`)
      return
    }

    for (const orderItem of orderItemsInSheet) {
      const sku = orderItem.SKU?.toString()?.trim()
      const itemNotional = Number(orderItem['Notional Rent (without GST)'])
      const itemRunningRent = Number(orderItem['Running Rent'])
      const itemGst = Number(orderItem['GST Amount'])
      let targetItem = orderItems.find((i) => i.product.sku.trim() === sku)
      if (!targetItem) {
        this.logger.debug(
          `Item with SKU "${sku}" not found in order "${orderId}"`,
        )
        continue
      }
      let rentals: OrderItemProductRental[] = JSON.parse(
        targetItem.product.rentals,
      )
      rentals = this._updateRentSlabs(rentals, orderItem)
      targetItem = {
        ...targetItem,
        product: {
          ...targetItem.product,
          rentals: JSON.stringify(rentals),
        },
        rental: {
          ...targetItem.rental,
          running: itemRunningRent,
          notional: itemNotional,
          gstAmount: itemGst,
          discount: itemNotional, // Assuming discount is same as notional for now
        },
      }
      orderItems[orderItems.findIndex((i) => i.product.sku.trim() === sku)] =
        targetItem // reflect items to in memory copy
    }
    // order level
    const totalRunning = Number(orderRow['Total Running Rent'])
    const totalGst = Number(orderRow['Total GST Amount'])
    const totalNotional = Number(orderRow['Total Notional Rent (without GST)'])

    const orderMaster = orderInRmp.details[0][0]
    const orderRentalInfo = orderInRmp.details[3][0]

    orderMaster.runningRent = totalRunning
    orderMaster.gstAmount = totalGst
    orderRentalInfo.total = {
      ...orderRentalInfo.total,
      notional: totalNotional,
      running: totalRunning,
      gstAmount: totalGst,
      firstTimePaid: 0,
      discount: totalNotional,
    }

    orderRentalInfo.runningTotal = {
      ...orderRentalInfo.runningTotal,
      rent: totalRunning,
      discount: totalNotional,
    }
    try {
      await this.rmpOrderRepo.findOneAndUpdate(
        {
          _id: orderInRmp._id,
        },
        {
          $set: { details: orderInRmp.details },
        },
      )
    } catch (error) {
      this.logger.error('Failed to update', error)
    }

    this.logger.info(`Order ID "${orderId}" updated successfully.`)
  }

  private _updateRentSlabs(
    slabs: OrderItemProductRental[],
    row: Record<string, string | number>,
  ): OrderItemProductRental[] {
    const rentMap = {
      '3-5': Number(row['3 - 5 months  Notional Rent (without GST)']),
      '6-11': Number(row['6 - 11 months Notional Rent (without GST)']),
      '12-23': Number(row['12 - 23 months Notional Rent (without GST)']),
      '24-35': Number(row['24 - 35  months Notional Rent (without GST)']),
      '36': Number(row['36 months Notional Rent (without GST)']),
    }

    return slabs.map((slab) => {
      const dur = slab.duration

      if (dur >= 3 && dur <= 5) {
        slab.rent = rentMap['3-5']
      } else if (dur >= 6 && dur <= 11) {
        slab.rent = rentMap['6-11']
      } else if (dur >= 12 && dur <= 23) {
        slab.rent = rentMap['12-23']
      } else if (dur >= 24 && dur <= 35) {
        slab.rent = rentMap['24-35']
      } else if (dur === 36) {
        slab.rent = rentMap['36']
      }
      return slab
    })
  }
}
