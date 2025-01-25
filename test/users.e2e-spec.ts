import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserEntity, UserRoles } from 'src/users/entities/user.entity'

import { app, dataSource, request } from './setup'

async function getAuthToken(
  app: INestApplication,
  password: string,
  email: string,
): Promise<string> {
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(200)

  return loginResponse.body.accessToken
}

type UserIdsByType = {
  [key in UserRoles]: number
}

type UserTokensByType = {
  [key in UserRoles]: string
}

// TODO: a lot of this should probably be unit tests...
describe('UsersController (e2e)', () => {
  const testPassword = 'testpassword'
  const hashedTestPassword = bcrypt.hashSync(testPassword, 10)
  const testAdminEmail = UserRoles.ADMIN
  const testGuestEmail = UserRoles.GUEST
  const testSuperEmail = UserRoles.SUPERUSER
  const testEmail = UserRoles.USER
  const authTokens: UserTokensByType = {} as UserTokensByType
  const ids: UserIdsByType = {} as UserIdsByType

  const addTestUsers = async (userTypes: UserRoles[]) => {
    const userRepository = dataSource.getRepository(UserEntity)
    const userTypeIds = userTypes.map(async (userType) => {
      const userEntity = new UserEntity({
        Email: userType,
        password: hashedTestPassword,
        role: userType,
      })
      ids[userType] = (await userRepository.save(userEntity)).id
    })
    return Promise.all(userTypeIds)
  }

  const getAuthTokens = async (userTypes: UserRoles[]) => {
    const promises = userTypes.map(async (userType) => {
      const token = await getAuthToken(app, testPassword, userType)
      authTokens[userType] = token
    })
    return Promise.all(promises)
  }

  beforeAll(async () => {
    const userTypes = [
      testAdminEmail,
      testGuestEmail,
      testSuperEmail,
      testEmail,
    ]
    await addTestUsers(userTypes)
    await getAuthTokens(userTypes)
  })
  afterAll(async () => {
    const userRepository = dataSource.getRepository(UserEntity)
    await userRepository.clear()
  })

  it('/users (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        Email: 'testuserPOST',
        password: 'testpassword',
      })
      .expect(201)

    expect(response.body).toMatchObject({ accessToken: expect.any(String) })
    expect(response.body).not.toHaveProperty('password')
  })

  describe('/users (GET)', () => {
    it('should return an array of users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authTokens[testSuperEmail]}`)
        .expect(200)

      expect(response.body).toBeInstanceOf(Array)
      expect(response.body[0]).toMatchObject({
        Email: expect.any(String),
        id: expect.any(Number),
        role: expect.any(String),
      })
    })

    it('should not include passwords', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authTokens[testSuperEmail]}`)
        .expect(200)

      expect(response.body[0]).not.toHaveProperty('password')
    })

    it('should only be accessible for superusers', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authTokens[testEmail]}`)
        .expect(403)

      expect(response.body).toMatchObject({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      })
    })
  })

  it('/users/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${ids[testEmail]}`)
      .expect(200)

    expect(response.body).toMatchObject({
      Email: expect.any(String),
      id: ids[testEmail],
      role: expect.any(String),
    })
    expect(response.body).not.toHaveProperty('password')
  })

  describe('/users/:id (DELETE)', () => {
    const testDeleteEmail = 'testUserDelete'
    let testDeleteUserId: number
    let testDeleteAuthToken: string

    beforeEach(async () => {
      const userRepository = dataSource.getRepository(UserEntity)
      const userEntity = new UserEntity({
        Email: testDeleteEmail,
        password: hashedTestPassword,
        role: testEmail,
      })
      testDeleteUserId = (await userRepository.save(userEntity)).id
      testDeleteAuthToken = await getAuthToken(
        app,
        testPassword,
        testDeleteEmail,
      )
    })

    afterEach(async () => {
      const userRepository = dataSource.getRepository(UserEntity)
      await userRepository.delete({ Email: testDeleteEmail })
    })

    it('should let the user delete their own account', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${testDeleteUserId}`)
        .set('Authorization', `Bearer ${testDeleteAuthToken}`)
        .expect(200)

      expect(response.body).toMatchObject({
        message: `User with id ${testDeleteUserId} deleted`,
        statusCode: 200,
      })
    })

    it('should let a superuser delete any account', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${testDeleteUserId}`)
        .set('Authorization', `Bearer ${authTokens[testSuperEmail]}`)
        .expect(200)

      expect(response.body).toMatchObject({
        message: `User with id ${testDeleteUserId} deleted`,
        statusCode: 200,
      })
    })

    it("should not let a a non-user delete a user's account", async () => {
      await request(app.getHttpServer())
        .delete(`/users/${testDeleteUserId}`)
        .expect(401)
    })

    it("should not let a user delete another user's account", async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${testDeleteUserId}`)
        .set('Authorization', `Bearer ${authTokens[testEmail]}`)
        .expect(403)

      expect(response.body).toMatchObject({
        error: 'Forbidden',
        message: 'You are not allowed to delete this user',
        statusCode: 403,
      })
    })

    it('should return 200', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${ids[testEmail]}`)
        .set('Authorization', `Bearer ${authTokens[testSuperEmail]}`)
        .expect(200)
    })

    it('should return error if user does not exist', async () => {
      const nonExistentUserId = 9999
      const response = await request(app.getHttpServer())
        .delete(`/users/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${authTokens[testSuperEmail]}`)
        .expect(404)

      expect(response.body).toMatchObject({
        message: `User with id ${nonExistentUserId} not found`,
        statusCode: 404,
      })
    })

    it('should remove user from database', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${testDeleteUserId}`)
        .set('Authorization', `Bearer ${testDeleteAuthToken}`)
        .expect(200)

      await request(app.getHttpServer())
        .get(`/users/${testDeleteUserId}`)
        .set('Authorization', `Bearer ${authTokens[testGuestEmail]}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toMatchObject({
            message: `User with id ${testDeleteUserId} not found`,
            statusCode: 404,
          })
        })
    })
  })
})
