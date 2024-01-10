import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ENV } from '../../config/env.interface';
import { User, UserSchema } from './schemas/user.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { DatabaseService } from './database.service';
import { Category, CategorySchema } from './schemas/category.schema';
import { Size, SizeSchema } from './schemas/size.schema';
import { Color, ColorSchema } from './schemas/color.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: ENV.MONGODB_CLOUD_URI,
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Size.name, schema: SizeSchema },
      { name: Color.name, schema: ColorSchema },
      // ...
    ]),
  ],
  providers: [DatabaseService],
  exports: [MongooseModule],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    await this.databaseService.initializeAll();
  }
}
