import { NestFactory } from '@nestjs/core'
import * as chalk from 'chalk'
import { AppExceptionFilter } from '@shared/filters'
import { TransformInterceptor } from '@shared/interceptors'
import { AppModule } from '@modules/app.module'

const PORT = process.env.PORT || 8080

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/v1')
  app.useGlobalFilters(new AppExceptionFilter())
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
