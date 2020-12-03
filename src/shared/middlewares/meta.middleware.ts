import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService
  ) { }

  async use (req, next: Function) {
    let env: string = this.configService.get('APP_ENV')
    let app: string = this.configService.get('APP_NAME')
    let state: object = { env, app }
    req.state = state
    next()
  }
}