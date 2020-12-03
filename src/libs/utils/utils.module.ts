import { Module, Global } from '@nestjs/common'
import { CryptoService } from './crypto.service'
import { UtilsService } from './utils.service'

@Global()
@Module({
  providers: [CryptoService, UtilsService],
  exports: [CryptoService, UtilsService],
})
export class UtilsModule { }