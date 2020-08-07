import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Injectable, NestInterceptor, CallHandler, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => {
          return throwError(new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR))
        })
      )
  }
}