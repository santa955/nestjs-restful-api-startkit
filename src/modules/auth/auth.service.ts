import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptoService } from '@common/utils/crypto.service'
import { UserService } from '@modules/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private cryptoService: CryptoService,
    private userService: UserService
  ) { }

  public async validateUser (userName: string, password: string): Promise<any> {
    const user = await this.userService.findOne(userName)
    if (user && user.password === password) {
      const { password, ...reset } = user
      const token = await this.signature(user.userId)
      return { ...reset, token }
    }
    return null
  }

  public async signJwt (user): Promise<string> {
    const payload = { username: user.userName, sub: user.userId }
    const token = await this.jwtService.sign(payload)
    console.log(token)
    return token
  }

  public async validateToken (token: string): Promise<any> {
    let userId, user

    if (!token) return false
    userId = await this.decryptSignature(token)
    user = await this.userService.findById(userId)
    if (user) {
      const { password, ...reset } = user
      return reset
    }
    return user
  }

  public async signature (userId: number): Promise<string> {
    return await this.cryptoService.encrypt(userId.toString())
  }

  public async decryptSignature (token: string): Promise<string> {
    return await this.cryptoService.decrypt(token)
  }
}