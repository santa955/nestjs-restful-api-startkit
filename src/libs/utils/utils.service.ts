import { Injectable, InternalServerErrorException } from '@nestjs/common'
import * as ip from 'ip'
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UtilsService {
  constructor() { }

  /**
   * 生成随机数，含最大值，含最小值
   * @param min 最小随机值
   * @param max 最大随机值
   */
  public random (min: number = 0, max: number = 100): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  public uuid (): string {
    return uuidv4()
  }

  /**
   * 秒或毫秒数转换xx天xx小时xx秒
   * @param number 秒或毫秒数
   * @param unit 秒（s）或者毫秒（ms），默认秒
   */
  public seconds2Hour (number: number, unit: string = 'ms') {
    let d, h, m, s, date
    if (isNaN(number)) {
      throw new InternalServerErrorException('输入值必须是可数字类型')
    }
    number = parseInt(`${number}`, 10)
    if (unit === 'sec' || unit === 'seconds') {
      s = number
    } else if (unit === 'ms' || unit === 'milliseconds' || !unit) {
      s = Math.floor(number / 1000)
    } else {
      throw new InternalServerErrorException('单位必须是“ms”或“sec”')
    }

    m = Math.floor(s / 60)
    s = s % 60
    h = Math.floor(m / 60)
    m = m % 60
    // d = Math.floor(h / 24)
    h = h % 24

    // if (d < 10) d = `0${d}`
    if (h < 10) h = `0${h}`
    if (m < 10) m = `0${m}`
    if (s < 10) s = `0${s}`

    date = `${h}:${m}:${s}`

    return { days: d, hours: h, minutes: m, seconds: s, date }
  }

  /**
   * 获取服务端IP地址
   */
  public getServerIp (): string {
    return ip.address()
  }

  /**
   * 获取客户端IP地址
   */
  public getClientIp (req: Request): string | string[] {
    return req.headers['x-forwarded-for'] ||
      req.connection && req.connection.remoteAddress ||
      req.socket && req.socket.remoteAddress
  }
}