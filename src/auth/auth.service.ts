import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result;
    }
    throw new UnauthorizedException();
  }

  async login({
    username,
    password: pass,
  }: UserDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(username, pass);
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(createUserDto: UserDto) {
    const { username, password } = createUserDto;
    const existingUser = await this.validateUser(username, password);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword,
    };

    await this.usersService.create(userWithHashedPassword);
    return this.login({ username, password });
  }
}
