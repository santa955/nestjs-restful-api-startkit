import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common'

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = exception.message || 'INTERNAL SERVER ERROR'

    console.error(exception.stack)
    if (exception instanceof HttpException) {
      status = exception.getStatus()
    }

    response.status(status).json({
      status,
      message,
      data: null,
      timestamp: new Date().toLocaleString(),
      path: request.url
    })
  }
}
