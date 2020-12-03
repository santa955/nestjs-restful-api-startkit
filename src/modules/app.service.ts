import { Injectable, Inject, Get } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) { }

  async getHello (): Promise<string> {
    await new Promise((r, j) => {
      this.logger.info('querying delay 2s...')
      setTimeout(() => r(), 2000)
    })
    this.logger.info('Hello World')
    return 'Hello World!'
  }

  async error (): Promise<string> {
    throw new Error('error is occur')
  }
}
