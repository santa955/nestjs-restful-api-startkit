import { Injectable, NestMiddleware, Inject, Logger, LoggerService } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService
  ) { }

  async use(req: Request, res: Response, next: Function) {
    let startTime = Date.now()
    // console.log(req.originalUrl ,req.url, req.ip)
    this.logger.log('request')
    await next()
    let endTime = Date.now()
    this.logger.log(`end ${endTime - startTime}`)
  }
}