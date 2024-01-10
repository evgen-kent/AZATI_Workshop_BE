import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImagesController } from './modules/images/images.controller';
import { ProductModule } from './modules/product/product.module';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './modules/category/category.module';
import { SizeModule } from './modules/size/size.module';
import { ColorModule } from './modules/color/color.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MulterModule.register({ dest: './files' }),
    ProductModule,

    CategoryModule,
    SizeModule,
    ColorModule,
  ],
  controllers: [AppController, ImagesController],
  providers: [AppService],
})
export class AppModule {}
