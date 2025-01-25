import { ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      this.configService.get<string>('IS_PUBLIC_KEY'),
      [context.getHandler(), context.getClass()],
    )
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }
}
