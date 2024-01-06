import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService],
})
export class ColorModule {}
