import { Injectable, NestMiddleware, Inject } from '@nestjs/common'
import { LoggerService } from '@common/utils/logger.service'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
  ) { }

  async use (req, res, next: Function) {
    const start = Date.now()

    // express morgan source code on github:
    // https://github.com/expressjs/morgan/blob/master/index.js
    // was used the registry on-finished（https://github.com/jshttp/on-finished ）to realize
    // in the project was inspired by https://github.com/julien-sarazin/nest-playground/issues/1
    res.on('close', () => {
      const { statusCode } = res
      const resLength = res.get('content-length') || 0
      const serverheaders = JSON.stringify(res.getHeaders())
      const responsetime = Date.now() - start
      const log = {
        status: statusCode,
        serverheaders,
        serverbytes: resLength,
        responsetime
      }
      this.logger.access('@app request logs@', log)
    })
    next()
  }
}