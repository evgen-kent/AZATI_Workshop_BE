import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImagesController } from './modules/images/images.controller';
import { ProductsModule } from './modules/products/products.module';
import { ENV } from '../config/env.interface';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: ENV.MONGODB_CLOUD_URI,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    AuthModule,
    UsersModule,
    MulterModule.register({ dest: './files' }),
    ProductsModule,
  ],
  controllers: [AppController, ImagesController],
  providers: [AppService],
})
export class AppModule {}
