import { Observable } from 'rxjs'
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp()
    const targetName = context.getHandler().name
    const req = http.getRequest()
    console.log(targetName, req.originalUrl, req.ip)
    return next.handle()
  }
}