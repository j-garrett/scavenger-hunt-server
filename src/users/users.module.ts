import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from 'auth/auth.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

import { UserEntity } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [JwtAuthGuard, AuthService, UsersService],
})
export class UsersModule {}
