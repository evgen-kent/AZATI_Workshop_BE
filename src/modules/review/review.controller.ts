import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  CreateReviewRequestDto,
  GetReviewsQueryDto,
  IReviewResponseDto,
} from './review.dto';
import { IPaginatedResponse } from '../../interfaces/paginated-response.interface';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  getReviews(
    @Query() dto: GetReviewsQueryDto,
  ): Promise<IPaginatedResponse<IReviewResponseDto[]>> {
    return this.reviewService.getReviewsAsync(dto);
  }

  @Post()
  createReview(
    @Body() dto: CreateReviewRequestDto,
  ): Promise<IReviewResponseDto> {
    return this.reviewService.createReviewAsync(dto);
  }
}
