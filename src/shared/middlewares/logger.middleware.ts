import { Injectable, NestMiddleware, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as os from 'os'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { UtilsService } from '@libs/utils/utils.service'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly utilsService: UtilsService,
    private configService: ConfigService
  ) { }

  async use (req, res, next: Function) {
    const appname = this.configService.get('APP_NAME')
    const serverip = this.utilsService.getServerIp()
    const clientip = this.utilsService.getClientIp(req)
    const { method, headers, hostname, path, query, body, state = {} } = req
    const useragent = headers['user-agent']
    const referer = headers.referer || headers.referrer || ''
    const reqLength = req.get('content-length')
    const traceid = state.traceid || this.utilsService.uuid().replace(/-/g, '')
    const userid = state.user ? state.user.userid : 0
    const start = Date.now()

    let o = {
      logtime: new Date(),
      traceid,
      appname,
      userid,
      method,
      host: hostname,
      clientip,
      path,
      querystring: JSON.stringify(query),
      body: JSON.stringify(body),
      useragent,
      referer,
      clientbytes: reqLength,
      clienheaders: JSON.stringify(headers),
      servername: os.hostname(),
      serverip
    }

    // express morgan source code on github:
    // https://github.com/expressjs/morgan/blob/master/index.js
    // was used the registry on-finished（https://github.com/jshttp/on-finished ）to realize
    // in the project was inspired by https://github.com/julien-sarazin/nest-playground/issues/1
    res.on('close', () => {
      const { statusCode } = res
      const resLength = res.get('content-length')
      const serverheaders = JSON.stringify(res.getHeaders())
      const responsetime = Date.now() - start
      const log = { ...o, message: '@app request logs@', status: statusCode, serverheaders, serverbytes: resLength, responsetime }
      this.logger.info({ ...log })
    })
    next()
  }
}