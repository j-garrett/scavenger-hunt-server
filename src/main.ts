import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log'] });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Scavenger Hunt API')
    .setDescription('API endpoints for building a scavenger hunt')
    .setVersion('0.1')
    .addTag('scavenger hunt')
    .build();
  const swaggerOptions = {
    autoTagControllers: true,
  };
  const swaggerDocument = SwaggerModule.createDocument(
    app,
    config,
    swaggerOptions,
  );
  SwaggerModule.setup('api', app, swaggerDocument);
  const outputPath = path.resolve(__dirname, 'swagger-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(swaggerDocument, null, 2));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
