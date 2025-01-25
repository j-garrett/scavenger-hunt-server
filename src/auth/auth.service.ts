import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UserDto } from 'users/dto/user.dto'

import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)
    if (await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user // eslint-disable-line @typescript-eslint/no-unused-vars
      return result
    } else {
      throw new UnauthorizedException()
    }
  }

  async login({
    email,
    password: pass,
  }: UserDto): Promise<{ accessToken: string; userId: string }> {
    const user = await this.validateUser(email, pass)
    const payload = { email: user.email, sub: user.id }
    return {
      accessToken: await this.jwtService.signAsync(payload),
      userId: user.id,
    }
  }

  async register(createUserDto: UserDto) {
    const { email, password } = createUserDto
    try {
      const existingUser = await this.validateUser(email, password)
      if (existingUser) {
        throw new ConflictException('User already exists')
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const userWithHashedPassword = {
          email,
          password: hashedPassword,
        }

        await this.usersService.create(userWithHashedPassword)
        return this.login({ email, password })
      }
    }
  }
}
