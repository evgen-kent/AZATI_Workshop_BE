import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from '../../database/database.module';
import { BrandModule } from '../brand/brand.module';
import { CategoryModule } from '../category/category.module';
import { SizeModule } from '../size/size.module';
import { ColorModule } from '../color/color.module';

@Module({
  imports: [
    DatabaseModule,
    BrandModule,
    CategoryModule,
    SizeModule,
    ColorModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
