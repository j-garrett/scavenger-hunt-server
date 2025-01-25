import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from 'auth/auth.service'
import { JwtStrategy } from 'auth/jwt.strategy'
import { RolesGuard } from 'auth/roles.guard'

import { AuthController } from './auth.controller'

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, RolesGuard],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthController)
  })

  describe('login', () => {
    it('should return an access token on success', async () => {
      const result = { accessToken: 'test token' }
      jest
        .spyOn(authService, 'login')
        .mockImplementation(() =>
          Promise.resolve({ accessToken: result.accessToken }),
        )

      expect(
        await authController.login({
          email: 'test@test.com',
          password: 'test',
        }),
      ).toBe(result)
    })
  })

  describe('register', () => {
    it('should return a user object', async () => {
      const result = {
        accessToken: 'token',
        email: 'test@test.com',
        id: 1,
        password: 'test',
      }
      jest
        .spyOn(authService, 'register')
        .mockImplementation(() => Promise.resolve(result))

      expect(
        await authController.register({
          email: 'test@test.com',
          password: 'test',
        }),
      ).toBe(result)
    })
  })
})
