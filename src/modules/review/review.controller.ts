import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  getReviews(@Query() dto: any) {
    return this.reviewService.getReviewsAsync(dto);
  }

  @Post()
  createReview(@Body() dto: any) {
    return this.reviewService.createReviewAsync(dto);
  }
}
