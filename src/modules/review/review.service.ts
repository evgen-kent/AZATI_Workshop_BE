import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from '../../database/schemas/review.schema';
import { Model } from 'mongoose';
import {
  CreateReviewRequestDto,
  GetReviewsQueryDto,
  IGetReviewsResponseDto,
  IReviewResponseDto,
} from './review.dto';
import { UserService } from '../user/user.service';

interface IReviewService {
  getReviewsAsync(dto: GetReviewsQueryDto): Promise<IGetReviewsResponseDto>;

  createReviewAsync(dto: CreateReviewRequestDto): Promise<IReviewResponseDto>;
}

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    private readonly userService: UserService,
  ) {}

  async getReviewsAsync(
    dto: GetReviewsQueryDto,
  ): Promise<IGetReviewsResponseDto> {
    throw new Error('Method not implemented.');
  }

  async createReviewAsync(
    dto: CreateReviewRequestDto,
  ): Promise<IReviewResponseDto> {
    try {
      const createdReview = new this.reviewModel(dto);
      const response = await this.processResponseAsync(createdReview);
      await createdReview.save();
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async processResponseAsync({
    _id,
    user_id,
    product_id,
    review,
    rate,
  }: ReviewDocument): Promise<IReviewResponseDto> {
    return {
      id: _id,
      user: await this.userService.findUserByIdAsync(user_id),
      product: null,
      review,
      rate,
    };
  }
}
