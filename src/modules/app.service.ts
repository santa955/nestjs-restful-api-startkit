import { Injectable, Logger, LoggerService, Inject } from '@nestjs/common'

@Injectable()
export class AppService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService
  ) { }

  async getHello(): Promise<string> {
    let promise = await new Promise((r, j) => {
      setTimeout(() => r(), 2000)
    })
    this.logger.log('debug info test')
    return 'Hello World!'
  }
}
