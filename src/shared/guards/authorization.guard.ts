import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthService } from '@modules/auth/auth.service'

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }

  canActivate (context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    let req = context.switchToHttp().getRequest()
    let { token = '' } = req.cookies || {}
    if (!token) {
      throw new UnauthorizedException('用户信息出错，请重新登录')
    }
    let user = this.authService.validateToken(token)
    if (!user) {
      throw new UnauthorizedException('用户信息出错，请重新登录')
    }

    req.user = user
    return true
  }
}