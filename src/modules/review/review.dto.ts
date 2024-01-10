import { IUserResponseDto } from '../user/user.dto';
import { Optional } from '@nestjs/common';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

interface IGetReviewsQueryDto {
  rate: string; //asc || desc
  start: string;
  limit: string;
  product_id: string;
}

export class GetReviewsQueryDto implements IGetReviewsQueryDto {
  @Optional()
  rate: string;

  @Optional()
  start: string;

  @Optional()
  limit: string;

  @Optional()
  product_id: string;
}


interface ICreateReviewRequestDto {
  user_id: string;
  product_id: string | null;
  review: string;
  rate: number;
}

export class CreateReviewRequestDto implements ICreateReviewRequestDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsOptional()
  product_id: string | null;

  @IsNotEmpty()
  @IsString()
  review: string;

  @IsNotEmpty()
  @IsNumber()
  rate: number;
}

export interface IReviewResponseDto {
  id: string;
  user: IUserResponseDto;
  product: any | null; //ProductResponseDto as any
  review: string;
  rate: number;
}
