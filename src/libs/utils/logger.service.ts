import { Injectable, Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { UtilsService } from './utils.service'

@Injectable()
export class LoggerService {

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) { }

  public access (message, meta = {}) {
    let log: any = { ...this.getAccessLogger(), message, ...meta }
    this.logger.info(log)
  }

  public info (message, meta = {}) {
    let log: any = { ...this.getAppLogger(), message }
    let keys = Object.keys(meta)
    if (keys.length) log = { ...log, meta: JSON.stringify(meta) }
    this.logger.info(log)
  }

  public warn (message, meta = {}) {
    let log: any = { ...this.getAppLogger(), message }
    let keys = Object.keys(meta)
    if (keys.length) log = { ...log, meta: JSON.stringify(meta) }
    this.logger.warn(log)
  }

  public error (message, stack = '', meta = {}) {
    let log: any = { ...this.getAppLogger(), stack, message }
    let keys = Object.keys(meta)
    if (keys.length) log = { ...log, meta: JSON.stringify(meta) }
    this.logger.error(log)
  }

  private getAccessLogger (): object {
    const req = this.request
    const { method, headers, hostname, originalUrl, query, body } = req
    const state = (req as any).state || {}
    const useragent = headers['user-agent']
    const referer = headers.referer || headers.referrer || ''
    const reqLength = req.get('content-length') || 0
    let { appname, serverip, servername, clientip, traceid, user } = state
    let userid = user ? user.userid : 0

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
      clientheaders: JSON.stringify(headers),
      servername,
      serverip
    }
  }

  private getAppLogger (): object {
    const req = this.request
    const state = (req as any).state || {}
    const { method, hostname, originalUrl, query, body } = req
    let { appname, serverip, clientip, traceid, user, servername } = state
    let userid = user ? user.userid : 0

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
      serverip,
      servername,
    }
  }
}