import { Injectable, NestInterceptor, CallHandler, ExecutionContext, Inject } from '@nestjs/common'
import { Observable } from 'rxjs'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) { }

  intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp()
    const req = http.getRequest()
    const res = http.getResponse()
    const startTime = Date.now()
    let { method, headers, path, query, body, headers: { host } } = req
    let log: object = {
      method: method.toLocaleUpperCase(),
      url: `${host}${path}`,
      body,
      query,
      headers,
      message: 'Request'
    }
    this.logger.info(log)

    return next
      .handle()
      .pipe(
        tap(() => {
          this.logger.info({
            ...log,
            message: 'Response',
            statusCode: res.statusCode,
            responseTime: Date.now() - startTime
          })
        })
      )
  }
}