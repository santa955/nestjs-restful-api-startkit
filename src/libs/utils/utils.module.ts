import { Module, Global } from '@nestjs/common'
import { CryptoService } from './crypto.service'
import { UtilsService } from './utils.service'
import { LoggerService } from './logger.service'

@Global()
@Module({
  providers: [CryptoService, UtilsService, LoggerService],
  exports: [CryptoService, UtilsService, LoggerService],
})
export class UtilsModule { }