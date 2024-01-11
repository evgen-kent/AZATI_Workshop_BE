import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BrandController } from './brand.controller';
import { DatabaseService } from '../../database/database.service';
import { BrandService } from './brand.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
