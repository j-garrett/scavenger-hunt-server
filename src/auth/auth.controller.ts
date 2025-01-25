import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common'
import { Response } from 'express'

import { UserDto } from '../users/dto/user.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginDto: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginResult = await this.authService.login(loginDto)
    response.cookie('accessToken', loginResult.accessToken, {
      httpOnly: true,
    })
    return loginResult
  }

  @Post('register')
  async register(
    @Body() createUserDto: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const registerResult = await this.authService.register(createUserDto)
    response.cookie('accessToken', registerResult?.accessToken, {
      httpOnly: true,
    })
    return registerResult
  }
}
