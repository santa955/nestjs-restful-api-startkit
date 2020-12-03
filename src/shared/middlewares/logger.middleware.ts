import { Injectable, NestMiddleware, Inject } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { LoggerService } from '@libs/utils/logger.service'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly loggerService: LoggerService,
  ) { }

  async use (req, res, next: Function) {
    const start = Date.now()

    // express morgan source code on github:
    // https://github.com/expressjs/morgan/blob/master/index.js
    // was used the registry on-finished（https://github.com/jshttp/on-finished ）to realize
    // in the project was inspired by https://github.com/julien-sarazin/nest-playground/issues/1
    res.on('close', () => {
      const common = this.loggerService.getAccessLogger()
      const { statusCode } = res
      const resLength = res.get('content-length')
      const serverheaders = JSON.stringify(res.getHeaders())
      const responsetime = Date.now() - start
      const log = {
        ...common,
        message: '@app request logs@',
        status: statusCode,
        serverheaders,
        serverbytes: resLength,
        responsetime
      }
      this.logger.info({ ...log })
    })
    next()
  }
}