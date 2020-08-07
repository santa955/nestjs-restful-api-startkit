import { NestFactory } from '@nestjs/core'
import * as chalk from 'chalk'
import { AppModule } from '@modules/app.module'
import { AppExceptionFilter } from '@shared/filters'
import { LoggerInterceptor, TransformInterceptor, ErrorInterceptor } from '@shared/interceptors'

const PORT = process.env.PORT || 8080

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/v1')
  app.useGlobalFilters(new AppExceptionFilter())
  app.useGlobalInterceptors(
    new LoggerInterceptor(),
    new TransformInterceptor(),
    new ErrorInterceptor()
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
