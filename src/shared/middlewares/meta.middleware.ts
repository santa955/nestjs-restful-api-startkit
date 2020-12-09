import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UtilsService } from '@libs/utils/utils.service'
import * as os from 'os'

@Injectable()
export class MetaMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private readonly utilsService: UtilsService,
  ) { }

  async use (req, res, next: Function) {
    const traceid: string = req.get('x-trace-id') || this.utilsService.uuid().replace(/-/g, '')
    const servername: string = os.hostname()
    const serverip: string = this.utilsService.getServerIp()
    const clientip: string | string[] = this.utilsService.getClientIp(req)
    const env: string = this.configService.get('APP_ENV')
    const appname: string = this.configService.get('APP_NAME')
    let state: object = { traceid, env, appname, servername, serverip, clientip }
    req.state = state
    res.set('X-Trace-ID', traceid)
    next()
  }
}