import { Module, Logger, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppExceptionFilter } from '@shared/filters'
import { LoggerInterceptor } from '@app/shared/interceptors'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    Logger,
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}