import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import * as chalk from 'chalk'
import { WINSTON_MODULE_NEST_PROVIDER } from '@libs/winston'
import { TransformInterceptor } from '@shared/interceptors'
import { AppModule } from '@modules/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const port = configService.get('PORT', 3000)
  const prefix = configService.get('API_VERSION', '')

  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  app.setGlobalPrefix(`/${prefix}`)
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(port)
  return port
}

bootstrap()
  .then(port => {
    console.log(chalk.green(`[Server] Server running: http://0.0.0.0:${port}`))
  })
  .catch(err => {
    console.log(chalk.red(`[Server] 💥 ${err}`))
  })
