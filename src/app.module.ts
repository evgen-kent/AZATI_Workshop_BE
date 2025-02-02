import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImagesController } from './modules/images/images.controller';
import { ProductModule } from './modules/product/product.module';
import { DatabaseModule } from './database/database.module';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { SizeModule } from './modules/size/size.module';
import { ColorModule } from './modules/color/color.module';
import { ReviewModule } from './modules/review/review.module';
import fs from 'fs';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MulterModule.register({ dest: './files' }),
    ProductModule,

    BrandModule,
    CategoryModule,
    SizeModule,
    ColorModule,
    ReviewModule,
  ],
  controllers: [AppController, ImagesController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit(): any {
    if (!fs.existsSync('./files')) {
      fs.mkdirSync('./files', { recursive: true });
    }
  }
}
