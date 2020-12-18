import { Controller, Get, Post, Req, Param, UseGuards, HttpCode, Res } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '@modules/auth/auth.service'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async login (@Req() req, @Res({ passthrough: true }) res) {
    let maxAage = 7 * 24 * 60 * 60 * 1000
    let expires = new Date(Date.now() + maxAage)
    let { token, ...user } = req.user
    let jwt = await this.authService.signJwt(user)
    res.cookie('token', jwt, {
      httpOnly: true,
      expires,
      maxAage,
      sameSite: true,
    })
    return user
  }

  @Get('logout')
  async logout (@Res({ passthrough: true }) res) {
    res.cookie('token', '', { maxAage: 0, expires: new Date() })
    return 1
  }

  @Get(':userId')
  @UseGuards(AuthGuard('jwt'))
  async query (@Param('userId') userId: number) {
    return this.userService.findById(userId)
  }
}