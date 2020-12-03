import { Inject, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

/**
 * @class System Exception
 * @classdesc 默认 500 -> 服务端出错
 */
export class AppExceptionFilter extends BaseExceptionFilter {
  private env: string
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private configService: ConfigService
  ) {
    super()
    this.env = this.configService.get('APP_ENV')
  }

  catch (exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest()
    const response = ctx.getResponse()
    const { INTERNAL_SERVER_ERROR } = HttpStatus
    const { status = INTERNAL_SERVER_ERROR } = exception
    let message = exception.message || 'INTERNAL SERVER ERROR'
    let { protocol, hostname, siteName, url } = req
    let log: object = {
      url: `${protocol}://${hostname}${url}`,
      site: siteName,
      message: 'Page Not Found'
    }

    if ('development' === this.env) {
      console.log(exception.stack)
    }
    this.logger.error(log)
    response.status(status).json({
      status,
      message,
      data: null,
      timestamp: new Date().toLocaleString(),
      path: url
    })
  }
}
