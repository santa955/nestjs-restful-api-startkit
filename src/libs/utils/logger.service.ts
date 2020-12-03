import { Injectable, Inject, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import * as os from 'os'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { UtilsService } from './utils.service'

@Injectable({ scope: Scope.REQUEST })
export class LoggerService {
  private appname: string
  private serverip: string
  private clientip: string | string[]
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly utilsService: UtilsService,
    private configService: ConfigService
  ) {
    this.appname = this.configService.get('APP_NAME')
    this.serverip = this.utilsService.getServerIp()
    this.clientip = this.utilsService.getClientIp(this.request)
  }

  public info (message, meta = {}) {
    let log: any = { ...this.getAppLogger(), message }
    let keys = Object.keys(meta)
    if (keys.length) log = { ...log, detail: JSON.stringify(meta) }
    this.logger.info(log)
  }

  public warn (message, meta = {}) {
    let log: any = { ...this.getAppLogger(), message }
    let keys = Object.keys(meta)
    if (keys.length) log = { ...log, detail: JSON.stringify(meta) }
    this.logger.warn({ log })
  }

  public error (message, stack = '', meta = {}) {
    let common = this.getAppLogger()
    let log: any = { ...common, stack, message }
    let keys = Object.keys(meta)
    if (keys.length) log = { ...log, detail: JSON.stringify(meta) }
    this.logger.error(log)
  }

  public getAccessLogger (): object {
    const req = this.request
    const appname = this.appname
    const serverip = this.serverip
    const clientip = this.clientip
    const { method, headers, hostname, originalUrl, query, body } = req
    const state = (req as any).state || {}
    const useragent = headers['user-agent']
    const referer = headers.referer || headers.referrer || ''
    const reqLength = req.get('content-length')
    const traceid = state.traceid || this.utilsService.uuid().replace(/-/g, '')
    const userid = state.user ? state.user.userid : 0

    return {
      logtime: new Date(),
      traceid,
      appname,
      userid,
      method,
      host: hostname,
      clientip,
      path: originalUrl,
      querystring: JSON.stringify(query),
      body: JSON.stringify(body),
      useragent,
      referer,
      clientbytes: reqLength,
      clienheaders: JSON.stringify(headers),
      servername: os.hostname(),
      serverip
    }
  }

  private getAppLogger (): object {
    const req = this.request
    const serverip = this.serverip
    const state = (req as any).state || {}
    const traceid = state.traceid || this.utilsService.uuid().replace(/-/g, '')
    const userid = state.user ? state.user.userid : 0
    const { method, hostname, originalUrl, query, body } = req
    return {
      logtime: new Date(),
      traceid,
      appname: this.appname,
      userid,
      method,
      host: hostname,
      path: originalUrl,
      querystring: JSON.stringify(query),
      body: JSON.stringify(body),
      serverip,
      servername: os.hostname(),
    }
  }
}