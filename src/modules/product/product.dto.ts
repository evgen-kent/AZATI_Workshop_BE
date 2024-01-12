import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IColorDto } from '../color/color.dto';
import { ISizeDto } from '../size/size.dto';
import { ICategory } from '../../database/schemas/category.schema';
import { IBrandDto } from '../brand/brand.dto';
import { ICategoryDto } from '../category/category.dto';

export interface ICreateProductFiles {
  image: Express.Multer.File;
  additional_images?: Express.Multer.File[];
}

interface ICreateProductRequestDto {
  title: string;
  description: string;
  cost: string;
  discount: string;
  category_id: string;
  brand_id: string;
  colors: string;
  sizes: string;
}

export class CreateProductRequestDto implements ICreateProductRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  cost: string;

  @IsOptional()
  discount: string;

  @IsString()
  category_id: string;

  @IsString()
  brand_id: string;

  @IsString()
  colors: string;

  @IsString()
  sizes: string;
}

export interface IProductResponseDto {
  id: string;
  title: string;
  description: string;
  cost: number;
  discount: number | null;
  total_cost: number;
  rate: number;
  category: ICategoryDto;
  brand: IBrandDto;
  colors: Omit<IColorDto, 'available'>[];
  size: Omit<ISizeDto, 'available'>[];
  image_path: string;
  additional_images: string[];
}
