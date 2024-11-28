import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserDto } from 'src/users/dto/user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: UserDto) {
    return this.authService.login(loginDto)
  }

  @Post('register')
  async register(@Body() createUserDto: UserDto) {
    return this.authService.register(createUserDto)
  }
}
