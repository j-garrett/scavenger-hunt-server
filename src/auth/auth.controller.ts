import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { UserDto } from '../users/dto/user.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: UserDto) {
    return this.authService.login(loginDto)
  }

  @Post('register')
  async register(@Body() createUserDto: UserDto) {
    return this.authService.register(createUserDto)
  }
}
