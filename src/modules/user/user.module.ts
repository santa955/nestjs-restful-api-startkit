import { Module, Global } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Global()
@Module({
  imports: [],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }