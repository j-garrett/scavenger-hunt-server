import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { INestApplication } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { OpenAPIObject } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import * as fs from 'fs'
import * as path from 'path'
import { InstanceToPlainInterceptor } from 'src/instance-to-plain.interceptor'

import { AppModule } from './app.module'

export async function initializeSwagger(app: INestApplication): Promise<void> {
  const config = new DocumentBuilder()
    .setTitle('Scavenger Hunt API')
    .setDescription('API endpoints for building a scavenger hunt')
    .setVersion('0.1')
    .addTag('scavenger hunt')
    .build()
  const swaggerDocument: OpenAPIObject = SwaggerModule.createDocument(
    app,
    config,
    {
      autoTagControllers: true,
    },
  )
  SwaggerModule.setup('api', app, swaggerDocument)
  const outputPath = path.resolve(__dirname, 'swagger-spec.json')
  fs.writeFileSync(outputPath, JSON.stringify(swaggerDocument, null, 2))
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log'] })
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  )
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new InstanceToPlainInterceptor(),
  )
  // Enable CORS and allow requests from port 3001
  app.enableCors({
    origin: 'http://localhost:3001',
  })
  app.use(cookieParser())
  await initializeSwagger(app)
  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
