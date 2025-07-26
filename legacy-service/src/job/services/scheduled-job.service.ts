import { AppLogger } from '@/shared/logging/logger.service'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { FixNobrokerOrderRentalCron } from '../crons/update-no-broker-rental-cron'

@Injectable()
export class ScheduledJobService {
  constructor(
    private logger: AppLogger,
    private readonly fixNobrokerOrderRentalCron: FixNobrokerOrderRentalCron,
  ) {}

  @Cron('*/2 * * * *', {
    name: 'test-cron',
  })
  testCron() {
    this.logger.info('test cron is running')
  }
}
