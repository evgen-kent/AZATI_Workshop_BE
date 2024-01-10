import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  CreateReviewRequestDto,
  GetReviewsQueryDto,
  IGetReviewsResponseDto,
  IReviewResponseDto,
} from './review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  getReviews(
    @Query() dto: GetReviewsQueryDto,
  ): Promise<IGetReviewsResponseDto> {
    return this.reviewService.getReviewsAsync(dto);
  }

  @Post()
  createReview(@Body() dto: CreateReviewRequestDto): Promise<IReviewResponseDto> {
    return this.reviewService.createReviewAsync(dto);
  }
}
