import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { DataSource } from 'typeorm'

import { AppModule } from '../src/app.module'

let app: INestApplication
let dataSource: DataSource

beforeAll(async () => {
  dataSource = new DataSource({
    database: ':memory:',
    entities: [__dirname + '/../src/**/*.entity.ts'],
    logging: false,
    synchronize: true,
    type: 'sqlite',
  })
  await dataSource.initialize()

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DataSource)
    .useValue(dataSource)
    .compile()

  app = moduleFixture.createNestApplication()
  await app.init()
})

afterAll(async () => {
  await dataSource.destroy()
  await app.close()
})

export { app, dataSource, request }
