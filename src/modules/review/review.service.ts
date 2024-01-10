import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from '../../database/schemas/review.schema';
import { Model } from 'mongoose';

interface IReviewService {
  getReviewsAsync(dto: any): Promise<any>;

  createReviewAsync(dto: any): Promise<any>;
}

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  async getReviewsAsync(dto: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async createReviewAsync(dto: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
