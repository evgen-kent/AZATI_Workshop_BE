import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
