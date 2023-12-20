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
import { BrandsModule } from './modules/brands/brands.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: ENV.MONGODB_CLOUD_URI,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    MulterModule.register({ dest: './files' }),

    AuthModule,
    UsersModule,

    ProductsModule,
    BrandsModule,
  ],
  controllers: [AppController, ImagesController],
  providers: [AppService],
})
export class AppModule {}
