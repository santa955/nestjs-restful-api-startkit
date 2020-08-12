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
    const targetName = context.getHandler().name
    const req = http.getRequest()
    const startTime = Date.now()
    this.logger.log({message:'Before...', xx: 'ccc'})
    // this.logger.log({ req })
    // this.logger.log(targetName, req.originalUrl, req.ip)
    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`After... ${Date.now() - startTime}ms`)),
      )
  }
}