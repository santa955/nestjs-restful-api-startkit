import { Controller, Get, Param } from '@nestjs/common'
import { DetailService } from './detail.service'

@Controller('/detail')
export class DetailController {
  constructor(private readonly videoService: DetailService) {
  }

  @Get(':videoId')
  get(@Param('videoId') videoId: string) {
    return this.videoService.getDetail(videoId)
  }
}