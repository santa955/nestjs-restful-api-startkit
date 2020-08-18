import { Module, Logger, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { resolve, join } from 'path'
import * as winston from 'winston'
import { WinstonModule } from '@app/libs/winston'
import { AppExceptionFilter } from '@shared/filters'
import { LoggerInterceptor } from '@app/shared/interceptors'
import { isObject } from '@utility/index'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DetailModule } from '@modules/detail/detail.module'

// root is dist dir in project
const ROOT = resolve(__dirname, '../')
const LOGGER_PATH = resolve(ROOT, '../logs')

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [ROOT + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
          winston.format.printf((param) => {
            let { app, level, message, timestamp, context } = param
            let params = message as any
            if (isObject(params)) {
              return JSON.stringify({ app, context, level, ...params, timestamp })
            }
            return JSON.stringify(param)
          })
        ),
        defaultMeta: { app: configService.get('APP_NAME') },
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({
            filename: join(LOGGER_PATH, '/error.log'),
            level: 'error',
          }),
          new winston.transports.File({ level: 'info', filename: join(LOGGER_PATH, '/access.log') }),
        ],
      })
    }),
    DetailModule
  ],
  controllers: [
    AppController,
  ],
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