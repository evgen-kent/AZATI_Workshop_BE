import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from '../config/env.interface';
import { ValidationPipe } from '@nestjs/common';
import { loadEnvironmentVariables } from './utils/env.loader';
import * as process from 'process';

async function bootstrap() {
  try {
    loadEnvironmentVariables();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(ENV.PORT, () => {
    console.log(`Server running on: ${ENV.PROTOCOL}://${ENV.HOST}:${ENV.PORT}`);
  });
}

bootstrap();
