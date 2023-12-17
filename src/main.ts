import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from '../config/env.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(ENV.PORT, () => {
    const server = app.getHttpServer();
    const address = server.address();
    const ip = address?.address === '::' ? 'localhost' : address?.address;

    console.log(`Server running on: http://${ip}:${ENV.PORT}`);
  });
}

bootstrap();
