import { Injectable, NestInterceptor, CallHandler, ExecutionContext, Inject, Logger, LoggerService } from '@nestjs/common'
import { Request } from 'express'
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
    const targetName = context.getHandler().name
    const req = http.getRequest()
    const startTime = Date.now()

    let { method, headers, path, query } = req
    let { host, referrer, body } = headers

    this.logger.log({ host, method, path, referrer, query, body })

    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`After... ${Date.now() - startTime}ms`)),
      )
  }
}