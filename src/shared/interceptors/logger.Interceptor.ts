import { Injectable, NestInterceptor, CallHandler, ExecutionContext, Inject, Logger, LoggerService } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp()
    const targetName = context.getClass().name
    const req = http.getRequest()
    const res = http.getResponse()
    const startTime = Date.now()

    let { method, headers, path, query, body, headers: { host } } = req
    let reqLog = { host, method, path, query, body, headers }

    this.logger.log({ message: 'Request', ...reqLog }, targetName)

    return next
      .handle()
      .pipe(
        tap(() => {
          return this.logger.log({
            message: 'Response',
            ...reqLog,
            statusCode: res.statusCode,
            responseTime: Date.now() - startTime
          }, targetName)
        })
      )
  }
}