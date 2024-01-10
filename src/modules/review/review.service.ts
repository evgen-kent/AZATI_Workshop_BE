import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from '../../database/schemas/review.schema';
import { Model } from 'mongoose';
import {
  CreateReviewRequestDto,
  GetReviewsQueryDto,
  IGetReviewsResponseDto,
  IReviewResponseDto,
} from './review.dto';

interface IReviewService {
  getReviewsAsync(dto: GetReviewsQueryDto): Promise<IGetReviewsResponseDto>;

  createReviewAsync(dto: CreateReviewRequestDto): Promise<IReviewResponseDto>;
}

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  async getReviewsAsync(
    dto: GetReviewsQueryDto,
  ): Promise<IGetReviewsResponseDto> {
    throw new Error('Method not implemented.');
  }

  async createReviewAsync(
    dto: CreateReviewRequestDto,
  ): Promise<IReviewResponseDto> {
    throw new Error('Method not implemented.');
  }
}
