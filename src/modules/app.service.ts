import { Injectable, Logger, LoggerService, Inject } from '@nestjs/common'

@Injectable()
export class AppService {
  constructor(
    @Inject(Logger)
    private readonly logger: Logger
  ) {
    logger.setContext(AppService.name)
  }

  async getHello(): Promise<string> {
    await new Promise((r, j) => {
      this.logger.log('querying delay 2s...')
      setTimeout(() => r(), 2000)
    })
    this.logger.log('Hello World')
    return 'Hello World!'
  }

  async error(): Promise<string> {
    throw new Error('error is occur')
    return 'Hello World!'
  }
}
