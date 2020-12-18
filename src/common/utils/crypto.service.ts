import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'

@Injectable()
export class CryptoService {
  private readonly SECRET_KEY: string = '#pass@pp%&*'
  private readonly IV_KEY: Buffer = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8')
  private readonly key: string
  private readonly iv: string
  constructor() {
    this.key = crypto.createHash('sha256').update(this.SECRET_KEY).digest('base64').substr(0, 32)
    this.iv = crypto.createHash('sha256').update(String(this.IV_KEY)).digest('base64').substr(0, 16)
  }

  /**
   * 对称加密字符串
   * @param value 需要加密的字符串
   * @returns string 加密后的字符串
   */
  public encrypt (value: string): string {
    let cipher = crypto.createCipheriv('aes-256-ctr', this.key, this.iv)
    let crypted = cipher.update(value, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  }

  /**
   * 解密字符串
   * @param encrypted 需要解密的字符串
   */
  public decrypt (encrypted: string): string {
    let decipher = crypto.createDecipheriv('aes-256-ctr', this.key, this.iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}