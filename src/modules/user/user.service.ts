import { Injectable, UnauthorizedException } from '@nestjs/common'

export type User = any

@Injectable()
export class UserService {
  private readonly users: User[]

  constructor() {
    this.users = [
      { userId: 20923813, userName: 'ack', nickName: '上古神族后裔', password: 'jackbb', avatar: 'http://www.520touxiang.com/uploads/allimg/2018122414/dtsvlpgupmj.jpg' },
      { userId: 20283710, userName: 'anbo', nickName: '天朝安国公 兵马大元帅 护国大将军', password: 'secret', avatar: 'http://m.imeitou.com/uploads/allimg/2020090114/ctqeqowogt4-lp.jpg' },
      { userId: 25361091, userName: 'mack', nickName: 'Hero Mack', password: 'guess', avatar: 'http://m.imeitou.com/uploads/allimg/2019111009/bbwxzbmt5pv.jpeg' },
    ]
  }

  public async login (loginUser) {
    let userName: string = loginUser.userName
    let password: string = loginUser.password
    let user = this.users.find(u => u.password === password && u.userName === userName)

    if (!user) {
      throw new UnauthorizedException('用户名或密码不正确')
    }

    return user
  }

  public async findOne (userName: string): Promise<User | undefined> {
    return this.users.find(user => user.userName === userName)
  }

  public async findById (userId: number | string): Promise<User | undefined> {
    return this.users.find(user => user.userId == userId)
  }
}