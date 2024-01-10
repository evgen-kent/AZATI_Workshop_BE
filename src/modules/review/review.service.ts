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
  IReviewResponseDto,
} from './review.dto';
import { UserService } from '../user/user.service';
import { IPaginatedResponse } from '../../interfaces/paginated-response.interface';

interface IReviewService {
  getReviewsAsync(
    dto: GetReviewsQueryDto,
  ): Promise<IPaginatedResponse<IReviewResponseDto[]>>;

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
  ): Promise<IPaginatedResponse<IReviewResponseDto[]>> {
    const startInt = parseInt(dto.start);
    const limitInt = parseInt(dto.limit);
    const filters = { product_id: dto.product_id ? dto.product_id : null };
    const sortOption = dto.rate === 'asc' ? 1 : -1;
    const reviews = await this.reviewModel
      .find(filters)
      .sort({ rate: sortOption })
      .skip(startInt)
      .limit(limitInt)
      .exec();
    const data = await Promise.all(
      reviews.map(async (review) => {
        return await this.processResponseAsync(review);
      }),
    );
    return {
      total: await this.reviewModel.countDocuments(filters),
      start: startInt,
      limit: limitInt,
      data: data,
    };
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
