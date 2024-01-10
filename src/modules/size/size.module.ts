import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SizeController],
  providers: [SizeService],
  exports: [SizeService],
})
export class SizeModule {}
