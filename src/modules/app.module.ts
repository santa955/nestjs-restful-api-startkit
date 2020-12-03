import { Module, Logger, NestModule, MiddlewareConsumer, Scope } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { resolve } from 'path'
import * as winston from 'winston'
import { WinstonModule } from 'nest-winston'
import { AppExceptionFilter } from '@shared/filters'
import { LoggerInterceptor } from '@shared/interceptors'
import { LoggerMiddleware } from '@shared/middlewares'
import * as WinstonDailyRotateFile from 'winston-daily-rotate-file'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UtilsModule } from '@libs/utils/utils.module'

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
      useFactory: (configService: ConfigService) => {
        const env = configService.get('APP_ENV')
        const app = configService.get('APP_NAME')
        const dir = env === 'production' ? `/var/log/${app}` : LOGGER_PATH
        const options = {
          dirname: dir,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d'
        }
        let transports: Array<any> = [
          new WinstonDailyRotateFile({
            ...options,
            filename: `${app}-access-%DATE%.log`,
            level: 'info'
          }),
          new WinstonDailyRotateFile({
            ...options,
            filename: `${app}-error-%DATE%.log`,
            level: 'error'
          })
        ]
        if ('development' === env) {
          transports.push(new winston.transports.Console())
        }

        return {
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
            winston.format.printf((param) => {
              let { timestamp, level, message, ...meta } = param
              return JSON.stringify({ level, message, ...meta, timestamp })
            })
          ),
          defaultMeta: { appname: app },
          transports,
        }
      }
    }),
    UtilsModule,
    DetailModule
  ],
  controllers: [
    AppController,
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggerInterceptor,
    // },
    //nestjs Scope.REQUEST service inject  exception filter
    //TODO: https://github.com/nestjs/nest/issues/2130
    //https://github.com/nestjs/nest/issues/1987
    // https://github.com/nestjs/nest/issues/1916
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: AppExceptionFilter,
    },
    Logger,
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}