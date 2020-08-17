import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DetailController } from './detail.controller'
import { DetailService } from './detail.service'
import { VideoEntity } from './entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoEntity,
    ])
  ],
  controllers: [DetailController],
  providers: [DetailService],
})
export class DetailModule { }