import { Injectable } from '@nestjs/common'
import { LoggerService } from '@common/utils/logger.service'

@Injectable()
export class AppService {
  constructor(
    private readonly logger: LoggerService
  ) { }

  async getHello (): Promise<string> {
    await new Promise((r, j) => {
      this.logger.info('querying delay 2s...')
      setTimeout(() => r(true), 2000)
    })
    this.logger.info('Hello World')
    return 'Hello World!'
  }

  async error (): Promise<string> {
    throw new Error('error is occur')
  }
}
