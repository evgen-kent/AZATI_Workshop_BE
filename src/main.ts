import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from '../config/env.interface';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(ENV.PORT, ENV.HOST, () => {
    console.log(`Server running on: ${ENV.PROTOCOL}://${ENV.HOST}:${ENV.PORT}`);
  });
}

bootstrap();
