// FILE: generate-swagger.ts
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import * as path from 'path'

import { AppModule } from './src/app.module'

async function generateSwaggerSpec() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('Scavenger Hunt API')
    .setDescription('API documentation for Scavenger Hunt')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  const outputPath = path.resolve(__dirname, 'dist', 'swagger-spec.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2))
  await app.close()
}

generateSwaggerSpec()
  .then(() => {
    console.log('Swagger spec generated')
  })
  .catch((error) => {
    console.error('Error generating Swagger spec', error)
  })
