import { Inject, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { UtilsService } from '@libs/utils/utils.service'

/**
 * @class System Exception
 * @classdesc 默认 500 -> 服务端出错
 */
export class AppExceptionFilter extends BaseExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {
    super()
  }

  catch (exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest()
    const response = ctx.getResponse()
    const { INTERNAL_SERVER_ERROR } = HttpStatus
    const { status = INTERNAL_SERVER_ERROR } = exception
    const { method, headers, hostname, originalUrl, query, body } = req
    const state = (req as any).state || {}
    const useragent = headers['user-agent']
    let { appname, serverip, servername, clientip, traceid, user, env } = state
    let userid = user ? user.userid : 0
    let message = exception.message || 'INTERNAL SERVER ERROR'

    let log = {
      logtime: new Date(),
      traceid,
      appname,
      status,
      userid,
      method,
      useragent,
      host: hostname,
      clientip,
      path: originalUrl,
      querystring: JSON.stringify(query),
      body: JSON.stringify(body),
      serverip,
      servername,
      stack: exception.stack
    }

    if ('development' === env) {
      console.log(exception.stack)
    }
    this.logger.error(message, log)
    response.status(status).json({
      status,
      message,
      data: null,
      timestamp: new Date().toLocaleString(),
      path: originalUrl
    })
  }
}
