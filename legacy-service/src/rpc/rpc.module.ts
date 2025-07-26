import { Global, Module } from '@nestjs/common'
import { AppConfigModule } from '@shared/config/config.module'
import { MagentoRPCService } from './rpc.service'

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [MagentoRPCService],
  exports: [MagentoRPCService],
})
export class MagentoRPCModule {}
