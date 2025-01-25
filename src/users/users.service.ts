import {
  ClassSerializerInterceptor,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserDto } from 'users/dto/user.dto'

import { UserEntity } from './entities/user.entity'

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: UserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create(createUserDto)
    return await this.userRepository.save(newUser)
  }

  async findAll(): Promise<Omit<UserEntity, 'password'>[]> {
    const users = await this.userRepository.find()
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user
      return result
    })
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }
    return user
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`)
    }
    return user
  }

  async findUserWithPasswordByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`)
    }
    return user
  }

  async remove(id: number): Promise<true> {
    const result = await this.userRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`)
    }
    return true
  }
}
