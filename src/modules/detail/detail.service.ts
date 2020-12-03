import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getConnection, Not } from 'typeorm'
import { LoggerService } from '@libs/utils/logger.service'
import { VideoEntity } from './entity'

@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    private readonly logger: LoggerService
  ) { }

  public async getDetail (videoId: string): Promise<VideoEntity> {
    let video = await this.videoRepository.findOne({
      where: { videoId },
      cache: true
    })

    if (!video) {
      return new VideoEntity()
    }
    this.logger.info('videoId', video)
    return video
  }
}