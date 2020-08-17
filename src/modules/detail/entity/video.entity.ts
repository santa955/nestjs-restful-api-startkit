import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('videos')
export class VideoEntity {
  @PrimaryColumn()
  videoId: string

  @Column()
  videoType: number

  @Column()
  videoName: string

  @Column()
  videoTypeName: string

  @Column()
  aliasName: string

  @Column()
  videoDesc: string

  @Column()
  iconVertical: string

  @Column()
  iconHorizontal: string

  @Column()
  episode: number

  @Column()
  episodeCurr: number

  @Column()
  updateStatus: number

  @Column()
  updateDay: string

  @Column()
  screenDate: Date

  @Column({ type: 'float' })
  score: number

  @Column({ type: 'float' })
  doubanScore: number

  @Column({ type: 'integer' })
  viewCount: number

  @Column({ type: 'text' })
  summary: string

  @Column()
  addrSD: string

  @Column()
  addrHD: string

  @Column()
  addrUltra: string

  @Column()
  actors: string

  @Column()
  director: string

  @Column()
  language: string

  @Column()
  tags: string

  @Column()
  isTop: number

  @Column({ type: 'timestamp' })
  createDate: string

  @Column({ type: 'timestamp' })
  updateDate: string
}