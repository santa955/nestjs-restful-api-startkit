import { NestFactory } from '@nestjs/core'
import * as path from 'path'
import * as winston from 'winston'
import * as chalk from 'chalk'
import { WinstonModule } from '@libs/winston'
import { TransformInterceptor } from '@shared/interceptors'
import { AppModule } from '@modules/app.module'

const PORT = process.env.PORT || 8080
const APP_NAME = process.env.APP_NAME || 'NESTJS_APP'
const ROOT = path.resolve(__dirname, '../')
const LOGGER_PATH = path.resolve(ROOT, './logs')

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'info',
      // format: winston.format.json(),
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.printf((param) => {
          // console.log(param)
          let { app, level, message, timestamp } = param
          return `${timestamp} [${app}] ${level}: ${message}`
        })
      ),
      defaultMeta: { app: APP_NAME },
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(LOGGER_PATH, '/error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(LOGGER_PATH, '/access.log') }),
      ],
    })
  })
  app.setGlobalPrefix('/v1')
  app.useGlobalInterceptors(
    new TransformInterceptor()
  )
  await app.listen(PORT)
}
bootstrap()
  .then(_ => {
    console.log(chalk.green(`[Server] Server running: http://0.0.0.0:${PORT}`))
  })
  .catch(err => {
    console.log(chalk.red(`[Server] 💥 ${err}`))
  })
