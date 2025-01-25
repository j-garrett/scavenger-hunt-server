import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthService } from 'auth/auth.service'
import { Roles } from 'auth/roles.decorator'
import { RolesGuard } from 'auth/roles.guard'
import { instanceToPlain } from 'class-transformer'
import { Request } from 'express'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { LoadedUserDto } from 'src/users/dto/loaded-user.dto'

import { UserDto } from './dto/user.dto'
import { UserRoles } from './entities/user.entity'
import { UsersService } from './users.service'

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: UserDto) {
    return instanceToPlain(this.authService.register(createUserDto))
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPERUSER)
  @Get()
  async findAll() {
    console.log('test some guards please')

    return instanceToPlain(await this.usersService.findAll())
  }

  // TODO: add public profile endpoint
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    // req relies on user object being attached to the request by the JwtAuthGuard
    @Req() req: { user?: { role: UserRoles; id: number } },
  ) {
    const user = req.user
    const getTargetId = Number(id)

    if (
      !user ||
      (user.role !== UserRoles.SUPERUSER && user.id !== getTargetId)
    ) {
      throw new ForbiddenException()
    }
    return instanceToPlain(
      await this.usersService.findOne(Number(id)),
    ) as LoadedUserDto
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    // req relies on user object being attached to the request by the JwtAuthGuard
    @Req() req: { user?: { role: UserRoles; id: number } },
  ) {
    const user = req.user
    const deleteTargetId = Number(id)

    if (
      !user ||
      (user.role !== UserRoles.SUPERUSER && user.id !== deleteTargetId)
    ) {
      throw new ForbiddenException('You are not allowed to delete this user')
    }

    await this.usersService.remove(deleteTargetId)
    return {
      message: `User with id ${id} deleted`,
      statusCode: 200,
    }
  }
}
