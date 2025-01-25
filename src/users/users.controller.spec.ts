import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from 'auth/auth.service'
import * as RolesDecorator from 'src/auth/roles.decorator'
import { RolesGuard } from 'src/auth/roles.guard'
import { UserEntity, UserRoles } from 'src/users/entities/user.entity'

import { UserDto } from './dto/user.dto'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

// jest.mock('src/auth/roles.decorator', () => jest.fn())
// TODO: set type properly for module
// const example: any = jest.createMockFromModule('src/auth/roles.decorator')
describe('UsersController', () => {
  const databaseRes: UserEntity = new UserEntity({
    email: 'test@test.com',
    hunts: [],
    id: 1,
    password: 'test',
    role: UserRoles['USER'],
  })
  const serializedRes: Omit<UserEntity, 'password'> = {
    email: 'test@test.com',
    hunts: [],
    id: 1,
    role: UserRoles['USER'],
  }
  let controller: UsersController
  let usersService: UsersService
  let authService: AuthService
  let rolesGuard: RolesGuard
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            validateUser: jest.fn(),
          },
        },
        {
          provide: RolesGuard,
          useValue: {
            canActivate: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
    authService = module.get<AuthService>(AuthService)
    rolesGuard = module.get<RolesGuard>(RolesGuard)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should register a new user', async () => {
      const userDto: UserDto = { email: 'test@test.com', password: 'test' }
      const tokenRes = { accessToken: 'mock test token' }
      jest.spyOn(authService, 'register').mockResolvedValue(tokenRes)

      expect(await controller.create(userDto)).toEqual(tokenRes)
    })
  })

  describe('findAll', () => {
    xit('should only be accessible by superusers', () => {
      // TODO: needs an end to end test too
      // this is more end to end test?
    })
    it('should return an array of users', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue([databaseRes])
      jest.spyOn(rolesGuard, 'canActivate').mockReturnValue(true)
      const rolesSpy = jest.spyOn(RolesDecorator, 'Roles')
      // .mockImplementation(() => {
      //   console.log('rolesSpy')
      //   return jest.fn()
      // })
      // expect(RolesDecorator.Roles).toHaveBeenCalledTimes(12)
      expect(await controller.findAll()).toEqual([serializedRes])
      expect(rolesGuard.canActivate).toHaveBeenCalledTimes(12)
    })
  })

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(databaseRes)
      const actual = await controller.findOne('1')
      console.log('actual', actual)

      expect(actual).toEqual(serializedRes)
    })
  })

  describe('remove', () => {
    it('should let the user delete their own account', async () => {
      jest.spyOn(usersService, 'remove').mockResolvedValue(true)

      expect(
        await controller.remove('1', {
          user: { id: 1, role: UserRoles.USER },
        }),
      ).toEqual({
        message: `User with id 1 deleted`,
        statusCode: 200,
      })
    })

    it('should let a superuser delete any account', async () => {
      jest.spyOn(usersService, 'remove').mockResolvedValue(true)

      expect(
        await controller.remove('1', {
          user: { id: 2, role: UserRoles.SUPERUSER },
        }),
      ).toEqual({
        message: `User with id 1 deleted`,
        statusCode: 200,
      })
    })

    it("should not let a a non-user delete a user's account", async () => {
      await expect(() => controller.remove('1', {})).rejects.toThrow(
        ForbiddenException,
      )
    })

    it("should not let a user delete another user's account", async () => {
      await expect(() =>
        controller.remove('1', { user: { id: 2, role: UserRoles.USER } }),
      ).rejects.toThrow(ForbiddenException)
    })

    it('should return error if user does not exist', async () => {
      jest
        .spyOn(usersService, 'remove')
        .mockRejectedValue(
          new NotFoundException(`User with id 99999 not found`),
        )

      expect(() =>
        controller.remove('99999', {
          user: { id: 2, role: UserRoles.SUPERUSER },
        }),
      ).rejects.toThrow(NotFoundException)
    })
  })
})
